"use client";
import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

const FacebookChat = () => {
  return (
    <FacebookProvider appId="3457721097853933" chatSupport>
      <CustomChat pageId="101545885029757" />
    </FacebookProvider>
  );
};

export default FacebookChat;
