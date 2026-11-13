import { useEffect, useState } from "react";
import { hostName } from "@/utils/config";

/**
 * Server-configured locations (divisions → districts with delivery charges).
 *
 * The backend locations collection is the source of truth for delivery
 * charges (admin-configurable). Falls back to `null` data on failure so
 * callers can use the hardcoded constants (previous behavior) — checkout
 * keeps working if the API is unreachable.
 */

export interface ApiLocationDistrict {
  id: string;
  sourceId: string;
  name: string;
  bnName: string;
  zone: { id: string; name: string; label: string } | null;
  charge: number;
}

export interface ApiDivision {
  divisionId: string;
  division: string;
  districts: ApiLocationDistrict[];
}

export interface LocationsData {
  version: number;
  divisions: ApiDivision[];
}

export const useLocations = () => {
  const [data, setData] = useState<LocationsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${hostName}/prior/location/locations`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled && json?.success) setData(json.data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load locations");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { locations: data, error };
};

/**
 * Charge lookup over the API locations list. Returns undefined when the
 * district isn't found in the server config (caller decides the fallback).
 */
export const getChargeFromLocations = (
  locations: LocationsData | null,
  divisionId: string,
  districtName: string,
): number | undefined => {
  if (!locations) return undefined;
  const division = locations.divisions.find((d) => d.divisionId === divisionId);
  const districts = division ? division.districts : locations.divisions.flatMap((d) => d.districts);
  const district = districts.find((d) => d.name === districtName);
  if (!district || !district.charge) return undefined;
  return district.charge;
};
