"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { usePathname, useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";

interface IUser {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}
export default function Nav() {
  const router = useRouter();
  const path = usePathname();
  const [route, setRoute] = useState<string | null>("");
  const [user, setUser] = useState<IUser>();

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
                <Avatar alt={user?.name!} src={user?.image!} />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {user?.name}
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
