"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { IAuthenticateResponseModel } from "@/app/_models/_auth/IAuthenticateResponseModel";
import { useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Logout"];

export default function Nav() {
  const router = useRouter();
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

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigateElUser = (page: string) => {
    switch (page) {
      case "Logout": {
        localStorage.clear();
        router.push("/login");
      }
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Avatar alt="Remy Sharp" src={user?.photoUrl} />
          </IconButton>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {user?.knownAs}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
