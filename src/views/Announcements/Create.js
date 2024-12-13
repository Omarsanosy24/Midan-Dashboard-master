import React, { useContext, useState } from "react";
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
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import imageCompression from 'browser-image-compression';
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

export default function CreateAnnouncements() {
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation();

    const themContext = useContext(ThemeContext);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loader, setLoader] = useState(false);
    const [image, setImage] = useState(false);

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
            setLoader(true);
            const compressedFile = await imageCompression(imageFile, options);
            setLoader(false);
            setImage(compressedFile);
            setValue("image", compressedFile);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = (data) => {
        setLoader(true);
        let formData = new FormData();
        for (const key in data) {
            formData.append([key], data[key]);
        }
        API.create("/announcements", formData).then(res => {
            setLoader(false);
            history.push(`/${themContext.themeLayout}/announcements`);
            // history.push(`/admin/brands`);
        })
    };
    return (
        <div>
            {loader && <Loader />}
            <form onSubmit={handleSubmit(onSubmit)}>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color={themContext.themeColor}>
                                <h4 className={classes.cardTitleWhite}>{t("Create Announcement")}</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("title", { required: true })}
                                            id="filled-basic"
                                            label={t("title")}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("ar_title", { required: true })}
                                            id="filled-basic"
                                            label={t("Arabic title")}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <div>
                                            <TextField
                                                className={classes.gridItem}
                                                {...register("body", { required: true })}
                                                id="filled-basic"
                                                label={t("body")}
                                            />
                                        </div>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("ar_body", { required: true })}
                                            id="filled-basic"
                                            label={t("Arabic") + " " + t("body")}
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
            </form>
        </div >
    );
}
