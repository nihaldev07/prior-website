// Delivery History Sheet Component
// Provider-themed header + a simplified vertical stage tracker (no raw history dump)
"use client";
import { useState } from "react";
import {
  DeliveryTimelineItem,
  CourierDeliveryHistory,
} from "@/app/order/interface";
import { getProviderConfig, getTrackingUrl } from "@/lib/courierProviders";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useWindowSize from "@/hooks/useWindowSize";
import {
  Box,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  PhoneCall,
  User,
  Copy,
  Check,
  ExternalLink,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface DeliveryHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveryTimeline?: DeliveryTimelineItem[];
  courierDeliveryHistory?: CourierDeliveryHistory | null;
  provider?: string | null;
  customerPhoneNumber?: string;
}

// ---- Provider color themes (Tailwind gradient classes, per brand) ----
const getProviderTheme = (provider: string | null) => {
  const p = provider?.toLowerCase() || "";
  switch (p) {
    case "steadfast":
      return {
        headerGradient: "from-green-600 via-green-700 to-green-950",
        lightBg: "bg-green-50",
        lightBorder: "border-green-200",
        accentText: "text-green-700",
        solidChip: "bg-green-600",
        ring: "ring-green-200",
      };
    case "pathao":
      return {
        headerGradient: "from-rose-600 via-rose-700 to-rose-950",
        lightBg: "bg-rose-50",
        lightBorder: "border-rose-200",
        accentText: "text-rose-700",
        solidChip: "bg-rose-600",
        ring: "ring-rose-200",
      };
    case "carrybee":
      return {
        headerGradient: "from-amber-500 via-amber-600 to-amber-900",
        lightBg: "bg-amber-50",
        lightBorder: "border-amber-200",
        accentText: "text-amber-700",
        solidChip: "bg-amber-600",
        ring: "ring-amber-200",
      };
    default:
      return {
        headerGradient: "from-slate-600 via-slate-700 to-slate-950",
        lightBg: "bg-slate-50",
        lightBorder: "border-slate-200",
        accentText: "text-slate-700",
        solidChip: "bg-slate-600",
        ring: "ring-slate-200",
      };
  }
};

// ---- Stage definitions for the vertical stepper ----
const POSITIVE_STAGES: {
  key: string;
  label: string;
  icon: any;
  match: string[];
}[] = [
  {
    key: "placed",
    label: "Order Placed",
    icon: Box,
    match: ["pending", "created", "request"],
  },
  {
    key: "picked",
    label: "Picked Up",
    icon: Package,
    match: ["picked", "pickup"],
  },
  {
    key: "transit",
    label: "In Transit",
    icon: Truck,
    match: ["transit", "hub", "warehouse"],
  },
  {
    key: "out",
    label: "Out for Delivery",
    icon: Truck,
    match: ["out for delivery", "assigned for delivery"],
  },
];

const getTerminalLabel = (statusLower: string) => {
  if (statusLower.includes("cancel")) return "Cancelled";
  if (statusLower.includes("fail")) return "Failed";
  if (statusLower.includes("return")) return "Returned";
  return "Delivered";
};

const computeStageIndex = (entries: { status: string }[]) => {
  let idx = 0;
  POSITIVE_STAGES.forEach((stage, i) => {
    const matched = entries.some((entry) => {
      const s = entry.status?.toLowerCase() || "";
      return stage.match.some((k) => s.includes(k));
    });
    if (matched && i > idx) idx = i;
  });
  return idx;
};

const formatStatus = (status: string) => status?.split("_").join(" ") || "";

