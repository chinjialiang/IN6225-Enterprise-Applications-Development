import { Button, styled } from "@mui/material";

export const ButtonRed = styled(Button)({
  textTransform: "capitalize",
  backgroundColor: "red",
  color: "white",
  "&:hover": {
    backgroundColor: "darkred",
  },
});

export const ButtonGray = styled(Button)({
  textTransform: "capitalize",
  backgroundColor: "gray",
  color: "white",
  "&:hover": {
    backgroundColor: "darkgray",
  },
});

export const ButtonBlack = styled(Button)({
  textTransform: "capitalize",
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "gray",
  },
});
