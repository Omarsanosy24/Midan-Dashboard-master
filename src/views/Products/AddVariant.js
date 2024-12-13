import React, { useContext, useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import ThemeContext from "../../layouts/theme-setting/SettingContext";
import { useForm } from "react-hook-form";
import API from "../../API.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../components/Loader/Loader";
import VariantFileds from './VariantFileds';
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import EditTableVariants from './EditTableVariants'

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
    },
    marginCard: {
        marginTop: "60px"
    }
};
const useStyles = makeStyles(styles);

export default function Addvariant() {
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation();
    const themContext = useContext(ThemeContext);
    const { handleSubmit } = useForm();
    const { register: register1, handleSubmit: handleSubmit1, reset } = useForm({ mode: "onBlur", });
    const [loader, setLoader] = useState(false);
    const { id } = useParams();
    //variant Card
    const [variantsCard, setVariantsCard] = useState([]);
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState([{ name: `value_1` }]);
    const [countInputs, setCountInputs] = useState(2);
    const [tableVariants, setTableVariants] = useState([]);

    useEffect(() => {
        API.readAll(`/products/${id}/variants`).then(res => {
            setVariantsCard(res.data.options)
            setTableVariants(res.data.variants)
            if (res.data.variants.length > 0) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        })
    }, [id])
    const handleIncreaseInput = (count) => {
        if ((inputs.length < count)) {
            setInputs([...inputs, { name: `value_${count}` }]);
            setCountInputs(count + 1);
        }
    }

    const handleDeleteInput = (name) => {
        setInputs(inputs.filter((input) => input.name !== name))
    }

    const handleAddNewVariant = (data) => {
        const arrValue = [];
        const key = data.key;
        delete data.key;
        Object.values(data).map((item) => {
            arrValue.push(item);
        })
        setVariantsCard([...variantsCard, ...[{ key: key, values: arrValue,  'stock':9999 }]]);
        setOpen(false);
        setInputs([{ name: `value_1` }]);
        setCountInputs(2);
        reset();
    }

    const onSubmit = (data) => {
        if (variantsCard.length > 0) {
            API.create(`/products/${id}/variants`, { options: variantsCard }).then(res => {
                setLoader(false);
                history.push(`/${themContext.themeLayout === "admin" ? "admin" : "rtl"}/products`);

            })
        }
    };

    return (
        <div>
            {loader && <Loader />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <GridContainer>
                    {tableVariants.length > 0 ? (
                        <>
                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader color={themContext.themeColor}>
                                        <h4 className={classes.cardTitleWhite}>{t("Variants Table")}</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div class="row text-muted justify-content-center" >
                                            <EditTableVariants tableVariants={tableVariants} setTableVariants={setTableVariants} />
                                        </div>
                                    </CardBody>
                                </Card>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <div className="d-flex justify-content-center">
                                    <Button onClick={() => {
                                        history.push(`/${themContext.themeLayout}/products`);
                                    }} color={themContext.themeColor}>{t("Done")}</Button>
                                </div>
                            </GridItem>
                        </>) : (<>

                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader color={themContext.themeColor}>
                                        <h4 className={classes.cardTitleWhite}>{t("Variants")}</h4>
                                    </CardHeader>
                                    <CardBody>
                                        {/*Variant Card*/}
                                        <div class="row text-muted justify-content-center" >
                                            {variantsCard.map((item) => {
                                                return (
                                                    <>
                                                        <VariantFileds variant={item} />
                                                    </>
                                                )
                                            })}
                                        </div>
                                        <div className="mt-3 d-flex justify-content-center">
                                            <Button type={'button'} onClick={() => setOpen(true)}> + {t('Add New Variant')}</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <div className="d-flex justify-content-center">
                                    <Button type={'submit'} color={themContext.themeColor}>{t("Add")}</Button>
                                </div>
                            </GridItem>
                        </>)}

                </GridContainer>
            </form>
            <Dialog
                open={open}
                onClose={variantsCard.length > 0 ? () => setOpen(false) : ""}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('Add New Variant')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <form onSubmit={handleSubmit1(handleAddNewVariant)}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <label>{t('Variant Name')}</label>
                                    <TextField
                                        className={classes.gridItem}
                                        {...register1("key", { required: true })}
                                        id="filled-basic"
                                        label={t('Variant Name')}
                                        required
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <hr style={{ width: '100%' }} />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <label>{t("Variant Values")}</label>
                                </GridItem>
                                {inputs.map((input, index) => {
                                    return (
                                        <GridItem xs={12} sm={12} md={12}>
                                            <div className="d-flex">
                                                <TextField
                                                    className={classes.gridItem}
                                                    {...register1(`${input.name}`, { required: true })}
                                                    id="filled-basic"
                                                    label={`${t("Value")} ${index + 1}`}
                                                    required
                                                />
                                                {index > 0 &&
                                                    <div className="mt-auto mb-auto" style={{ cursor: 'pointer' }} onClick={() => handleDeleteInput(input.name)}>
                                                        <svg className='col-sm-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                        </svg>
                                                    </ div>
                                                }
                                            </div>
                                        </GridItem>
                                    )
                                })}
                                <GridItem xs={12} sm={12} md={12}>
                                    <a
                                        style={{ color: 'blue', cursor: 'pointer', marginTop: '20px', marginBottom: '30px', }}
                                        onClick={() => handleIncreaseInput(countInputs)}
                                    >
                                        {t('Add')} {t("Value")}
                                    </a>
                                </GridItem>
                            </GridContainer>
                            {
                                variantsCard.length > 0 && <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                            }
                            <Button type={'submit'} autoFocus>
                                {t('Save')}
                            </Button>
                        </form>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div >
    );
}