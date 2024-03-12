import { Alert, AlertTitle, Slide, SlideProps, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";

interface IToast {
  show: boolean;
  type: "success" | "error" | "warning";
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<IToast> = ({ show, type, message, onDismiss }) => {
  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
  }
  return show ? (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={show}
      autoHideDuration={2000}
      TransitionComponent={SlideTransition}
      onClose={onDismiss}
    >
      <Alert severity={type}>
        <AlertTitle>{type[0].toUpperCase() + type.slice(1)}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  ) : (
    <></>
  );
};

export default Toast;
