"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Main() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);
  return <main className="w-full h-screen place-items-center"></main>;
}
