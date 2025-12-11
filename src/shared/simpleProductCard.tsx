"use client";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";
import React, { useState, useEffect } from "react";
import MobileViewCard from "./MobileViewCard";
import DesktopViewCard from "./DesktopViewCard";

interface IProp {
  product: IProduct | ProductType;
}

const ProductCard: React.FC<IProp> = ({ product }) => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobileView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMobileView) {
    return <MobileViewCard product={product} />;
  }
  return <DesktopViewCard product={product} />;
};

export default ProductCard;
