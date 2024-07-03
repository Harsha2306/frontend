import { useState, useEffect } from "react";
import { Grid, TextField, CircularProgress, Checkbox } from "@mui/material";
import useInput from "./customHooks/useInput";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { Box, Chip, Alert, Select, Option, Textarea, Typography } from "@mui/joy";
import { v4 as uuidv4 } from "uuid";
import StyledButton from "../../components/StyledButton";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  useGetProductByIdQuery,
  usePostAddProductMutation,
} from "../../api/AdminApi";
import useIsAdminLoggedIn from "./customHooks/useIsAdminLoggedIn";

const INVALID_PRODUCT_ID =
  "input must be a 24 character hex string, 12 byte Uint8Array, or an integer";

const validateTextInput = (ip, pattern, setInputError, errMsg) => {
  if (ip.trim().length === 0) {
    setInputError(true);
    return "Please fill out this field.";
  }
  if (pattern.test(ip)) {
    setInputError(false);
    return "";
  } else {
    setInputError(true);
    return errMsg;
  }
};

const validateNumericInput = (ip, pattern, setInputError, errMsg) => {
  if (ip.trim().length === 0) {
    setInputError(true);
    return "Please fill out this field.";
  }
  if (pattern.test(ip)) {
    setInputError(false);
    return "";
  } else {
    setInputError(true);
    return errMsg;
  }
};

const validatePriceInput = (ip, pattern, setInputError, errMsg) => {
  if (ip.trim().length === 0) {
    setInputError(true);
    return "Please fill out this field.";
  }
  if (pattern.test(ip)) {
    setInputError(false);
    return "";
  } else {
    setInputError(true);
    return errMsg;
  }
};

const validateAvailableColors = (ip, pattern, setInputError, errMsg) => {
  if (ip.trim().length === 0) {
    setInputError(true);
    return "Please fill out this field.";
  }
  if (pattern.test(ip)) {
    setInputError(false);
    return "";
  } else {
    setInputError(true);
    return errMsg;
  }
};

const validateImages = (ip, pattern, setInputError, errMsg) => {
  if (ip.trim().length === 0) {
    setInputError(true);
    return "Please fill out this field.";
  } else setInputError(false);
};

