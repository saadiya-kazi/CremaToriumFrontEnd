import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";

// styles

// components
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
export default function ThankYou(props) {
  //   const [base, setBase] = useState("Vanilla");

  useEffect(() => {});
  return (
    <>
      <PageTitle title="Thank You for your order" />
      <Grid
        item
        xs={12}
        md={12}
        style={{
          display: "flex",
          flexDirection: "column",
          //   alignItems: "center",
          //   justifyContent: "space-around",
        }}
      >
        <Typography variant={"h3"} color={"success"}>
          Order # {props.location.state.detail.data.orderNo}
        </Typography>
      </Grid>
    </>
  );
}

// #######################################################################
