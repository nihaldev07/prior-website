"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import useCampaign from "@/hooks/useCampaign";
import { ICampaign } from "@/lib/interface";
import useCategory from "@/hooks/useCategory";
import useThrottledEffect from "@/hooks/useThrottleEffect";
import CampaignBanner from "./NewCampaignView";

dayjs.extend(duration);
dayjs.extend(relativeTime);

type Campaign = {
  id: string;
  title: string;
  description: string;
  image?: string;
  endDate: string;
};

const CampaignPage = () => {
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [productImgs, setProductImgs] = useState<string[]>([]);
  const { fetchActiveCampaign } = useCampaign();
  const router = useRouter();

  const [flashSaleCategory, setFlashSaleCategory] = useState<any>({});
  const { fetchCategories } = useCategory();

  useThrottledEffect(
    async () => {
      const data = await fetchCategories();
      const cat = data.filter(
        (d: any) => d.id === "3cc953ce-d453-4f5d-99df-5f31b0342e15"
      );
      if (!!cat && cat.length > 0) {
        setFlashSaleCategory(cat[0]);
      }
    },
    [],
    2000
  );

  useEffect(() => {
    const fetchCampaign = async () => {
      const fetchedCampaign = await fetchActiveCampaign();
      if (!!fetchedCampaign) {
        const { activeCampaign, products = [] } = fetchedCampaign;
        if (!!products && products?.length > 0) {
          setProductImgs(products?.map((p) => p?.thumbnail));
        }
        setCampaign(activeCampaign);
      } else {
        setCampaign(null);
      }
    };

    fetchCampaign();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (campaign) {
      updateCountdown(campaign.endDate);
      const interval = setInterval(
        () => updateCountdown(campaign.endDate),
        1000
      );
      return () => clearInterval(interval);
    }
    //eslinst-disable-next-line
  }, [campaign]);

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

  const handleNavigate = () => {
    if (campaign?.id) {
      router.push(`/campaign/${campaign.id}`);
    }
  };

  const renderFlashSaleCategory = () => {
    return (
      <div
        className='flex items-center justify-center min-h-[20vh] bg-gradient-to-r from-indigo-600 to-pink-500 mt-4 py-2 cursor-pointer'
        onClick={() => {
          router.push("/category/3cc953ce-d453-4f5d-99df-5f31b0342e15");
        }}>
        {/* <!-- Outer Box with animated background --> */}
        <div className='relative w-full h-48 sm:h-60 lg:h-96 bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 rounded-lg overflow-hidden shadow-2xl animate-pulse'>
          {/* <!-- Inner Box with Flash Sale text --> */}
          <div className='absolute inset-0 flex items-center justify-center '>
            <div className='bg-white bg-opacity-80 text-center p-6 rounded-lg shadow-lg backdrop-blur-sm'>
              <h1 className='text-base sm:text-lg lg:text-3xl font-extrabold text-gray-800 uppercase animate-pulse'>
                {flashSaleCategory?.name ?? ""}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{campaign?.title || "Campaign"}</title>
        <meta
          name='description'
          content={campaign?.description || "Campaign description"}
        />
        <meta property='og:title' content={campaign?.title || "Campaign"} />
        <meta
          property='og:description'
          content={campaign?.description || "Campaign description"}
        />
        <meta
          property='og:image'
          content={campaign?.image || "/default-image.jpg"}
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      {!!campaign && (
        <CampaignBanner
          title={campaign?.title || "Special Campaign"}
          description={
            campaign?.description || "Shop now before it's too late!"
          }
          timeLeft={timeLeft}
          onNavigate={handleNavigate}
        />
      )}

      {!!flashSaleCategory &&
        flashSaleCategory?.active &&
        renderFlashSaleCategory()}
    </>
  );
};

export default CampaignPage;
