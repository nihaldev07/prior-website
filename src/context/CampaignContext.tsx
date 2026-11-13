"use client";

import useCampaign from "@/hooks/useCampaign";
import { ICampaign, ICampaingProducts } from "@/lib/interface";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CampaignContextType {
  campaign: ICampaign | null;
  products: ICampaingProducts[];
  loading: boolean;
  refreshCampaign: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignContext must be used within a CampaignProvider"
    );
  }
  return context;
};

/**
 * Fetches the active campaign once and shares it across the
 * announcement bar, homepage popup, and any other campaign surface.
 */
export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { fetchActiveCampaign } = useCampaign();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [products, setProducts] = useState<ICampaingProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCampaign = useCallback(async () => {
    setLoading(true);
    const data = await fetchActiveCampaign();
    setCampaign(data?.activeCampaign ?? null);
    setProducts(data?.products ?? []);
    setLoading(false);
  }, [fetchActiveCampaign]);

  useEffect(() => {
    refreshCampaign();
  }, [refreshCampaign]);

  const value = useMemo(
    () => ({ campaign, products, loading, refreshCampaign }),
    [campaign, products, loading, refreshCampaign]
  );

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export default CampaignContext;
