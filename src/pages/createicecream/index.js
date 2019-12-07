import React, { useEffect } from "react";
import axios from "axios";
import { Grid, Checkbox, Button, Typography } from "@material-ui/core";
import socketIOClient from "socket.io-client";

// styles
import useStyles from "./styles";

// components
// import { Typography } from "../../components/Wrappers";
const colors = ["primary", "secondary", "textSecondary", "error"];
const socket = socketIOClient("https://skinny-redcurrant.glitch.me/", {
  timeout: 10000,
  jsonp: false,
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
});
export default function CreateIceCream(props) {
  const [state, setState] = React.useState();
  const [cartList, setCartList] = React.useState([]);
  const [categories, setCategoriesList] = React.useState([]);
  const handleChange = (categoryName, ingredientName) => event => {
    // console.log("categoryName", categoryName);
    // console.log("ingredientName", ingredientName);

    setState({
      ...state,

      [ingredientName]: event.target.checked,
    });
    handleCartList(categoryName, ingredientName, event.target.checked);
  };
  const handleCartList = (categoryName, ingredientName, ingredientChecked) => {
    const cartListNew = cartList;
    const index = cartListNew.findIndex(x => x.category === categoryName);
    if (index !== -1) {
      //if ingredientchecked false remove it
      if (!ingredientChecked) {
        const ingredientsNew = cartListNew[index].ingredients;
        var indexOfIngredient = ingredientsNew.indexOf(ingredientName);
        if (indexOfIngredient !== -1) {
          ingredientsNew.splice(indexOfIngredient, 1);
          cartListNew[index] = {
            ...cartListNew[index],
            ingredients: [...ingredientsNew],
          };
          // if ingredients array is empty remove categoryname
          if (
            cartListNew[index].ingredients &&
            cartListNew[index].ingredients.length === 0
          ) {
            cartListNew.splice(index, 1);
          }
        }
      } else {
        cartListNew[index] = {
          ...cartListNew[index],
          ingredients: [...cartListNew[index].ingredients, ingredientName],
        };
      }
    } else {
      cartListNew.push({
        category: categoryName,
        ingredients: [ingredientName],
      });
    }

    console.log("cartListNew", cartListNew);
    setCartList(cartListNew);
  };
  const handleSubmit = async () => {
    console.log(" handleSubmit cartList", JSON.stringify(cartList));
    const index = cartList.findIndex(item => item.category === "base");
    if (index === -1) {
      alert("Please select a base");
    } else {
      // actual submit
      console.log("props", props);
      const resultSaveOrder = await axios.post(
        "https://skinny-redcurrant.glitch.me/createOrder",
        { ingredientList: cartList },
      );
      if (resultSaveOrder.data.success) {
        props.history.push({
          pathname: `/app/thankyou/`,
          state: {
            detail: resultSaveOrder.data,
          },
        });
      }

      //   props.history.push("/app/thankyou");
    }
  };
  var classes = useStyles();
  //   const categories = [
  //     { category: "base", ingredients: ["Vanilla", "Honey", "Bread", "Cone"] },
  //     { category: "nuts", ingredients: ["Vanilla", "Honey"] },
  //     { category: "sauces", ingredients: ["Vanilla", "Honey"] },
  //     { category: "fruits", ingredients: ["Vanilla", "Honey"] },
  //   ];

  //   const [base, setBase] = useState("Vanilla");
  const fetchData = async () => {
    const result = await axios(
      "https://skinny-redcurrant.glitch.me/getIngredientsList",
    );
    setCategoriesList(result.data);
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
    fetchData();
  }, []);

  return (
    <div
      style={{
        // backgroundImage: `url(${icecreambg})`,
        backgroundColor: "#ffceea",
        padding: 40,
      }}
    >
      {/* <img src={icecreambg} alt={"miss"} /> */}
      <h1
        style={{
          textAlign: "center",
          //   fontSize: 24,
          color: "#FFF",
          textTransform: "uppercase",
          //   backgroundColor: "rgba(0,0,0,0.1)",
          filter: "blur(5)",
        }}
      >
        Create Your Own Ice cream
      </h1>
      <Grid
        item
        xs={12}
        md={12}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        {categories &&
          categories.length > 0 &&
          categories.map((cat, i) => (
            <Grid className={classes.widgetStyle}>
              <Typography
                variant="h5"
                color={colors[i]}
                className={classes.heading}
              >
                {cat.category}
                {cat.category === "base" && (
                  <Typography variant={"caption"}>(Required)</Typography>
                )}
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                {cat.ingredients.map(ingredient => (
                  <div
                    style={{
                      flex: "1 0 50%",
                    }}
                  >
                    <Checkbox
                      value={ingredient}
                      onChange={handleChange(cat.category, ingredient)}
                    />
                    {ingredient}
                  </div>
                ))}
              </div>
            </Grid>
          ))}
        <Button
          fullWidth={false}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          className={classes.submitButton}
        >
          Submit Order
        </Button>
      </Grid>
    </div>
  );
}

// #######################################################################
