import React from "react";
import { styled, TextField } from "@mui/material";

export const StyledTextFieldOutlinedSmall = ({ ...props }) => {
  return <TextField size="small" variant="outlined" {...props} />;
};

export const StyledTextFieldStandardSmall = ({ ...props }) => {
  return <TextField size="small" variant="standard" {...props} />;
};

export const TextFieldOutlinedSmall = styled(TextField)({
  size: "small",
  variant: "outlined",
});

export const TextFieldStandardSmall = styled(TextField)({
  size: "small",
  variant: "standard",
});
