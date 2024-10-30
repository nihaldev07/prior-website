"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import useCampaign from "@/hooks/useCampaign";
import Image from "next/image";
import { Clock } from "lucide-react";
import { ICampaign, ICampaingProducts } from "@/lib/interface";
import Carousel from "@/components/Carosol/Swiper";
import { Button } from "@/components/ui/button";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import useCategory from "@/hooks/useCategory";
import useThrottledEffect from "@/hooks/useThrottleEffect";

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

    //eslinst-disable-next-line
  }, [fetchActiveCampaign]);

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
        className="flex items-center justify-center min-h-[20vh] bg-gradient-to-r from-indigo-600 to-pink-500 mt-4 py-2 cursor-pointer"
        onClick={() => {
          router.push("/category/3cc953ce-d453-4f5d-99df-5f31b0342e15");
        }}
      >
        {/* <!-- Outer Box with animated background --> */}
        <div className="relative w-full h-48 sm:h-60 lg:h-96 bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 rounded-lg overflow-hidden shadow-2xl animate-pulse">
          {/* <!-- Inner Box with Flash Sale text --> */}
          <div className="absolute inset-0 flex items-center justify-center ">
            <div className="bg-white bg-opacity-80 text-center p-6 rounded-lg shadow-lg backdrop-blur-sm">
              <h1 className="text-base sm:text-lg lg:text-3xl font-extrabold text-gray-800 uppercase animate-pulse">
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

      {!!campaign && (
        <div className="md:container mx-auto p-2 md:p-6   rounded-lg mt-4">
          <div className="w-full flex justify-between items-start">
            <div className="top-4 left-4 p-2   font-semibold  text-zinc-900 text-xs sm:text-base md:text-lg uppercase">
              ✨ {campaign?.title}
            </div>
            <div className="top-4 right-4 p-2 flex items-center justify-between text-zinc-700 text-xs sm:text-base md:text-lg font-medium">
              <Clock className="mr-2" /> Time left:{" "}
              {timeLeft.includes("Expired") ? (
                "Expired"
              ) : (
                <div className="grid grid-cols-4 gap-1 ml-2">
                  <Badge
                    variant={"outline"}
                    className="text-base font-semibold"
                  >
                    {timeLeft.split(":")[0]} d
                  </Badge>
                  <Badge
                    variant={"outline"}
                    className="text-base font-semibold"
                  >
                    {timeLeft.split(":")[1]} h
                  </Badge>
                  <Badge
                    variant={"outline"}
                    className="text-base font-semibold"
                  >
                    {timeLeft.split(":")[2]} m
                  </Badge>
                  <Badge
                    variant={"outline"}
                    className="text-base font-semibold text-orange-600"
                  >
                    {timeLeft.split(":")[3]} s
                  </Badge>
                </div>
              )}
            </div>
            <Button
              variant={"ghost"}
              className="text-lg"
              onClick={() => handleNavigate()}
            >
              See More <DoubleArrowRightIcon />
            </Button>
          </div>
          <div className="w-full h-[1px] bg-gray-950 my-1" />
          <div className="flex flex-col items-center">
            {!campaign?.products && !!campaign?.image && (
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200">
                <Image
                  src={campaign?.image}
                  alt={campaign?.title}
                  className="w-full h-full object-cover absolute"
                  fill
                />
              </div>
            )}
            {!!campaign?.products && (
              <>
                <div className="relative w-full h-[280px] sm:h-[300px] md:h-[350px] rounded-md p-2 md:p-5  shadow-md hidden md:block">
                  <Carousel
                    images={productImgs}
                    perView={5}
                    spaceBetween={10}
                  />
                </div>

                <div className="relative w-full h-[280px] sm:h-[300px] md:h-[350px] rounded-md p-2 md:p-5 bg-gradient-to-r from-purple-100 to-pink-100 block md:hidden">
                  <Carousel
                    images={productImgs}
                    perView={2}
                    spaceBetween={10}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!!flashSaleCategory &&
        flashSaleCategory?.active &&
        renderFlashSaleCategory()}
    </>
  );
};

export default CampaignPage;
