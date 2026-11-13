import CampaignLanding from "@/components/pages/Campaign/CampaignLanding";
import { config } from "@/lib/config";
import type { Metadata } from "next";

interface CampaignResponse {
  success: boolean;
  data: { campaign: { title: string; description?: string; image?: string } };
}

export async function generateMetadata({
  params,
}: {
  params: { campaignId: string };
}): Promise<Metadata> {
  let title = "Prior Campaign";
  let description = "Shop Prior's limited-time campaign.";
  let images: string | undefined;

  try {
    const response = await fetch(config.campaign.getCampaignById(params.campaignId), {
      next: { revalidate: 60 },
    });
    const json = (await response.json()) as CampaignResponse;
    const campaign = json?.data?.campaign;
    if (campaign) {
      title = campaign.title;
      if (campaign.description) description = campaign.description;
      if (campaign.image) images = campaign.image;
    }
  } catch {
    // Fall back to defaults if the campaign can't be fetched
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
  };
}

const CampaignPage = ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  return <CampaignLanding campaignId={campaignId} />;
};

export default CampaignPage;
