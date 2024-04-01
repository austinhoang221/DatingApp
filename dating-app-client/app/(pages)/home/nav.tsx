"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { IAuthenticateResponseModel } from "@/app/_models/_auth/IAuthenticateResponseModel";
import { usePathname, useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";

export default function Nav() {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<IAuthenticateResponseModel | null>(null);
  const [route, setRoute] = useState<string | null>("");

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
    setRoute(path);
  }, [path]);

  const onNavigateProfile = () => {
    router.push("/profile");
  };

  const onNavigateHome = () => {
    router.push("/home");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {route !== "/profile" ? (
            <>
              <IconButton
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                }}
                onClick={() => onNavigateProfile()}
              >
                <Avatar alt={user?.knownAs} src={user?.photoUrl} />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {user?.knownAs}
              </Typography>
            </>
          ) : (
            <IconButton
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
              }}
              onClick={() => onNavigateHome()}
            >
              <Avatar alt="Heart" src="../../_assets/images/logo.png" />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
