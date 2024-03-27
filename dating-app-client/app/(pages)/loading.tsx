"use client";
import Image from "next/image";
import React from "react";
import logoSvg from "../../app/_assets/images/Hearthub.gif";
export default function Loading() {
  return (
    <div className="text-center">
      <Image src={logoSvg} alt="Loading" width={500} height={500} />
    </div>
  );
}