const DeliveryHistorySheet: React.FC<DeliveryHistorySheetProps> = ({
  open,
  onOpenChange,
  deliveryTimeline,
  courierDeliveryHistory,
  provider,
  customerPhoneNumber,
}) => {
  const { width } = useWindowSize();
  const isMobile = (width ?? 0) < 1024;
  const [linkCopied, setLinkCopied] = useState(false);

  const activeProvider = courierDeliveryHistory?.provider || provider || null;
  const theme = getProviderTheme(activeProvider);
  const providerConfig = getProviderConfig(activeProvider);

  const entries: DeliveryTimelineItem[] =
    (courierDeliveryHistory?.statusHistory?.length
      ? courierDeliveryHistory.statusHistory
      : deliveryTimeline) || [];

  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const latest = sorted[0];
  const latestLower = latest?.status?.toLowerCase() || "";

  const isDelivered =
    latestLower.includes("delivered") && !latestLower.includes("partial");
  const isNegativeTerminal =
    latestLower.includes("return") ||
    latestLower.includes("cancel") ||
    latestLower.includes("fail");
  const isFinal = isDelivered || isNegativeTerminal;

  const finalStageLabel = isNegativeTerminal
    ? getTerminalLabel(latestLower)
    : "Delivered";
  const finalStageIcon = isNegativeTerminal ? XCircle : CheckCircle2;

  const stages = [
    ...POSITIVE_STAGES,
    {
      key: "final",
      label: finalStageLabel,
      icon: finalStageIcon,
      match: ["delivered"],
    },
  ];

  const stageIndex = isFinal ? stages.length - 1 : computeStageIndex(sorted);

  const trackingUrl = getTrackingUrl(
    activeProvider,
    courierDeliveryHistory?.consignmentId,
    courierDeliveryHistory?.trackingCode,
    customerPhoneNumber,
  );

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const handleCopyLink = () => {
    if (!trackingUrl) return;
    navigator.clipboard.writeText(trackingUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const Header = () => (
    <div
      className={`bg-gradient-to-br ${theme.headerGradient} px-6 pt-4 pb-5 text-white relative overflow-hidden shrink-0`}>
      <div className='absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5' />
      <div className='absolute -right-2 top-14 w-16 h-16 rounded-full bg-white/5' />

      <div className='flex items-center gap-3 mb-4 relative'>
        {providerConfig.logoUrl ? (
          <img
            className='rounded-full shadow-lg w-11 h-11 object-cover bg-white p-0.5 ring-1 ring-white/20'
            src={providerConfig.logoUrl}
            alt={providerConfig.displayName}
          />
        ) : (
          <div className='w-11 h-11 rounded-full bg-white/15 flex items-center justify-center ring-1 ring-white/20'>
            <Truck className='h-5 w-5 text-white' />
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <h3 className='font-bold text-lg leading-tight tracking-tight'>
            {providerConfig.displayName}
          </h3>
          <p className='text-white/60 text-xs'>Delivery Tracking</p>
        </div>
        {isMobile ? (
          <DrawerClose asChild>
            <button className='h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 shrink-0'>
              <X className='h-4 w-4' />
            </button>
          </DrawerClose>
        ) : (
          <SheetClose asChild>
            <button className='h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 shrink-0'>
              <X className='h-4 w-4' />
            </button>
          </SheetClose>
        )}
      </div>

      {latest && (
        <div className='flex items-center gap-2 mb-3 relative'>
          <div className='flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5'>
            {isFinal ? (
              isNegativeTerminal ? (
                <XCircle className='w-3.5 h-3.5' />
              ) : (
                <CheckCircle2 className='w-3.5 h-3.5' />
              )
            ) : (
              <Clock className='w-3.5 h-3.5' />
            )}
            <span className='text-xs font-semibold capitalize'>
              {formatStatus(latest.status)}
            </span>
          </div>
        </div>
      )}

      {(courierDeliveryHistory?.consignmentId || trackingUrl) && (
        <div className='flex items-center gap-2 flex-wrap text-sm relative'>
          {courierDeliveryHistory?.consignmentId && (
            <Badge className='bg-white/15 text-white border-white/20 hover:bg-white/25 text-xs font-normal'>
              ID {courierDeliveryHistory.consignmentId}
            </Badge>
          )}
          {trackingUrl && (
            <div className='flex items-center gap-1'>
              <a
                href={trackingUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 text-white/85 hover:text-white text-xs underline underline-offset-2'>
                Track shipment <ExternalLink className='w-3 h-3' />
              </a>
              <button
                type='button'
                onClick={handleCopyLink}
                className='inline-flex items-center justify-center w-6 h-6 rounded-md text-white/80 hover:text-white hover:bg-white/15 transition-colors'
                aria-label='Copy tracking link'>
                {linkCopied ? (
                  <Check className='w-3.5 h-3.5 text-emerald-300' />
                ) : (
                  <Copy className='w-3.5 h-3.5' />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const Body = () => (
    <div className='overflow-y-auto flex-1 px-6 py-5 bg-slate-50'>
      {/* Vertical stage tracker */}
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4'>
        <h4 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-4'>
          Delivery Progress
        </h4>
        <div className='space-y-0'>
          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isCompleted = index < stageIndex;
            const isCurrent = index === stageIndex;
            const isLast = index === stages.length - 1;
            const isFailedFinal = isCurrent && isNegativeTerminal && isLast;

            return (
              <div key={stage.key} className='relative flex gap-3'>
                <div className='flex flex-col items-center'>
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isFailedFinal
                        ? "bg-red-500 ring-4 ring-red-100"
                        : isCurrent
                          ? `${theme.solidChip} ring-4 ${theme.ring}`
                          : isCompleted
                            ? theme.solidChip
                            : `${theme.lightBg} ${theme.lightBorder} border`
                    }`}>
                    <StageIcon
                      className={`w-3.5 h-3.5 ${
                        isCompleted || isCurrent
                          ? "text-white"
                          : "text-slate-400"
                      }`}
                    />
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[28px] my-0.5 ${
                        isCompleted ? theme.solidChip : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
                <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted || isCurrent
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}>
                    {stage.label}
                  </p>
                  {isCurrent && !isLast && (
                    <p className={`text-xs mt-0.5 ${theme.accentText}`}>
                      Current stage
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliveryman card */}
      {courierDeliveryHistory?.deliveryManName && (
        <div
          className={`rounded-2xl border ${theme.lightBorder} ${theme.lightBg} p-4 mb-4 shadow-sm`}>
          <div className='flex items-center gap-2 mb-3'>
            <div
              className={`w-8 h-8 rounded-full ${theme.solidChip} flex items-center justify-center shadow-sm`}>
              <User className='w-4 h-4 text-white' />
            </div>
            <span className={`text-sm font-bold ${theme.accentText}`}>
              Delivery Man
            </span>
          </div>
          <div className='space-y-2 ml-1'>
            <p className='text-sm font-semibold text-slate-800'>
              {courierDeliveryHistory.deliveryManName}
            </p>
            {courierDeliveryHistory.deliveryManPhone && (
              <div className='flex items-center justify-between'>
                <a
                  href={`tel:${courierDeliveryHistory.deliveryManPhone}`}
                  className='text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2 font-mono'>
                  {courierDeliveryHistory.deliveryManPhone}
                </a>
                <Button
                  size='sm'
                  asChild
                  className={`rounded-lg ${theme.solidChip} hover:opacity-90 text-white`}>
                  <a href={`tel:${courierDeliveryHistory.deliveryManPhone}`}>
                    <PhoneCall className='w-3.5 h-3.5 mr-1.5' />
                    Call
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tracking IDs */}
      {(courierDeliveryHistory?.consignmentId ||
        courierDeliveryHistory?.trackingCode) && (
        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2'>
          {courierDeliveryHistory?.consignmentId && (
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-[11px] text-slate-400'>Consignment ID</p>
                <p className='text-sm font-mono font-medium text-slate-900'>
                  {courierDeliveryHistory.consignmentId}
                </p>
              </div>
              <button
                onClick={() =>
                  copy(courierDeliveryHistory.consignmentId, "Consignment ID")
                }
                className='h-7 w-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500'>
                <Copy className='h-3.5 w-3.5' />
              </button>
            </div>
          )}
          {courierDeliveryHistory?.trackingCode && (
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-[11px] text-slate-400'>Tracking Code</p>
                <p className='text-sm font-mono font-medium text-slate-900'>
                  {courierDeliveryHistory.trackingCode}
                </p>
              </div>
              <button
                onClick={() =>
                  copy(courierDeliveryHistory.trackingCode, "Tracking code")
                }
                className='h-7 w-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500'>
                <Copy className='h-3.5 w-3.5' />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className='h-[85vh] max-h-[800px] rounded-t-2xl p-0 flex flex-col overflow-hidden'>
          <Header />
          <Body />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full sm:max-w-[440px] p-0 flex flex-col overflow-hidden'>
        <Header />
        <Body />
      </SheetContent>
    </Sheet>
  );
};

export default DeliveryHistorySheet;
