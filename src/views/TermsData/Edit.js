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

export default function EditTerms() {
  const { t } = useTranslation();
  const classes = useStyles();
  const themContext = useContext(ThemeContext);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [data, setData] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true)
    API.readAll(`/dynamic/terms/data`).then(res => {
      setData(res)
      setLoader(false)
    })
  }, [])

  const onSubmit = (data) => {
    setLoader(true);
    let formData = new FormData();
    for (const key in data) {
      formData.append([key], data[key]);
    }
    API.create(`/dynamic/terms/data`, formData).then(res => {
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
                  <h4 className={classes.cardTitleWhite}>{t("Terms and conditions")}</h4>
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
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        defaultValue={data.data}
                        className={classes.gridItem}
                        {...register("data", { required: true })}
                        id="filled-basic"
                        label={t("data")}
                        required
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        defaultValue={data.ar_data}
                        className={classes.gridItem}
                        required
                        {...register("ar_data", { required: true })}
                        id="filled-basic"
                        label={t("ar_data")}
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
