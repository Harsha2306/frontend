/* eslint-disable react/prop-types */
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid, CircularProgress } from "@mui/material";
import { useState } from "react";
import { Typography } from "@mui/joy";
import { usePostOrderStatusMutation } from "../../api/AdminApi";

const AdminOrderDetails = ({ orderId, products, currentOrderStatus }) => {
  const [orderStatus, setOrderStatus] = useState(currentOrderStatus);
  const [updateOrderStatus, { isLoading }] = usePostOrderStatusMutation();

  const handleChange = async (event) => {
    setOrderStatus(event.target.value);
    await updateOrderStatus({
      orderStatus: event.target.value,
      orderId,
    });
  };

  return (
    <>
      <Grid container p={2} item>
        <Grid item xs={3}>
          <Typography level="title-lg">#{orderId}</Typography>
        </Grid>
        <Grid item container xs={7}>
          {products.map((product, idx) => (
            <Grid item key={idx} xs={12}>
              <Typography level="body-md">
                {product.name} |
                {product.size.trim().length !== 0 && `Size:${product.size} |`}
                Color:
                {product.color} | Quantity:{product.qty}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={2}>
          {isLoading ? (
            <CircularProgress color="inherit" />
          ) : (
            <FormControl sx={{ m: 1, minWidth: 180 }} size="medium">
              <InputLabel>Order Status</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={orderStatus}
                label="Order Status"
                onChange={handleChange}
              >
                <MenuItem value="pending">None</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AdminOrderDetails;
