import { Helmet } from "react-helmet";
import React, { ReactNode } from "react";
import { Container, CssBaseline } from "@mui/material";

type Props = {
  title: string;
  children: ReactNode;
};

const Layout = (props: Props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <Container maxWidth={"sm"}>
        <CssBaseline />
        {props.children}
      </Container>
    </>
  );
};

export default Layout;
