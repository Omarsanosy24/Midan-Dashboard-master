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
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import imageCompression from 'browser-image-compression';
import Loader from "../../components/Loader/Loader";
import { useTranslation } from 'react-i18next';
import Select from "react-select";

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

export default function EditDeposit() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const themContext = useContext(ThemeContext);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [data, setData] = useState(false);
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(false);
  useEffect(() => {
    if (id) {
      setLoader(true)
      API.readAll(`/deposits/${id}?include=user`).then(res => {
        setData(res.data)
        setLoader(true)
      })
    }
  }, [id])



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
      // setLoader(true);
      const compressedFile = await imageCompression(imageFile, options);
      // setLoader(false);
      setImage(compressedFile);
      setValue("image", compressedFile);
    } catch (error) {
      console.log(error);
    }
  };


  const onSubmit = (data) => {
    setLoader(true);
    API.create(`/deposits/${id}`, {status:"Approved", _method:"PUT"}).then(res => {
      setLoader(false);
      history.push(`/${themContext.themeLayout}/deposits`);
    })
  };
  
  return (
    <div>
      {loader && data ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={themContext.themeColor}>
                  <h4 className={classes.cardTitleWhite}>{t("Edit Deposit")}</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <h5 style={{ textTransform: "capitalize" }}> {t('Customer name')}: {data.user.name}</h5>
                      <h5 style={{ textTransform: "capitalize" }}> {t('Customer phone')}: {data.user.phone}</h5>
                      <hr/>
                      <h5 style={{ textTransform: "capitalize" }}> {t('Store name')}: {data.user.store.name}</h5>
                      <hr/>
                      <h5 style={{ textTransform: "capitalize" }}> {t('amount')}: {data.amount}</h5>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      {data && data.receipts.map((item, index) => {
                        return (
                          <>
                            <img style={{ objectFit: "contain", margin: `0 20px` }} src={item.url} />
                          </>
                        )
                      })}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <div className="d-flex">
                    <Button type={'submit'} style={{ backgroundColor: 'green' }}>{t('Approve')}</Button>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </form>) : (<Loader />)
      }
    </div >
  );
}
