/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FilterAndSort from "../components/FilterAndSort";
import { Grid, Typography } from "@mui/material";
import { Breadcrumbs, Divider } from "@mui/joy";
import Product from "../components/Product";
import { useGetProductsQuery } from "../api/UserApi";
import ProductSkeleton from "../components/ProductSkeleton";
import Pagination from "../components/Pagination";
import { useNavigate, Link } from "react-router-dom";
import useIsLoggedIn from "../hooks/useIsLoggedIn";

const ProductsPage = ({ gender }) => {
  useIsLoggedIn();
  const navigateTo = useNavigate();
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    gender,
    page: "1",
  });
  const [initialLoad, setInitialLoad] = useState(true);
  const { data, isLoading, error } = useGetProductsQuery(filterOptions);

  const getDataFromFilter = (filterOptionsFromFilter) => {
    const updatedFilterOptions = {
      ...filterOptionsFromFilter,
      gender,
      page: "1",
    };
    setFilterOptions(updatedFilterOptions);
  };

  const getDataFromPagination = (pageFromPagination) => {
    setFilterOptions({ ...filterOptions, page: pageFromPagination });
  };

  useEffect(() => {
    if (data && data.ok) {
      setProducts(data.products);
      setInitialLoad(false);
    }
  }, [error, data, navigateTo, filterOptions]);

  return (
    <>
      <Grid marginX={3} marginTop={15}>
        <Breadcrumbs>
          <Link style={{ color: "blue" }} to="/">
            <Typography sx={{ color: "blue" }} variant="body1">
              Home
            </Typography>
          </Link>
          <Typography variant="body1">{gender}</Typography>
        </Breadcrumbs>
        <Divider />
        <FilterAndSort sendFilterOptions={getDataFromFilter} />
        <Typography
          sx={{ fontSize: "30px", fontWeight: "600", marginBottom: "1rem" }}
        >
          {!isLoading &&
            products.length !== 0 &&
            `SHOWING PAGE ${data?.pagination?.page} OF ${data?.pagination?.last}`}
        </Typography>
        <Grid display="flex" columnSpacing={3} rowSpacing={2} container>
          {!isLoading && !initialLoad && products.length === 0 && (
            <>
              <Grid
                height="300px"
                container
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: "30px",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  NO PRODUCTS FOUND WITH SPECIFIED FILTERS
                </Typography>
              </Grid>
            </>
          )}
          {!isLoading &&
            products.length !== 0 &&
            products.map((product) => (
              <Grid key={product._id} item>
                <Product {...product} />
              </Grid>
            ))}
          {isLoading &&
            Array.from({ length: 10 }, (_, index) => (
              <Grid item key={index}>
                <ProductSkeleton />
              </Grid>
            ))}
        </Grid>
        <Grid mt={4} container>
          <Grid item mb={5} mx="auto">
            {!isLoading && products.length !== 0 && data?.pagination && (
              <Pagination
                pagination={data.pagination}
                sendPage={getDataFromPagination}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductsPage;
