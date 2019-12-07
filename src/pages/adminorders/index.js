import React, { useEffect } from "react";
import axios from "axios";
import { Grid, Typography, Button } from "@material-ui/core";
import socketIOClient from "socket.io-client";

// components
import Widget from "../../components/Widget";
import useStyles from "./styles";
const socket = socketIOClient("https://skinny-redcurrant.glitch.me/", {
  timeout: 10000,
  jsonp: false,
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
});
export default function AdminOrders() {
  const [ordersList, setOrdersList] = React.useState([]);
  const handleChange = order => async event => {
    //update status for that order
    console.log("order", order);
    var orderStatus = "";
    var orderNextStatus = "";
    if (order.status === "waiting") {
      orderStatus = "being_prepared";
      orderNextStatus = "ready";
    } else if (order.nextStatus === "ready") {
      orderNextStatus = "being_pick_up";
      orderStatus = "ready_for_pickup";
    } else if (order.nextStatus === "being_pick_up") {
      orderStatus = "picked_up";
      orderNextStatus = "";
    }
    // console.log("event", event.target.value);
    await axios.put("https://skinny-redcurrant.glitch.me/updateStatus", {
      orderNo: order.orderNo,
      status: orderStatus,
      nextStatus: orderNextStatus,
    });
    // const listNew = ordersList;
    // const index = ordersList.findIndex(
    //   orderItem => orderItem.orderNo === order.orderNo,
    // );

    // if (index !== -1) {
    //   listNew[index] = {
    //     ...listNew[index],
    //     status: order.nextStatus,
    //   };
    //   console.log("listr new", listNew);
    //   // check for list without picked_up
    //   if (order.status === "picked_up") {
    //     listNew.splice(index, 1);
    //   }
    //   setOrdersList([...listNew]);
    //update the order in back end
    // }
  };
  var classes = useStyles();
  const fetchData = async () => {
    const orderStatus = [
      "waiting",
      "being_prepared",
      "ready",
      "ready_for_pickup",
      "picked",
      "picked_up",
    ];

    const result = await axios(
      "https://skinny-redcurrant.glitch.me/getAllOrders",
    );
    const list = result.data;
    const listNew = list.map(order => {
      const indexOfCurrentStatus = orderStatus.findIndex(
        status => status === order.status,
      );
      return {
        ...order,
        nextStatus: orderStatus[indexOfCurrentStatus + 1],
      };
    });
    const resultNew = listNew.filter(item => item.status !== "");

    setOrdersList(resultNew);
  };
  useEffect(() => {
    socket.connect();
    socket.emit("subscribe", 1);
    // subscrisbing for the function
    socket.on("OrderListUpdate", data => {
      // set the state
      if (data.success) {
        fetchData();
      }
      console.log("dataaa", data);
    });
    socket.on("OrderStatusUpdate", data => {
      // set the state
      if (data.success) {
        fetchData();
      }
      console.log("dataaa", data);
    });
    fetchData();
  }, []);

  return (
    <Grid className={classes.adminGrid}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#4a4a4a",
        }}
      >
        Creamatorium
      </h1>
      <h1
        style={{
          textAlign: "center",
          //   fontSize: 24,
          color: "#4a4a4a",
          textTransform: "uppercase",
        }}
      >
        Admin Panel
      </h1>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget disableWidgetMenu>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              <Typography variant={"h5"}>Order#</Typography>
              <Typography variant={"h5"}>Ingredients</Typography>
              <Typography variant={"h5"}>Order Status</Typography>
            </Grid>
            <hr />

            {ordersList.map(order => (
              <>
                <Grid
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Typography
                    style={{
                      textAlign: "center",
                      // alignSelf: "flex-start",
                      // alignItems: "flex-start",
                      // justifyContent: "flex-start",
                      // marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    variant={"h5"}
                  >
                    {order.orderNo}
                  </Typography>
                  <Grid
                    style={{
                      // alignSelf: "center",
                      // alignItems: "center",
                      // justifyContent: "center",
                      // marginLeft: "auto",
                      // marginRight: "auto",
                      flex: 1,
                    }}
                  >
                    {order.ingredientList.map(item => (
                      <div
                        style={{
                          alignSelf: "center",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          style={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            paddingRight: 30,
                          }}
                        >
                          {item.category}:
                        </Typography>
                        {item.ingredients.map(ing => (
                          <Typography>{ing + ", "}</Typography>
                        ))}
                      </div>
                    ))}
                  </Grid>
                  <Button
                    style={{ marginLeft: "auto" }}
                    onClick={handleChange(order)}
                    variant={"contained"}
                    color={order.status === "ready" ? "primary" : "secondary"}
                  >
                    {order.status === "waiting"
                      ? "Start Preparing"
                      : order.status === "being_prepared"
                      ? "Ready"
                      : order.status === "ready_for_pickup"
                      ? "Picked"
                      : order.status}
                  </Button>

                  {/* <Select onChange={handleChange(order)} value={order.status}>
                  <MenuItem value={"ready_for_pickup"}>Ready</MenuItem>
                  <MenuItem value={"being_prepared"}>Start Preparing</MenuItem>
                  <MenuItem value={"picked_up"}>Picked</MenuItem>
                </Select> */}
                </Grid>
                <hr />
              </>
            ))}
          </Widget>
        </Grid>
      </Grid>
    </Grid>
  );
}
