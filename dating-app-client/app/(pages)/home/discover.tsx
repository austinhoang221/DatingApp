import { Grid, Typography } from "@mui/material";
import StyleIcon from "@mui/icons-material/Style";
import React from "react";

export default function Discover() {
  return (
    <>
      <div
        className="text-center bg-gray-200 flex items-center px-12 py-4 justify-between
        "
      >
        <div className="bg-white border border-[#F97316] w-24 h-24 shrink-0 grow-0 rounded-full flex items-center justify-center align-middle">
          <StyleIcon className="text-7xl" sx={{ color: "#F97316" }} />
        </div>
        <div>
          <h6 className="font-semibold">Discover New Matches</h6>
          <p className="text-xs opacity-80">
            Start swiping to connect new people
          </p>
        </div>
      </div>
      <Typography className="text-primary ml-3 font-bold" color="primary">
        Messages
      </Typography>
    </>
  );
}
