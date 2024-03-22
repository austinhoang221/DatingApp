import { IMemberResponseModel } from "@/app/_models/_members/IMemberResponseModel";
import { MemberService } from "@/app/_services/memberService";
import React, { useEffect, useRef, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import SwipeIcon from "@mui/icons-material/Swipe";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { Grid } from "@mui/material";
import { ArrowKey } from "@/app/_constants/constants";
import "./swipe.scss";
export default function Swipe() {
  const pageSize = 10;
  const pageSizeLimit = 7;
  const [users, setUsers] = useState<IMemberResponseModel[]>([]);
  const pageNum = useRef<number>(1);
  const userCount = useRef<number>(0);
  const currentIndex = useRef<number>(0);
  const swipeElement = useRef<HTMLDivElement>(null);
  const [swipeIndex, setSwipeIndex] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const payload = {
      pageNum: pageNum.current,
      pageSize: pageSize,
    };
    await MemberService.getPaginate(payload).then((res) => {
      if (res) {
        setUsers((prevUsers) => [...prevUsers, ...res]);
        userCount.current += res.length;
      }
    });
  };

  useEffect(() => {
    if (swipeIndex === pageSizeLimit) {
      pageNum.current++;
      fetchData();
    }
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

  const handleSwipe = () => {
    if (userCount.current > currentIndex.current + 1) {
      setSwipeIndex((prevIndex) => prevIndex + 1);
      currentIndex.current++;
    }
  };

  const onOpenProfile = () => {
    swipeElement.current?.scrollTo({
      top: swipeElement.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const onCloseProfile = () => {
    swipeElement.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="relative">
        <div
          ref={swipeElement}
          onClick={onOpenProfile}
          className="card w-80 overflow-auto h-[32rem] scrollbar-hide bg-white mx-auto align-middle border rounded-2xl mt-10 mb-4 cursor-pointer"
        >
          <>
            <div className="relative">
              <img
                src={users?.[currentIndex.current]?.photoUrl}
                alt=""
                className="w-100 h-64"
              />
              <ExpandCircleDownIcon className="absolute text-3xl top-4 left-4 opacity-50" />
            </div>
            <div className="px-3">
              <div className="h-full max-h-24">
                <h3 className="font-extrabold text-3xl">
                  {users?.[currentIndex.current]?.userName +
                    ", " +
                    users?.[currentIndex.current]?.age}
                </h3>
                <p className="text-sm opacity-80">
                  {users?.[currentIndex.current]?.knownAs}
                </p>
                <div className="border border-[#CCC] opacity-50 my-2"></div>
                <p className="text-xs opacity-80">
                  {users?.[currentIndex.current]?.introduction}
                </p>
              </div>
            </div>
          </>
        </div>
        <div className="w-80 mx-auto  absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-gray-200 to-transparent">
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
  );
}
