import React, { useContext, useState, Fragment } from "react";
// @material-ui/core components
import {
    makeStyles,
} from "@material-ui/core/styles";

import { ThemeProvider, createTheme } from "@mui/material/styles";

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
import { Modal, Box, Typography, TextField, FormControl, InputLabel } from "@material-ui/core";
import API from "../../API.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import imageCompression from 'browser-image-compression';
import Loader from "../../components/Loader/Loader";
import { useEffect } from "react";
import ImageUploading from 'react-images-uploading';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Select, { components } from "react-select";
import { ErrorMessage } from "@hookform/error-message";
import { useParams } from "react-router-dom";
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

export default function EditProduct() {
    const rtlTheme = createTheme({ direction: "rtl" });
    const ltrTheme = createTheme({ direction: "ltr" });
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation();
    const themContext = useContext(ThemeContext);
    const { register, handleSubmit, setValue, formState: { errors }, setError, clearErrors } = useForm();
    const { register: register1, formState: { errors: errors1 }, handleSubmit: handleSubmit1, reset } = useForm({ mode: "onBlur", });
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState(false);
    const [variant, setVariant] = useState([]);
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
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        API.readAll(`/stock_types?page=${stockPage}`).then(res => {
            const newData = {
                meta: res.meta,
                data: [...stock.data, ...res.data],
            }
            setStock(newData);
        })
    }, [stockPage])

    useEffect(() => {
        API.readAll(`/categories?page=${categoryPage}`).then(res => {
            const newData = {
                meta: res.meta,
                data: [...categories.data, ...res.data],
            }
            setCategories(newData);
        })
    }, [categoryPage])

    useEffect(() => {
        API.readAll(`/brands?page=${brandPage}`).then(res => {
            const newData = {
                meta: res.meta,
                data: [...categories.data, ...res.data],
            }
            setBrands(newData);
        })
    }, [brandPage])


    useEffect(() => {
        setLoader(true)
        API.read(`/products`, id).then(res => {
            setData(res.data);
            setLoader(false);
            setValue("category_id", res.data.category.id);
            setValue("brand_id", res.data.brand.id);
            setValue("stock", res.data.stock_types);
            res.data.images.map(async (image) => {
                try {
                    const response = await fetch(image.url);
                    const imageBlob = await response.blob();
                    imageBlob.name = "image" + image.id + ".jpg";
                    const reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = () => {
                        const base64data = reader.result;
                        setImages(images => [...images, { data_url: base64data, id: image.id, file: imageBlob }]);
                        setValue('images', [...images, { data_url: base64data, id: image.id, file: imageBlob }]);
                    }
                } catch {
                    console.log("Error Fetching Images");
                }
            })
        })
        API.readAll(`/products/${id}/variants/`).then(res => {
            setVariant(res.data.options);
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
        if (brandPage < brands.meta.last_page) {
            setBrandPage(brandPage + 1);
        }
    }

    const handleUploadImage = async (imageList, addUpdateIndex) => {
        clearErrors('images');
        setLoader(true);
        const options = {
            maxSizeMB: 0.05,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            alwaysKeepResolution: 1
        }
        if (addUpdateIndex) {
            var formData = new FormData();
            await addUpdateIndex.map(async (i) => {
                const imageFile = imageList[i].file;
                try {
                    const compressedFile = await imageCompression(imageFile, options);
                    formData.append('images[]', compressedFile);
                    API.create(`/products/${id}/images`, formData)
                        .then(async res => {
                            res.data.map(async (image) => {
                                setImages([]);
                                try {
                                    const response = await fetch(image.url);
                                    const imageBlob = await response.blob();
                                    imageBlob.name = "image" + image.id + ".jpg";
                                    const reader = new FileReader();
                                    reader.readAsDataURL(imageBlob);
                                    reader.onloadend = () => {
                                        const base64data = reader.result;
                                        setImages(images => [...images, { data_url: base64data, id: image.id, file: imageBlob }]);
                                        setValue('images', [...images, { data_url: base64data, id: image.id, file: imageBlob }]);
                                    }
                                } catch {
                                    console.log("Error Fetching Images");
                                }
                            })
                            setLoader(false);
                        })
                        .catch(err => { console.log(err) })
                } catch (error) {
                    console.log(error);
                }
            })
        }
    };

    const handleAddStock = (data) => {
        setStock({ data: [...stock.data, ...[data]] })
        reset();
        setOpen(false)
    }
    const handleRemoveAllImage = async () => {
        setLoader(true);
        await images.map(item => {
            API.delete(`/products/${id}/images`, item.id)
                .then(async res => {
                })
                .catch(err => { console.log(err) })
        })
        setLoader(false);
        setImages([]);
    }
    const handleRemoveImage = (imageId) => {
        setImages([]);
        setLoader(true);
        API.delete(`/products/${id}/images`, imageId)
            .then(async res => {
                res.data.map(async (image) => {
                    try {
                        const response = await fetch(image.url);
                        const imageBlob = await response.blob();
                        imageBlob.name = "image" + image.id + ".jpg";
                        const reader = new FileReader();
                        reader.readAsDataURL(imageBlob);
                        reader.onloadend = () => {
                            const base64data = reader.result;
                            setImages(images => [...images, { data_url: base64data, id: image.id, file: imageBlob }]);
                            setValue('images', [...images, { data_url: base64data, id: image.id, file: imageBlob }]);
                        }
                    } catch {
                        console.log("Error Fetching Images");
                    }
                })
                setLoader(false);
            })
            .catch(err => { console.log(err) })
    }

    const onSubmit = (data) => {
        setLoader(true);
        let formData = new FormData();
        formData.append("_method", "PATCH");
        if ('stock' in data && 'category_id' in data && 'brand_id' in data) {
            if (data['stock'].length > 0) {
                for (const key in data) {
                    if (key === "stock") {
                        data[key].map((item, i) => {
                            formData.append(`stock_types[${i}][name]`, item.name);
                            formData.append(`stock_types[${i}][ar_name]`, item.ar_name);
                            formData.append(`stock_types[${i}][quantity]`, item.quantity);
                        })
                    }
                    else if (key === "images") {
                    }
                    else {
                        formData.append([key], data[key]);
                    }
                }
                API.create(`/products/${id}`, formData).then(res => {
                    setLoader(false);
                })
            }
            else {
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
    const IconOption = props => {
        return (
            <Option {...props}>
                <img
                    src={(props.data.image_url)}
                    style={{ width: 15, margin: 5 }}
                    alt={props.data.name}
                />
                {themContext.themeLayout === "admin" ? props.data.name : props.data.ar_name}
            </Option>
        );
    }

    return (
        <div>
            {loader && <Loader />}
            <Button onClick={() => { history.push(`/${themContext.themeLayout === "admin" ? "admin" : "rtl"}/edit-variant/${id}`) }}>{t('Edit variants')}</Button>
            {data &&
                <ThemeProvider theme={rtlTheme}>
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
                                            <GridItem xs={12} sm={12} md={6}>
                                                <TextField
                                                    defaultValue={data.description}
                                                    className={classes.gridItem}
                                                    {...register("description", { required: true })}
                                                    id="filled-basic"
                                                    label={t("description")}
                                                />
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                                <TextField
                                                    defaultValue={data.ar_description}
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
                                                    defaultValue={data.sku}
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
                                            // multiple
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
                                                dragProps,
                                            }) => (
                                                <>
                                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} className=" upload__image-wrapper p-3">
                                                        {imageList.map((image, index) => (
                                                            <div key={index} className="col-md-3 image-item" style={{ textAlign: 'center' }}>
                                                                <img src={image['data_url']} style={{ width: '100px', height: '100px', objectFit: 'contain' }} alt="" width="100" />
                                                                <div className="image-item__btn-wrapper" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                                                    {/* <a style={{ color: 'white', cursor: 'pointer', margin: '2px' }} className="btn btn-primary " onClick={() => onImageUpdate(image.id)}>Update</a> */}
                                                                    <a style={{ color: 'white', cursor: 'pointer', margin: '2px' }} className="btn btn-danger " onClick={async () => { await handleRemoveImage(image.id); onImageRemove(index) }}>{t("Remove")}</a>
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
                                                            <a style={{ color: 'white', width: "140px", marginLeft: '15px', cursor: 'pointer' }} className="btn btn-danger mb-2 mt-4" onClick={() => { handleRemoveAllImage(); onImageRemoveAll() }}>{t("Remove all")}</a>
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
                                                    {categories.data.length > 0 &&
                                                        <Select
                                                            isSearchable
                                                            defaultValue={data.category || "Select.."}
                                                            options={categories.data}
                                                            getOptionLabel={(option) => `${themContext.themeLayout === "admin" ? option.name : option.ar_name}`}
                                                            getOptionValue={(option) => `${option.id}`}
                                                            isMulti={false}
                                                            onMenuScrollToBottom={scrollCategories}
                                                            components={{ Option: IconOption }}
                                                            onChange={(e) => { setValue('category_id', e.id); clearErrors("category_id") }}
                                                            className={"col-lg-12  pl-0 pr-0"} />
                                                    }
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
                                                        isSearchable
                                                        defaultValue={data.brand || 'Select'}
                                                        options={brands.data}
                                                        getOptionLabel={(option) => `${themContext.themeLayout === "admin" ? option.name : option.ar_name}`}
                                                        getOptionValue={(option) => `${option.id}`}
                                                        isMulti={false}
                                                        onMenuScrollToBottom={scrollBrands}
                                                        components={{ Option: IconOption }}
                                                        onChange={(e) => { setValue('brand_id', e.id); clearErrors("brand_id"); }}
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
                                                            defaultValue={data.stock_types || "Select.."}
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
                        {/* {
                        variant.length> 0 && <Editvariant  variants={variant}/>
                    } */}

                        <div className="d-flex justify-content-center">
                            <Button type={'submit'} color={themContext.themeColor}>{t("Update")}</Button>
                        </div>
                    </form>
                </ThemeProvider>
            }
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
                            <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
                        </div>
                    </Box>
                </form>

            </Modal>
        </div>
    );
}