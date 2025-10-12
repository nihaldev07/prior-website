"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  linkToShare: string;
  title?: string;
  text?: string;
}

function ShareButton({ linkToShare, title, text }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    // Check if the Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Check this out!",
          text: text || "I found this amazing product",
          url: linkToShare,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        // User cancelled the share or an error occurred
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          // Fallback to copy
          fallbackCopy();
        }
      }
    } else {
      // Fallback to copying the link if Web Share API is not available
      fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkToShare);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant='ghost'
      size='icon'
      className='hover:scale-110 transition-transform duration-200 text-muted-foreground hover:text-foreground'
      onClick={handleShare}>
      {shared ? (
        <Check className='h-5 w-5 text-green-500' />
      ) : (
        <Share2 className='h-5 w-5' />
      )}
    </Button>
  );
}

export default ShareButton;
