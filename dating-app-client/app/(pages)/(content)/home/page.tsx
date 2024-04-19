"use server";

import React from "react";
import { cookies } from "next/headers";
import { getUserSession } from "@/app/api/auth/[...nextauth]/session";
import { HomeContent } from "./home";
import Endpoint from "@/app/_endpoint/endpoint";
export default async function Home() {
  const userFromOAuth = await getUserSession();
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        Endpoint.userByEmail + userFromOAuth?.email,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token?.value,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Error:", error);
    }
    return null;
  };

  const user = await fetchUserData();
  return <HomeContent user={{ ...user, token: token.value }} />;
}
