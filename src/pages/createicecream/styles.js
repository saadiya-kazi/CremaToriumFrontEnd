import { makeStyles } from "@material-ui/styles";
export default makeStyles(theme => ({
  heading: {
    textTransform: "uppercase",
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  submitButton: {
    marginTop: 40,
    borderRadius: 30,
    padding: 20,
    float: "right",
    alignSelf: "center",
  },
  widgetStyle: {
    background: "#FFF",
    marginTop: 10,
    padding: 20,
    borderRadius: 20,
  },
}));
