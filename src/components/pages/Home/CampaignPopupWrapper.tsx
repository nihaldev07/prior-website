"use client";

import React, { useEffect, useState } from "react";
import useCampaign from "@/hooks/useCampaign";
import CampaignPopup from "@/components/CampaignPopup";
import { ICampaign } from "@/lib/interface";

const CampaignPopupWrapper: React.FC = () => {
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const { fetchActiveCampaign } = useCampaign();

  useEffect(() => {
    const loadCampaign = async () => {
      const data = await fetchActiveCampaign();
      if (data?.activeCampaign && data.activeCampaign.image) {
        setCampaign(data.activeCampaign);
      }
    };

    loadCampaign();
  }, []);

  if (!campaign || !campaign.image) {
    return null;
  }

  return <CampaignPopup campaign={campaign} />;
};

export default CampaignPopupWrapper;
