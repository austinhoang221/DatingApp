"use client";

import React, { useEffect, useRef, useState } from "react";
import Swipe from "../../_components/swipe/swipe";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import SwipeIcon from "@mui/icons-material/Swipe";
import { Grid } from "@mui/material";
import Loading from "../loading";
import { IMemberResponseModel } from "@/app/_models/_members/IMemberResponseModel";
import { MemberService } from "@/app/_services/memberService";
import { ArrowKey } from "@/app/_constants/constants";
export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
  const [swipeIndex, setSwipeIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const pageSize = 10;
  const pageSizeLimit = 7;
  const [users, setUsers] = useState<IMemberResponseModel[]>([]);
  const pageNum = useRef<number>(0);
  const userCount = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);

  const fetchData = async () => {
    const payload = {
      pageNum: pageNum.current,
      pageSize: pageSize,
    };
    await MemberService.getPaginate(payload).then((res) => {
      if (res) {
        setUsers((prevUsers) => [...prevUsers, ...res]);
        userCount.current += res.length;
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    pageNum.current++;
    fetchData();
  }, [swipeIndex]);

  useEffect(() => {
    const keyPressListener = (e: any) => {
      switch (e.keyCode) {
        case ArrowKey.Right:
          handleSwipe();
          break;
        case ArrowKey.Left:
          handleSwipe();
          break;
        case ArrowKey.Up:
          onCloseProfile();
          break;
        case ArrowKey.Down:
          onOpenProfile();
          break;
      }
    };
    window.addEventListener("keydown", keyPressListener);

    return () => window.removeEventListener("keydown", keyPressListener);
  }, []);

  const onOpenProfile = () => {
    setIsOpenProfile(true);
  };

  const onCloseProfile = () => {
    setIsOpenProfile(false);
  };

  const handleSwipe = () => {
    if (currentIndexRef.current + 1 < userCount.current) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      currentIndexRef.current++;
    }
    if (
      currentIndexRef.current + pageSize - pageSizeLimit ===
      userCount.current
    ) {
      setSwipeIndex((prevIndex) => prevIndex + 10);
    }
  };

  return !isLoading ? (
    <>
      <div className="relative">
        <div className="card w-80 overflow-auto h-[32rem] scrollbar-hide bg-white mx-auto align-middle border rounded-2xl mt-10 mb-4 cursor-pointer">
          {
            <Swipe
              isOpenProfile={isOpenProfile}
              user={users?.[currentIndex]}
              isRecs
              setIsOpenProfile={setIsOpenProfile}
            />
          }
        </div>
        <div className="w-80 mx-auto absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-gray-200 to-transparent">
          <div className="flex items-center justify-between px-3 ">
            <div className="bg-[#F11E1E] shadow-xl w-16 h-16 shrink-0 grow-0 rounded-full flex items-center justify-center align-middle cursor-pointer">
              <CloseIcon className="text-5xl" sx={{ color: "#fff" }} />
            </div>
            <div className="bg-[#0CBA1D] shadow-xl w-16 h-16 shrink-0 grow-0 rounded-full flex items-center justify-center align-middle cursor-pointer">
              <CheckIcon className="text-5xl" sx={{ color: "#fff" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-5/6 mx-auto">
        <Grid container rowSpacing={0} className="mt-8 mb-6">
          <Grid item xs={2} className="text-center">
            <AdsClickIcon
              className="text-3xl opacity-20"
              sx={{ color: "#4B5050" }}
            />
            <span className="text-sm ml-2 text-[#4B5050] opacity-50">
              Click
            </span>
          </Grid>
          <Grid item xs={2} className="text-center">
            <SwipeIcon
              className="text-3xl opacity-20"
              sx={{ color: "#4B5050" }}
            />
            <span className="text-sm ml-2 text-[#4B5050] opacity-50">
              Swipe
            </span>
          </Grid>
          <Grid item xs={2} className="text-center">
            <ArrowCircleLeftOutlinedIcon
              className="text-3xl opacity-20"
              sx={{ color: "#4B5050" }}
            />
            <span className="text-sm ml-2 text-[#4B5050] opacity-50">Nope</span>
          </Grid>
          <Grid item xs={2} className="text-center">
            <ArrowCircleRightOutlinedIcon
              className="text-3xl opacity-20"
              sx={{ color: "#4B5050" }}
            />
            <span className="text-sm ml-2 text-[#4B5050] opacity-50">Like</span>
          </Grid>
          <Grid item xs={2} className="text-center">
            <ArrowCircleUpOutlinedIcon
              className="text-3xl opacity-20"
              sx={{ color: "#4B5050" }}
            />
            <span className="text-sm ml-2 text-[#4B5050] opacity-50">Open</span>
          </Grid>
          <Grid item xs={2} className="text-center">
            <ArrowCircleDownOutlinedIcon
              className="text-3xl opacity-20"
              sx={{ color: "#4B5050" }}
            />
            <span className="text-sm ml-2 text-[#4B5050] opacity-50">
              Close
            </span>
          </Grid>
        </Grid>
      </div>
    </>
  ) : (
    <Loading />
  );
}
