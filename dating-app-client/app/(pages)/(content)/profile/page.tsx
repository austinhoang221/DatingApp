"use client";

import React, { useEffect, useState } from "react";
import Swipe from "@/app/_components/swipe/swipe";
import { ArrowKey } from "@/app/_constants/constants";
import { IAuthenticateResponseModel } from "@/app/_models/_auth/IAuthenticateResponseModel";
import { Grid } from "@mui/material";

export default function Profile() {
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
  const [user, setUser] = useState<IAuthenticateResponseModel | null>(null);

  useEffect(() => {
    setUser(
      window.localStorage.getItem("user")
        ? (JSON.parse(
            window.localStorage.getItem("user") ?? ""
          ) as IAuthenticateResponseModel)
        : null
    );
  }, []);

  useEffect(() => {
    const keyPressListener = (e: any) => {
      switch (e.keyCode) {
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

  return (
    <>
      <div className="relative">
        <div className="card w-80 overflow-auto h-[32rem] scrollbar-hide bg-white mx-auto align-middle border rounded-2xl mt-10 mb-4 cursor-pointer">
          {
            <Swipe
              isOpenProfile={isOpenProfile}
              user={user!}
              isRecs={false}
              setIsOpenProfile={setIsOpenProfile}
            />
          }
        </div>
      </div>
      <Grid container rowSpacing={0} className="mt-12 mb-6"></Grid>
    </>
  );
}