const AddProductPage = () => {
  useIsAdminLoggedIn();
  const [searchParams] = useSearchParams();
  const [
    itemName,
    itemNameError,
    itemNameErrorMessage,
    itemNameChangeHandler,
    resetName,
    setItemNameError,
    setItemNameErrorMessage,
    setItemName,
  ] = useInput(
    /^[a-zA-Z0-9\s',.!&()#-]+$/,
    "Invalid Item name",
    validateTextInput
  );

  const [
    itemDescription,
    itemDescriptionError,
    itemDescriptionErrorMessage,
    itemDescriptionChangeHandler,
    resetDescription,
    setItemDescriptionError,
    setItemDescriptionErrorMessage,
    setItemDescription,
  ] = useInput(/.*/, "Invalid Description", validateTextInput);

  const [
    itemPrice,
    itemPriceError,
    itemPriceErrorMessage,
    itemPriceChangeHandler,
    resetPrice,
    setItemPriceError,
    setItemPriceErrorMessage,
    setItemPrice,
  ] = useInput(/^\d+(\.\d+)?$/, "Invalid Item Price", validatePriceInput);

  const [
    itemDiscount,
    itemDiscountError,
    itemDiscountErrorMessage,
    itemDiscountChangeHandler,
    resetDiscount,
    setItemDiscountError,
    setItemDiscountErrorMessage,
    setItemDiscount,
  ] = useInput(/^\d+(\.\d+)?$/, "Invalid Discount", validateNumericInput);

  const [
    itemAvailableColors,
    itemAvailableColorsError,
    itemAvailableColorsErrorMessage,
    itemAvailableColorsChangeHandler,
    resetAvailableColors,
    setItemAvalableColorsError,
    setItemAvalableColorsErrorMessage,
    setItemAvailableColors,
  ] = useInput(
    /^[a-zA-Z, -]+$/,
    "Invalid Syntax, please enter colors seperated by comma(,)",
    validateAvailableColors
  );

  const [
    itemAvailableImages,
    itemImagesError,
    itemImagesErrorMessage,
    itemImagesChangeHandler,
    resetImages,
    setItemAvailableImagesError,
    setItemAvailableImagesErrorMessage,
    setItemAvailableImages,
  ] = useInput(
    /^[a-zA-Z, -]+$/,
    "Must Enter (total provided colors) * 6",
    validateImages
  );
  const productId = searchParams.get("productId");
  const [itemTag, setTag] = useState("");
  const [itemAvailableSizes, setAvailableSizes] = useState([]);
  const [itemCategory, setCategory] = useState("Shoes");
  const [itemGender, setGender] = useState("Men");
  const [available, setAvailable] = useState(false);
  const [availableSizesC, setAvailableSizesC] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [postAddProduct] = usePostAddProductMutation();
  const { data, error, isError, isLoading, refetch } =
    useGetProductByIdQuery(productId);
  const navigateTo = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isError && data) {
        const { product, colors, imgs } = data;
        if (product && colors && imgs) {
          setItemName(product.itemName);
          setItemDescription(product.itemDescription);
          setItemPrice(product.itemPrice);
          setItemDiscount(product.itemDiscount);
          setTag(product.itemTag);
          setCategory(product.itemCategory);
          setGender(product.itemGender);
          setItemAvailableColors(colors);
          setAvailable(product.available);
          itemCategory === "Shoes"
            ? setAvailableSizes(product.itemAvailableSizes)
            : setAvailableSizesC(product.itemAvailableSizes);
          setItemAvailableImages(imgs);
        }
      }
      if (isError && error?.data?.message === INVALID_PRODUCT_ID) {
        navigateTo("/admin");
      }
      if (isError && error?.data?.message === "Not Authorized") {
        navigateTo("/admin/login");
      }
    }
  }, [
    isLoading,
    isError,
    error,
    data,
    setItemName,
    setItemDescription,
    setItemPrice,
    setItemDiscount,
    navigateTo,
    setItemAvailableColors,
    itemCategory,
    setItemAvailableImages,
  ]);

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  const resetForm = () => {
    resetName();
    resetPrice();
    resetDescription();
    resetDiscount();
    resetImages();
    resetAvailableColors();
    setTag("");
    setAvailableSizes([]);
    setAvailableSizesC([]);
    setCategory("Shoes");
    setGender("Men");
    setAvailableSizesC([]);
  };

  const tagChangeHandler = (e) => {
    setTag(e.target.textContent);
  };

  const availabeSizesChangeHandler = (e) => {
    if (itemAvailableSizes.includes(e.target.textContent)) {
      const modifiedAvailableSizes = itemAvailableSizes.filter(
        (size) => size !== e.target.textContent
      );
      setAvailableSizes(modifiedAvailableSizes);
    } else setAvailableSizes([...itemAvailableSizes, e.target.textContent]);
  };

  const availabeSizesCChangeHandler = (e) => {
    if (availableSizesC.includes(e.target.textContent)) {
      const modifiedAvailableSizesC = availableSizesC.filter(
        (size) => size !== e.target.textContent
      );
      setAvailableSizesC(modifiedAvailableSizesC);
    } else setAvailableSizesC([...availableSizesC, e.target.textContent]);
  };

  const categoryChangeHandler = (e) => {
    setCategory(e.target.textContent);
  };

  const genderChangeHandler = (e) => {
    setGender(e.target.textContent);
  };

  const isButtonDisabled = !(
    !itemNameError &&
    !itemPriceError &&
    !itemDiscountError &&
    !itemDescriptionError &&
    !itemAvailableColorsError &&
    !itemImagesError &&
    itemName.trim().length !== 0 &&
    String(itemDiscount).trim().length !== 0 &&
    itemDescription.trim().length !== 0 &&
    itemAvailableColors.trim().length !== 0 &&
    String(itemPrice).trim().length !== 0 &&
    itemAvailableImages.trim().length !== 0
  );

  const onButtonClick = async () => {
    setShowAlert(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const res = await postAddProduct({
      productId: productId,
      itemName,
      itemPrice,
      itemDiscount,
      itemDescription,
      itemTag,
      itemCategory,
      itemGender,
      itemAvailableSizes:
        itemAvailableSizes.length !== 0 ? itemAvailableSizes : availableSizesC,
      itemAvailableColors,
      itemAvailableImages,
      available,
    });
    if (res.error && res.error.data && res.error.data.errorFields) {
      res.error.data.errorFields.map((err) => {
        if (err.field === "itemName") {
          setItemNameError(true);
          setItemNameErrorMessage(err.errorMessage);
        }
        if (err.field === "itemPrice") {
          setItemPriceError(true);
          setItemPriceErrorMessage(err.errorMessage);
        }
        if (err.field === "itemDescription") {
          setItemDescriptionError(true);
          setItemDescriptionErrorMessage(err.errorMessage);
        }
        if (err.field === "itemDiscount") {
          setItemDiscountError(true);
          setItemDiscountErrorMessage(err.errorMessage);
        }
        if (err.field === "itemAvailableColors") {
          setItemAvalableColorsError(true);
          setItemAvalableColorsError(err.errorMessage);
        }
        if (err.field === "itemAvailableImages") {
          setItemAvailableImagesError(true);
          setItemAvailableImagesErrorMessage(err.errorMessage);
        }
      });
    }
    if (res.data && res.data.ok) {
      navigateTo("/admin");
    }
    resetForm();
    setShowAlert(false);
  };

  if (isLoading)
    return (
      <>
        <AdminNavBar />
        <Grid
          height="600px"
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="inherit" />
        </Grid>
      </>
    );

  return (
    <Grid container>
      <AdminNavBar />
      <>
        {showAlert && (
          <Grid item mt="80px" xs={12}>
            <Alert sx={{ borderRadius: "0px" }} variant="solid" color="primary">
              Adding/Updating Item To Database
            </Alert>
          </Grid>
        )}
        <Grid
          mt={showAlert ? "0px" : "90px"}
          padding={1}
          item
          xs={12}
          display="flex"
          justifyContent="center"
        >
          <Typography level="body-lg" sx={{ fontSize: "25px" }}>
            {productId ? "UPDATE PRODUCT" : "ADD NEW PRODUCT"}
          </Typography>
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM NAME <Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <TextField
              value={itemName}
              onChange={itemNameChangeHandler}
              placeholder="Enter Item name here"
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "50px",
                borderColor: itemNameError ? "rgb(182 41 6)" : "black",
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: itemNameError ? "rgb(182 41 6)" : "black",
                  },
              }}
            />
          </Grid>
          {itemNameError && (
            <Typography sx={{ color: "rgb(182 41 6)" }} level="body-sm">
              {itemNameErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM PRICE <Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <TextField
              value={itemPrice}
              onChange={itemPriceChangeHandler}
              placeholder="Enter Item price here"
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "50px",
                borderColor: itemPriceError ? "rgb(182 41 6)" : "black",
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: itemPriceError ? "rgb(182 41 6)" : "black",
                  },
              }}
            />
          </Grid>
          {itemPriceError && (
            <Typography sx={{ color: "rgb(182 41 6)" }} level="body-sm">
              {itemPriceErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM DISCOUNT <Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <TextField
              value={itemDiscount}
              onChange={itemDiscountChangeHandler}
              placeholder="Enter Item discount here"
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "50px",
                borderColor: itemDiscountError ? "rgb(182 41 6)" : "black",
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: itemDiscountError ? "rgb(182 41 6)" : "black",
                  },
              }}
            />
          </Grid>
          {itemDiscountError && (
            <Typography sx={{ color: "rgb(182 41 6)" }} level="body-sm">
              {itemDiscountErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM DESCRIPTION <Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <Textarea
              value={itemDescription}
              onChange={itemDescriptionChangeHandler}
              placeholder="Enter Item description here"
              variant="outlined"
              minRows={5}
              maxRows={5}
              sx={{
                "--Textarea-focusedHighlight": itemDescriptionError
                  ? "rgb(182 41 6)"
                  : "black",
              }}
            />
          </Grid>
          {itemDescriptionError && (
            <Typography sx={{ color: "rgb(182 41 6)" }} level="body-sm">
              {itemDescriptionErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM TAG
            </Typography>
          </Grid>
          <Grid xs={12} height="50px" item>
            <Select
              sx={{ height: "100%" }}
              value={itemTag}
              onChange={tagChangeHandler}
            >
              <Option value=""></Option>
              <Option value="Exclusive">Exclusive</Option>
              <Option value="Recycled">Recycled</Option>
              <Option value="Limited Edition">Limited Edition</Option>
            </Select>
          </Grid>
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM CATEGORY <Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} height="50px" item>
            <Select
              sx={{ height: "100%" }}
              value={itemCategory}
              onChange={categoryChangeHandler}
            >
              <Option value="Shoes">Shoes</Option>
              <Option value="Clothes">Clothes</Option>
              <Option value="Accessories">Accessories</Option>
            </Select>
          </Grid>
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM GENDER <Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} height="50px" item>
            <Select
              sx={{ height: "100%" }}
              value={itemGender}
              onChange={genderChangeHandler}
            >
              <Option value="Men">Men</Option>
              <Option value="Women">Women</Option>
              <Option value="Kids">Kids</Option>
            </Select>
          </Grid>
        </Grid>
        {itemCategory !== "Accessories" && (
          <Grid container mx={30} mb={3} item xs={12}>
            <Grid xs={12} item>
              <Typography paddingY={0.5} level="title-sm">
                ITEM AVAILABE SIZES <Typography color="danger">*</Typography>
              </Typography>
            </Grid>
            <Grid xs={12} height="50px" item>
              {itemCategory === "Shoes" && (
                <Select
                  required={true}
                  value={itemAvailableSizes}
                  multiple
                  onChange={availabeSizesChangeHandler}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                      {selected.map((selectedOption) => (
                        <Chip key={uuidv4()} variant="soft" color="primary">
                          {selectedOption.label}
                        </Chip>
                      ))}
                    </Box>
                  )}
                  sx={{
                    minWidth: "15rem",
                    height: "100%",
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  <Option key="UK 3" value="UK 3">
                    UK 3
                  </Option>
                  <Option key="UK 4" value="UK 4">
                    UK 4
                  </Option>
                  <Option key="UK 5" value="UK 5">
                    UK 5
                  </Option>
                  <Option key="UK 6" value="UK 6">
                    UK 6
                  </Option>
                  <Option key="UK 7" value="UK 7">
                    UK 7
                  </Option>
                  <Option key="UK 8" value="UK 8">
                    UK 8
                  </Option>
                  <Option key="UK 9" value="UK 9">
                    UK 9
                  </Option>
                  <Option key="UK 10" value="UK 10">
                    UK 10
                  </Option>
                  <Option key="UK 11" value="UK 11">
                    UK 11
                  </Option>
                  <Option key="UK 12" value="UK 12">
                    UK 12
                  </Option>
                </Select>
              )}
              {itemCategory === "Clothes" && (
                <Select
                  required={true}
                  value={availableSizesC}
                  multiple
                  onChange={availabeSizesCChangeHandler}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                      {selected.map((selectedOption) => (
                        <Chip key={uuidv4()} variant="soft" color="primary">
                          {selectedOption.label}
                        </Chip>
                      ))}
                    </Box>
                  )}
                  sx={{
                    minWidth: "15rem",
                    height: "100%",
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  <Option key="XS" value="XS">
                    XS
                  </Option>
                  <Option key="S" value="S">
                    S
                  </Option>
                  <Option key="M" value="M">
                    M
                  </Option>
                  <Option key="L" value="L">
                    L
                  </Option>
                  <Option key="XL" value="XL">
                    XL
                  </Option>
                </Select>
              )}
            </Grid>
          </Grid>
        )}
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM AVAILABLE COLORS<Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <Textarea
              value={itemAvailableColors}
              onChange={itemAvailableColorsChangeHandler}
              placeholder="Enter available colors here seperated by comma( , )"
              variant="outlined"
              minRows={5}
              maxRows={5}
              sx={{
                "--Textarea-focusedHighlight": itemAvailableColorsError
                  ? "rgb(182 41 6)"
                  : "black",
              }}
            />
          </Grid>
          {itemAvailableColorsError && (
            <Typography sx={{ color: "rgb(182 41 6)" }} level="body-sm">
              {itemAvailableColorsErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              ITEM AVAILABLE IMAGES<Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <Textarea
              value={itemAvailableImages}
              onChange={itemImagesChangeHandler}
              placeholder="Enter available images here seperated by ( | )"
              variant="outlined"
              minRows={5}
              maxRows={5}
              sx={{
                "--Textarea-focusedHighlight": itemImagesError
                  ? "rgb(182 41 6)"
                  : "black",
              }}
            />
          </Grid>
          {itemImagesError && (
            <Typography sx={{ color: "rgb(182 41 6)" }} level="body-sm">
              {itemImagesErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <Grid xs={12} item>
            <Typography paddingY={0.5} level="title-sm">
              IN STOCK<Typography color="danger">*</Typography>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Checkbox
              checked={available}
              onChange={() => setAvailable(!available)}
            />
          </Grid>
        </Grid>
        <Grid container mx={30} mb={3} item xs={12}>
          <StyledButton
            onClick={onButtonClick}
            text={productId ? "UPDATE PRODUCT" : "ADD NEW PRODUCT"}
            height="40px"
            color={isButtonDisabled ? "rgb(59 64 71)" : "white"}
            backgroundColor={isButtonDisabled ? "rgb(189 193 197)" : "black"}
            width="100%"
            hoverStyles={{
              color: isButtonDisabled ? "rgb(59 64 71)" : "white",
              backgroundColor: isButtonDisabled ? "rgb(189 193 197)" : "black",
            }}
            disabled={isButtonDisabled}
          />
        </Grid>
      </>
    </Grid>
  );
};

export default AddProductPage;
