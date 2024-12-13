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
import { TextField } from "@material-ui/core";
import API from "../../API.js";
import Loader from "../../components/Loader/Loader";
import { useTranslation } from 'react-i18next';

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

export default function EditContact() {
  const { t } = useTranslation();
  const classes = useStyles();
  const themContext = useContext(ThemeContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [data, setData] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true)
    API.readAll(`/dynamic/contactus/data`).then(res => {
      setData(res)
      setLoader(false)
    })
  }, [])

  const onSubmit = (data) => {
    setLoader(true);
    const obj = {
        "ar_name":data.ar_name,
        "data" : data.data,
        "ar_data" : {
          "phone":data.data.phone,
          "email": data.data.email,
          "address": data.ar_data.address,
          "website": data.data.website,
          "facebook": data.data.facebook
        }
    }
    API.create(`/dynamic/contactus/data`, obj).then(res => {
      setLoader(false);
    })
  };

  return (
    <div>
      {loader && <Loader />}
      {data ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={themContext.themeColor}>
                  <h4 className={classes.cardTitleWhite}>{t("Conatct us")}</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.ar_name}
                        className={classes.gridItem}
                        {...register("ar_name", { required: true })}
                        id="filled-basic"
                        label={t("ar_name")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        type={"text"}
                        defaultValue={data.data!==undefined&&data.data.phone?data.data.phone:'enter your phone'}
                        className={classes.gridItem}
                        {...register("data.phone", { required: true })}
                        id="filled-basic"
                        label={t("phone")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        type={"email"}
                        defaultValue={data.data!==undefined&&data.data.email?data.data.email:'enter your email'}
                        className={classes.gridItem}
                        {...register("data.email", { required: true })}
                        id="filled-basic"
                        label={t("email")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.data!==undefined&&data.data.address?data.data.address:'enter your address'}
                        className={classes.gridItem}
                        {...register("data.address", { required: true })}
                        id="filled-basic"
                        label={t("Address")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.data!==undefined&&data.ar_data.address?data.ar_data.address:'enter address in arabic'}
                        className={classes.gridItem}
                        {...register("ar_data.address", { required: true })}
                        id="filled-basic"
                        label={t("Arabic Address")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.data!==undefined&&data.data.website?data.data.website:'enter website url'}
                        className={classes.gridItem}
                        placeholder={'Midan.com/en/'}
                        {...register("data.website", { required: true })}
                        id="filled-basic"
                        label={t("Website")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        defaultValue={data.data!==undefined&&data.data.facebook?data.data.facebook:'enter facebook page url'}
                        className={classes.gridItem}
                        placeholder={'facebook.com/Midan'}
                        {...register("data.facebook", { required: true })}
                        id="filled-basic"
                        label={t("Facebook")}
                        required
                      />
                    </GridItem>

                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button type={'submit'} color={themContext.themeColor}>{t('Save')}</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </form>) : (<Loader />)
      }
    </div >
  );
}
