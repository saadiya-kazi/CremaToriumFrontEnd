import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import axios from "axios";
import socketIOClient from "socket.io-client";
// styles
import useStyles from "./styles";

// components
import Widget from "../../components/Widget";

const socket = socketIOClient("https://skinny-redcurrant.glitch.me/", {
  timeout: 10000,
  jsonp: false,
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
});
export default function Users(props) {
  var classes = useStyles();
  const [readyOrdersArray, setReadyOrdersArray] = useState([]);
  const [preparingOrdersArray, setPreparingOrdersArray] = useState([]);
  const fetchData = async () => {
    const resultPrepareOrder = await axios.get(
      "https://skinny-redcurrant.glitch.me/getOrderBeingPrepared",
    );
    if (resultPrepareOrder.data) {
      console.log("resultPrepareOrder", resultPrepareOrder.data);

      setPreparingOrdersArray(resultPrepareOrder.data);
    }
  };
  const fetchDataReadyToPickOrder = async () => {
    const resultPickOrder = await axios.get(
      "https://skinny-redcurrant.glitch.me/getOrderReadyForPickup",
    );
    if (resultPickOrder.data) {
      setReadyOrdersArray(resultPickOrder.data);
    }
  };
  useEffect(() => {
    socket.connect();
    socket.emit("subscribe", 1);
    // subscrisbing for the function
    socket.on("OrderStatusUpdate", data => {
      // set the state
      if (data.success) {
        fetchData();
        fetchDataReadyToPickOrder();
      }
      console.log("dataaa", data);
    });
    fetchData();
    fetchDataReadyToPickOrder();
  }, []);

  return (
    <div
      style={{
        // backgroundImage: `url(${icecreambg})`,
        backgroundColor: "#ffceea",
        padding: 40,
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Track Your Orders
      </h1>
      <Grid
        item
        xs={12}
        md={12}
        style={{
          display: "flex",
          flexDirection: "row",
          //   alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Widget disableWidgetMenu>
          <Typography variant={"h3"} size={"xl"}>
            Ready for pick Up
          </Typography>
          <hr />

          <Grid
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {readyOrdersArray.map(order => (
              <div
                style={{
                  width: "100%",
                }}
              >
                <Typography
                  variant={"h4"}
                  color={"secondary"}
                  className={classes.text}
                  size={"md"}
                >
                  {order.orderNo}
                </Typography>
                <hr />
              </div>
            ))}
          </Grid>
        </Widget>

        <Widget disableWidgetMenu>
          <Typography variant={"h3"} size={"xl"}>
            Bieng Prepared
          </Typography>
          <hr />
          <Grid
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {preparingOrdersArray.map(order => (
              <div
                style={{
                  width: "100%",
                }}
              >
                <Typography
                  variant={"h4"}
                  color={"secondary"}
                  className={classes.text}
                  size={"md"}
                >
                  {order.orderNo}
                </Typography>
                <hr />
              </div>
            ))}
          </Grid>
        </Widget>
      </Grid>
    </div>
  );
}

// #######################################################################
