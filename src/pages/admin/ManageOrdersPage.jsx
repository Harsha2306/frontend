import { Grid, CircularProgress } from "@mui/material";
import AdminNavBar from "../../components/admin/AdminNavBar";
import AdminOrderDetails from "../../components/admin/AdminOrderDetails";
import { useGetOrdersQuery } from "../../api/AdminApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageOrdersPage = () => {
  const navigateTo = useNavigate();
  const [orders, setOrders] = useState([]);
  const { data, isLoading, isError, error } = useGetOrdersQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!isError) {
        setOrders(data?.ordersSummary);
      } else {
        if (
          error?.data?.message === "Not Authorized" ||
          error?.data?.message === "jwt expired"
        ) {
          navigateTo("/admin/login");
        }
      }
    }
  }, [data, error, isError, isLoading, navigateTo]);

  return (
    <>
      <AdminNavBar />
      {isLoading && (
        <Grid
          height="600px"
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="inherit" />
        </Grid>
      )}
      {!isLoading && (
        <Grid container mt="100px">
          {orders?.map((order, idx) => (
            <AdminOrderDetails
              orderId={order.orderId}
              products={order.products}
              currentOrderStatus={order.orderStatus}
              key={idx}
            />
          ))}
        </Grid>
      )}
    </>
  );
};

export default ManageOrdersPage;
