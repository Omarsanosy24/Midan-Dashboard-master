import React, { useContext, useState, Component } from "react";
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
import { Modal, Box, Typography, TextField, Select as MySelect, FormControl, InputLabel, MenuItem, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import API from "../../API.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import imageCompression from 'browser-image-compression';
import Loader from "../../components/Loader/Loader";
import { useEffect } from "react";
import ImageUploading from 'react-images-uploading';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Select, { components } from "react-select";
import { ErrorMessage } from "@hookform/error-message";
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
    },
    marginCard: {
        marginTop: "60px"
    }
};
const useStyles = makeStyles(styles);

export default function AddProduct() {
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation();
    const themContext = useContext(ThemeContext);
    const { register, handleSubmit, setValue, formState: { errors }, setError, clearErrors } = useForm();
    const { register: register1, formState: { errors: errors1 }, handleSubmit: handleSubmit1, reset } = useForm({ mode: "onBlur", });
    const [loader, setLoader] = useState(false);
    const [image, setImage] = useState(false);
    const [brands, setBrands] = useState({ data: [] });
    const [categories, setCategories] = useState({ data: [] });
    const [brandPage, setBrandPage] = useState(1);
    const [categoryPage, setCategoryPage] = useState(1);
    const [images, setImages] = useState([]);
    const [stockPage, setStockPage] = useState(1);
    const [stock, setStock] = useState({ data: [] });
    const [open, setOpen] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: window.innerWidth > 740 ? "35%" : "80%",
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        API.readAll(`/stock_types?page=${stockPage}`).then(res => {
            const Arr = [];
            res.data.map(item => {
                Arr.push(item);
            })
            const newData = {
                meta: res.meta,
                data: [...stock.data, ...Arr],
            }
            setStock(newData);
        })
    }, [stockPage])

    useEffect(() => {
        API.readAll(`/categories?page=${categoryPage}`).then(res => {
            const Arr = [];
            res.data.map(item => {
                Arr.push({ value: item.id, label: (themContext.themeLayout === "admin" ? item.name : item.ar_name), icon: item.image_url });
            })
            const newData = {
                meta: res.meta,
                data: [...categories.data, ...Arr],
            }
            setCategories(newData);
        })
    }, [categoryPage])

    useEffect(() => {
        API.readAll(`/brands?page=1`).then(res => {
            const Arr = [];
            for(let i = 1; i<=res.meta.last_page; i++){
                API.readAll(`/brands?page=${i}`).then(res => {
                   
                    res.data.map(item => {
                        Arr.push({ value: item.id, label: (themContext.themeLayout === "admin" ? item.name : item.ar_name), icon: item.image_url });
                    })
                    const newData = {
                        meta: res.meta,
                        data: [...brands.data, ...Arr],
                    }
                    setBrands(newData);
                }
                )
            }
        })
    }, [])



    const scrollStock = (e) => {
        if (stockPage < stock.meta.last_page) {
            setStockPage(stockPage + 1);
        }
    }

    const scrollCategories = (e) => {
        if (categoryPage < categories.meta.last_page) {
            setCategoryPage(categoryPage + 1);
        }
    }

    const scrollBrands = (e) => {
        // if (brandPage < brands.meta.last_page) {
        //     setBrandPage(brandPage + 1);
        // }
        setBrandPage(e.target.value)
    }

    const handleUploadImage = async (imageList) => {
        const arr = [];
        for (let i = 0; i < imageList.length; i++) {
            const imageFile = imageList[i].file;
            const options = {
                maxSizeMB: 0.5,
                initialQuality: 1,
                alwaysKeepResolution: true,
                useWebWorker: true,
            }
            try {
                const compressedFile = await imageCompression(imageFile, options);
                if (arr.filter(image => image.data_url === imageList[i].data_url).length === 0) {
                    arr.push({ data_url: imageList[i].data_url, file: compressedFile });
                }
            } catch (error) {
                console.log(error);
            }
        }
        clearErrors("images")
        setValue("images", arr);
        setImages(arr);
    };


    const handleAddStock = (data) => {
        setStock({ data: [...stock.data, ...[data]] })
        reset();
        setOpen(false)
    }

    const onSubmit = (data) => {
        setLoader(true);
        let formData = new FormData();
        if ('stock' in data && 'images' in data && 'category_id' in data && 'brand_id' in data) {
            if (data['images'].length > 0 && data['stock'].length > 0) {
                for (const key in data) {
                    if (key === "stock") {
                        data[key].map((item, i) => {
                            formData.append(`stock_types[${i}][name]`, item.name);
                            formData.append(`stock_types[${i}][ar_name]`, item.ar_name);
                            formData.append(`stock_types[${i}][quantity]`, item.quantity);
                        })
                    }
                    else if (key === "images") {
                        data[key].map((item, i) => {
                            formData.append(`images[${i}]`, item.file);
                        })
                    }
                    else {
                        formData.append([key], data[key]);
                    }
                }
                API.create("/products", formData).then(res => {
                    setLoader(false);
                    history.push(`/${themContext.themeLayout === "admin" ? "admin" : "rtl"}/add-variant/${res.data.id}`);
                })
            }
            else {
                if (!(data['images'].length > 0)) {
                    setError("images", { message: 'Please Choose at least one image' })
                }
                if (!(data['stock'].length > 0)) {
                    setError("stock_types", { message: 'Please Choose at least one stock type' })
                }
                setLoader(false);
            }
        }
        else {
            if (!('stock' in data)) {
                setError("stock_types", { message: 'Please Choose at least one stock type' })
            }
            if (!('images' in data)) {
                setError("images", { message: 'Please Choose at least one image' })
            }
            if (!('category_id' in data)) {
                setError("category_id", { message: 'Please Choose category' })
            }
            if (!('brand_id' in data)) {
                setError("brand_id", { message: 'Please Choose brand' })
            }
            setLoader(false);
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
            {loader && <Loader />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                        <Card>
                            <CardHeader color={themContext.themeColor}>
                                <h4 className={classes.cardTitleWhite}>{t("Basic Information")}</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("name", { required: true })}
                                            id="filled-basic"
                                            label={t("name")}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("ar_name", { required: true })}
                                            id="filled-basic"
                                            label={t("ar_name")}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("description", { required: true })}
                                            id="filled-basic"
                                            label={t("description")}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("ar_description", { required: true })}
                                            id="filled-basic"
                                            label={t("ar_description")}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("sku", { required: true })}
                                            id="filled-basic"
                                            label={t("SKU")}
                                        />
                                    </GridItem>
                                </GridContainer>

                            </CardBody>
                        </Card>

                        <Card className={classes.marginCard} >
                            <CardHeader color={themContext.themeColor}>
                                <h4 className={classes.cardTitleWhite}>{t("Gallery")}</h4>
                            </CardHeader>
                            <CardBody>
                                <ImageUploading
                                    multiple
                                    value={images}
                                    onChange={handleUploadImage}
                                    maxNumber={100}
                                    dataURLKey="data_url"
                                >
                                    {({
                                        imageList,
                                        onImageUpload,
                                        onImageRemoveAll,
                                        onImageUpdate,
                                        onImageRemove,
                                        isDragging,
                                        dragProps,
                                    }) => (
                                        <>
                                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} className=" upload__image-wrapper p-3">
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="col-md-3 image-item" style={{ textAlign: 'center' }}>
                                                        <img src={image['data_url']} style={{ width: '100px', height: '100px', objectFit: 'contain' }} alt="" width="100" />
                                                        <div className="image-item__btn-wrapper" style={{ textAlign: 'center', display: 'flex' }}>
                                                            <a style={{ color: 'white', cursor: 'pointer', margin: '2px' }} className="btn btn-primary " onClick={() => onImageUpdate(index)}>{t("Update")}</a>
                                                            <a style={{ color: 'white', cursor: 'pointer', margin: '2px' }} className="btn btn-danger " onClick={() => onImageRemove(index)}>{t("Remove")}</a>
                                                        </div>
                                                    </div>
                                                ))}
                                                <a
                                                    className='ml-3'
                                                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                                                    onClick={onImageUpload}
                                                    {...dragProps}
                                                >
                                                    <AddPhotoAlternateOutlinedIcon style={{ width: "100px", height: '100px', fill: '#696969', cursor: 'pointer' }} />
                                                </a>
                                                {/* &nbsp; */}
                                            </div>
                                            <div >
                                                {images.length > 0 &&
                                                    <a style={{ color: 'white', width: "140px", marginLeft: '15px', cursor: 'pointer' }} className="btn btn-danger mb-2 mt-4" onClick={onImageRemoveAll}>{t("Remove all")}</a>
                                                }
                                            </div>
                                        </>

                                    )}
                                </ImageUploading>
                                <ErrorMessage
                                    errors={errors}
                                    name={'images'}
                                    render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card>
                            <CardHeader color={themContext.themeColor}>
                                <h4 className={classes.cardTitleWhite}>{t('Category & Brand')}</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <InputLabel id="demo-simple-select-label" style={{ marginBottom: "10px" }}>{t("Category")}</InputLabel>
                                        <FormControl style={{ zIndex: 12 }} fullWidth>
                                            <Select
                                                options={categories.data}
                                                isMulti={false}
                                                onMenuScrollToBottom={scrollCategories}
                                                components={{ Option: IconOption }}
                                                onChange={(e) => { setValue('category_id', e.value); clearErrors("category_id") }}
                                                className={"col-lg-12  pl-0 pr-0"} />
                                        </FormControl>
                                        <ErrorMessage
                                            errors={errors}
                                            name={'category_id'}
                                            render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12} style={{ marginTop: "20px" }}>
                                        <InputLabel id="demo-simple-select-label" style={{ marginBottom: "10px" }}>{t("Brands")}</InputLabel>
                                        <FormControl style={{ zIndex: 11 }} fullWidth>
                                            <Select
                                                options={brands.data}
                                                isMulti={false}
                                                onMenuScrollToBottom={scrollBrands}
                                                components={{ Option: IconOption }}
                                                onChange={(e) => { setValue('brand_id', e.value); clearErrors("brand_id"); }}
                                                className={"col-lg-12  pl-0 pr-0"} />
                                        </FormControl>
                                        <ErrorMessage
                                            errors={errors}
                                            name={'brand_id'}
                                            render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                            </CardFooter>
                        </Card>
                        <Card className={classes.marginCard} >
                            <CardHeader color={themContext.themeColor}>
                                <h4 className={classes.cardTitleWhite}>{t("Stock")}</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12} >
                                        <InputLabel id="demo-simple-select-label" style={{ marginBottom: "10px" }}>{t("Stock")}</InputLabel>
                                        <div style={{ display: 'flex' }}>
                                            <FormControl style={{ zIndex: 10, width: '90%' }} fullWidth>
                                                <Select
                                                    isClearable
                                                    isSearchable
                                                    options={stock.data}
                                                    getOptionLabel={(option) => `${themContext.themeLayout === "admin" ? option.name : option.ar_name}`}
                                                    getOptionValue={(option) => `${option.name}`}
                                                    isMulti={true}
                                                    onMenuScrollToBottom={scrollStock}
                                                    onChange={(e) => { setValue("stock", e); clearErrors("stock_types") }}
                                                    className={"col-lg-12  pl-0 pr-0"} />
                                            </FormControl>
                                            <Button onClick={() => setOpen(true)} style={{
                                                margin: '0 5px 0 5px',
                                                height: '37px'
                                            }}>
                                                + {t("Add")}
                                            </Button>
                                        </div>
                                        <ErrorMessage
                                            errors={errors}
                                            name={'stock_types'}
                                            render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <div className="d-flex justify-content-center">
                    <Button type={'submit'} color={themContext.themeColor}>{t("Next")}</Button>
                </div>
            </form>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form onSubmit={handleSubmit1(handleAddStock)}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t("Add New Stock")}
                        </Typography>
                        <TextField
                            {...register1("name", { required: true })}
                            className={classes.gridItem}
                            id="filled-basic"
                            label={t("name")}
                        />
                        <TextField
                            {...register1("ar_name", { required: true })}
                            className={classes.gridItem}
                            id="filled-basic"
                            label={t("ar_name")}
                        />
                        <TextField
                            {...register1("quantity", { required: true })}
                            className={classes.gridItem}
                            id="filled-basic"
                            type={'number'}
                            label={t("Quantity")}
                        />
                        <div className="d-flex">
                            <Button type={'submit'}>{t("Add")}</Button>
                            <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                        </div>
                    </Box>
                </form>
            </Modal>
        </div >
    );
}
