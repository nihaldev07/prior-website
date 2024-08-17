import type { FC } from "react";
import React from "react";

import Ratings from "./Ratings";
import { RatingDetailsType } from "@/data/types";

interface SectionProductInfoProps {
  overview: string;
  shipment_details: {
    icon: JSX.Element;
    title: string;
    description: string;
  }[];
  ratings: number;
  ratingDetails: RatingDetailsType[];
}

const SectionProductInfo: FC<SectionProductInfoProps> = ({
  overview,
  shipment_details,
  ratings,
  ratingDetails,
}) => {
  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <Ratings rating={ratings} ratingDetails={ratingDetails} />
      <div />
    </div>
  );
};

export default SectionProductInfo;
