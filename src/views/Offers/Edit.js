import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import ThemeContext from "../../layouts/theme-setting/SettingContext";
import { useForm } from "react-hook-form";
import { TextField, Checkbox } from "@material-ui/core";
import API from "../../API.js";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import imageCompression from 'browser-image-compression';
import Loader from "../../components/Loader/Loader";
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel } from "@material-ui/core";
import Select, { components } from "react-select";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  gridItem: {
    width: "100%",
    marginBottom: "10px"
  }
};

const useStyles = makeStyles(styles);

export default function EditOffer() {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const { id } = useParams();
  const themContext = useContext(ThemeContext);
  const { register, setValue, handleSubmit, formState: { errors } } = useForm({ shouldUnregister: true });
  const [data, setData] = useState(false);
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(false);
  const [products, setProducts] = useState({ data: [] });
  const [selectedProducts, setSelectedProducts] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (id) {
      setLoader(true)
      API.read(`/offers`, id).then(res => {
        setData(res.data)
        setLoader(true)
      })
      API.readAll(`/products?filter[offer.id]=${id}`).then(res => {
        const Arr = [];
        res.data.map(item => {
          Arr.push({ value: item.id, label: (themContext.themeLayout === "admin" ? item.name : item.ar_name), icon: item.images[0].url });
        })
        setValue("products", Arr);
        setSelectedProducts(Arr);
      })
    }
  }, [id])

  useEffect(() => {
    API.readAll(`/products?page=${productPage}`).then(res => {
      const Arr = [];
      res.data.map(item => {
        Arr.push({ value: item.id, label: (themContext.themeLayout === "admin" ? item.name : item.ar_name), icon: item.images[0].url });
      })
      const newData = {
        meta: res.meta,
        data: [...products.data, ...Arr],
      }
      setProducts(newData);
    })
  }, [productPage])

  const scrollProducts = (e) => {
    if (productPage < products.meta.last_page) {
      setProductPage(productPage + 1);
    }
  }

  const handleChangeNotification = (e) => {
    setHasNotification(e.target.checked)
    setValue("has_notification", e.target.checked === true ? 1 : 0);
  }


  const handleChangeImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.05,
      initialQuality: 1,
      alwaysKeepResolution: true,
      useWebWorker: true,
      alwaysKeepResolution: 1
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setImage({ ...image, ...{ [e.target.name]: compressedFile } });
      setValue(`${e.target.name}`, compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    setLoader(true);
    let formData = new FormData();
    if (!data.has_notification) {
      formData.append('has_notification', 0);
    }
    for (const key in data) {
      if (key === "products") {
        data[key].map((item, index) => {
          formData.append(`products[${index}]`, item.value);
        })
      }
      else if (key === "notification") {
        Object.keys(data[key]).map((item, index) => {
          formData.append(`notification[${item}]`, data[key][item]);
        })
      }
      else {
        formData.append([key], data[key]);
      }
    }
    formData.append("_method", "Put");

    if (data.products && data.products.length > 0) {
      API.create(`/offers/${id}`, formData).then(res => {
        setLoader(false);
        history.push(`/${themContext.themeLayout}/offers`);
      })
    }
    else {
    }
  };

  const { Option } = components;
  const IconOption = props => (
    <Option {...props}>
      <img
        src={(props.data.icon)}
        style={{ width: 15, margin: 5 }}
        alt={props.data.label}
      />
      {props.data.label}
    </Option>
  );

  return (
    <div>
      {loader && data ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={themContext.themeColor}>
                  <h4 className={classes.cardTitleWhite}>{t("Edit offer")}</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <div className="mb-2">
                        <h4>
                          {t('Image')}
                        </h4>
                      </div>{
                        image.image_url ? (
                          <img style={{ width: '100px', height: '100px', marginBottom: '10px', marginRight: '10px', objectFit: 'contain' }} src={URL.createObjectURL(image.image_url)} />
                        ) : (
                          <img style={{ width: '100px', height: '100px', marginBottom: '10px', marginRight: '10px', objectFit: 'contain' }} src={data.image_url} />
                        )
                      }
                      <input
                        type="file"
                        name="image_url"
                        onChange={handleChangeImage}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <div className="mb-2">
                        <h4>
                          {t('AR Image')}
                        </h4>
                      </div>
                      {
                        image.ar_image_url ? (
                          <img style={{ width: '100px', height: '100px', marginBottom: '10px', marginRight: '10px', objectFit: 'contain' }} src={URL.createObjectURL(image.ar_image_url)} />
                        ) : (
                          <img style={{ width: '100px', height: '100px', marginBottom: '10px', marginRight: '10px', objectFit: 'contain' }} src={data.ar_image_url} />
                        )
                      }
                      <input
                        type="file"
                        name="ar_image_url"
                        onChange={handleChangeImage}
                      />
                    </GridItem>
                  </GridContainer>
                  <br />
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.name}
                        className={classes.gridItem}
                        {...register("name", { required: true })}
                        id="filled-basic"
                        label={t("name")}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.ar_name}
                        className={classes.gridItem}
                        {...register("ar_name", { required: true })}
                        id="filled-basic"
                        label={t("ar_name")}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <label className="mb-0 mt-2" for="start_at">{t("start date/time")}</label>
                      <TextField
                        id={"start_at"}
                        defaultValue={data.start_at}
                        className={classes.gridItem}
                        {...register("start_at", { required: true })}
                        type={"datetime-local"}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <label className="mb-0 mt-2" for="expire_at">{t("End date/time")}</label>
                      <TextField
                        id={"expire_at"}
                        defaultValue={data.expire_at}
                        className={classes.gridItem}
                        {...register("expire_at", { required: true })}
                        type={"datetime-local"}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <label className="mb-0 mt-2" for="expire_at">{t("percentage")}</label>
                      <TextField
                        min="0" max="100"
                        type={"number"}
                        defaultValue={data.percentage}
                        className={classes.gridItem}
                        {...register("percentage", { required: true })}
                        id="filled-basic"
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <InputLabel id="demo-simple-select-label" style={{ marginBottom: "10px" }}>{t("Products")}</InputLabel>
                      <FormControl style={{ zIndex: 12 }} fullWidth>
                        {selectedProducts &&
                          <Select
                            options={products.data}
                            isMulti={true}
                            defaultValue={selectedProducts}
                            onMenuScrollToBottom={scrollProducts}
                            components={{ Option: IconOption }}
                            required
                            onChange={(e) => {
                              setValue(`products`, e);
                            }}
                            className={"col-lg-12  pl-0 pr-0"} />
                        }
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <hr />
                  <GridContainer>
                    <GridItem xs={12} md={12}>
                      <Checkbox id={'checkbox'} onChange={handleChangeNotification} color="default" />
                      <label for={'checkbox'}>
                        {t("Send Notification?")}
                      </label>
                    </GridItem>
                  </GridContainer>
                  {hasNotification &&
                    <GridContainer>
                      <GridItem xs={12} md={6}>
                        <TextField
                          className={classes.gridItem}
                          {...register("notification[title]", { required: true })}
                          id="filled-basic"
                          label={t("title")}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          className={classes.gridItem}
                          {...register("notification[ar_title]", { required: true })}
                          id="filled-basic"
                          label={t("Arabic title")}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <div>
                          <TextField
                            className={classes.gridItem}
                            {...register("notification[body]", { required: true })}
                            id="filled-basic"
                            label={t("body")}
                          />
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          className={classes.gridItem}
                          {...register("notification[ar_body]", { required: true })}
                          id="filled-basic"
                          label={t("Arabic") + " " + t("body")}
                        />
                      </GridItem>
                    </GridContainer>
                  }
                </CardBody>
                <CardFooter>
                  <Button type={'submit'} color={themContext.themeColor}>{t("Save")}</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </form>) : (<Loader />)
      }
    </div >
  );
}
