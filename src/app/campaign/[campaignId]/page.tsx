"use client";
import React, { useEffect, useState } from "react";

import ProductCard from "@/shared/productCard";

import { ProductType } from "@/data/types";
import { LoaderCircle } from "lucide-react";
import Heading from "@/shared/Heading/Heading";
import Head from "next/head";
import useCampaign from "@/hooks/useCampaign";
import { ICampaign } from "@/lib/interface";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const SingleCampaignPage = ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [campaign, setCampaign] = useState<ICampaign | null>(null);

  const { fetchActiveCampaignById } = useCampaign();

  const getCampaignById = async () => {
    setLoading(true);
    const response = await fetchActiveCampaignById(campaignId);
    if (!!response) {
      const { campaign, products } = response;
      if (!!campaign) {
        setCampaign(campaign);
      }
      if (!!products) setProducts(products);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (campaign) {
      updateCountdown(campaign.endDate);
      const interval = setInterval(
        () => updateCountdown(campaign.endDate),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [campaign]);

  useEffect(() => {
    getCampaignById();
    //eslint-disable-next-line
  }, [campaignId]);

  const updateCountdown = (endDate: string) => {
    const now = dayjs();
    const end = dayjs(endDate);
    const diff = end.diff(now);

    if (diff > 0) {
      const duration = dayjs.duration(diff);
      const days = Math.floor(duration.asDays()).toString().padStart(2, "0");
      const hours = duration.hours().toString().padStart(2, "0");
      const minutes = duration.minutes().toString().padStart(2, "0");
      const seconds = duration.seconds().toString().padStart(2, "0");

      setTimeLeft(`${days}:${hours}:${minutes}:${seconds}`);
    } else {
      setTimeLeft("Expired");
    }
  };

  return (
    <>
      <Head>
        <title>{!!campaign ? campaign?.title : "Prior Campaign"}</title>
        <meta
          name="description"
          content={campaign?.description || "Campaign description"}
        />
        <meta property="og:title" content={campaign?.title || "Campaign"} />
        <meta
          property="og:description"
          content={campaign?.description || "Campaign description"}
        />
        <meta
          property="og:image"
          content={campaign?.image || "/default-image.jpg"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="my-6">
        <h1 className="w-full text-center font-extrabold text-lg md:text-2xl uppercase">
          {campaign?.title}
        </h1>
        <h3 className="w-full text-center font-normal text-zinc-600 text-xs md:text-sm">
          {campaign?.description}
        </h3>
        <div className="flex flex-col justify-center items-center px-28 py-2 rounded-md">
          <div className="grid grid-cols-4 gap-4 ml-1 mt-2">
            <div className="flex flex-col gap-2">
              <Badge
                variant={"outline"}
                className="text-base font-semibold p-10"
              >
                {timeLeft.split(":")[0]}
              </Badge>
              <span className="text-sm font-semibold uppercase text-center">
                Days
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant={"outline"}
                className="text-base font-semibold p-10"
              >
                {timeLeft.split(":")[1]}
              </Badge>
              <span className="text-sm font-semibold uppercase text-center">
                Hours
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant={"outline"}
                className="text-base font-semibold p-10"
              >
                {timeLeft.split(":")[2]}
              </Badge>
              <span className="text-sm font-semibold uppercase text-center">
                Minutes
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant={"outline"}
                className="text-base font-semibold p-10"
              >
                {timeLeft.split(":")[3]}
              </Badge>
              <span className="text-sm font-semibold uppercase text-center">
                Seconds
              </span>
            </div>
          </div>
        </div>

        {/* {!!campaign?.image && (
          <div className=" container relative w-full h-[400px] max-h-[40vh] mb-2">
            <Image
              src={campaign?.image}
              alt={`img_${campaign?.title}`}
              fill
              className="object-fill h-full w-full absolute"
            />
          </div>
        )} */}
        <div
          className="px-4 md:container relative flex flex-col lg:flex-row"
          id="body"
        >
          <div className="mb-4 md:mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
          <div className="relative flex-1">
            <div className="grid flex-1 mt-10 gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-10 grid-cols-2 xl:grid-cols-4 ">
              {!loading &&
                !timeLeft.includes("Expired") &&
                products.map((item: ProductType) => (
                  <ProductCard product={item} key={item.id} />
                ))}
              {loading && (
                <span className="flex justify-center items-center gap-2">
                  loading... <LoaderCircle className="w-5 h-5 ml-2" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* <div className='my-24'>
        <SectionBrands />
      </div> */}
      </div>
    </>
  );
};

export default SingleCampaignPage;
