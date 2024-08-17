import type { FC } from "react";
import React from "react";

import Heading from "@/shared/Heading/Heading";
import { RatingDetailsType } from "@/data/types";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingsProps {
  rating: number;
  ratingDetails: RatingDetailsType[];
}

const Ratings: FC<RatingsProps> = ({ rating, ratingDetails }) => {
  return (
    <div>
      <Heading className="mb-0">Ratings</Heading>

      <div className="flex items-center gap-5">
        <div className="space-y-3">
          <p className="text-[70px] font-semibold md:text-[100px]">
            {rating}
            <span className="text-base text-secondary">/5</span>
          </p>
          {/* <p className="text-neutral-500">{`(${reviews} Reviews)`}</p> */}
        </div>

        <div className="w-full space-y-2">
          {!!ratingDetails &&
            ratingDetails.map((ratingItem: RatingDetailsType) => (
              <div key={ratingItem.index} className="flex items-center gap-2">
                <div className="flex items-center gap-1 font-medium">
                  <Star className="text-yellow-400" />
                  {ratingItem.index}
                </div>
                <Progress value={ratingItem.value} className="bg-primary" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Ratings;
