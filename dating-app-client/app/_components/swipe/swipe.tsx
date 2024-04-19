import { IMemberResponseModel } from "@/app/_models/_members/IMemberResponseModel";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Grid, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import "./swipe.scss";
import Gallery from "../gallery/gallery";

interface ISwipeProps {
  user: IMemberResponseModel;
  isRecs: boolean;
  isOpenProfile: boolean;
  setIsOpenProfile: (isOpen: boolean) => void;
}
export default function Swipe(props: ISwipeProps) {
  const { user, isOpenProfile, setIsOpenProfile } = props;

  const onRenderSwipe = () => {
    if (isOpenProfile) {
      return (
        <AnimatePresence>
          <MotionConfig transition={{ duration: 0.5, in: [0.32, 0.72, 0, 1] }}>
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative h-72">
                <Gallery user={user} isOpenProfile={isOpenProfile} />
                <IconButton
                  aria-label="Close profiles"
                  className="absolute -bottom-12 right-2"
                  color="primary"
                  onClick={() => setIsOpenProfile(false)}
                >
                  <KeyboardArrowDownIcon className="text-3xl " />
                </IconButton>
              </div>
              <div className="px-3">
                <div className="h-full max-h-24">
                  <h3 className="font-extrabold text-3xl">
                    {user?.knownAs + ", " + user?.age}
                  </h3>
                  <div className="border border-[#CCC] opacity-50 my-2"></div>
                  <p className="text-xs opacity-80">{user?.introduction}</p>
                </div>
              </div>
            </motion.div>
          </MotionConfig>
        </AnimatePresence>
      );
    } else {
      return (
        <AnimatePresence>
          <MotionConfig transition={{ duration: 0.5, in: [0.32, 0.72, 0, 1] }}>
            <motion.div
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative h-[32rem]">
                <Gallery user={user} isOpenProfile={isOpenProfile} />
                <div className="absolute inset-x-0 bottom-[6rem] px-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-3xl">
                      {user?.userName}, {user?.age}
                    </h3>
                    <IconButton
                      aria-label="Open profiles"
                      className="absolute right-2"
                      color="primary"
                      onClick={() => setIsOpenProfile(true)}
                    >
                      <InfoIcon className="text-3xl " />
                    </IconButton>
                  </div>
                  <p className="text-sm opacity-80">{user?.knownAs}</p>
                </div>
              </div>
            </motion.div>
          </MotionConfig>
        </AnimatePresence>
      );
    }
  };

  return onRenderSwipe();
}
