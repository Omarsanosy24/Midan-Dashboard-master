import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import API from "../../API";
import ThemeContext from "../../layouts/theme-setting/SettingContext";
import ReactPaginate from 'react-paginate';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import '../../assets/css/pagination.css';
import { Grid, Button } from "@material-ui/core";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useTranslation } from 'react-i18next';

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0",
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF",
        },
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "auto",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "auto",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1",
        },
    },
};

const useStyles = makeStyles(styles);

export default function ProductsList() {
    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();
    const themContext = useContext(ThemeContext);
    const [meta, setMeta] = useState()
    const [values, setValues] = useState([]);
    const [page, setPage] = useState(history.location.search.split("page=")[1] ? history.location.search.split("page=")[1] : 1);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        API.readAll(`/products?page=${page}`).then(res => {
            setMeta(res.meta);
            if (res.data.length > 0) {
                const arrValues = [];
                res.data.map(item => {
                    const tempArr = {};
                    for (const key in item) {
                        if (key !== "order" && key !== "offer" && key !== "is_wishlist" && key !== "quick_add_to_cart") {//item i dont want to list in the table
                            if (key === "images") {
                                tempArr["image"] = `<img style="width:50px;" src="${item[key][0] ? item[key][0].url : ""}" />`;
                            }
                            else if (key === "name" || key === "ar_name") {
                                if (themContext.themeLayout === "admin") {
                                    tempArr["name"] = item["name"];
                                } else {
                                    tempArr["ar_name"] = item["ar_name"];
                                }
                            }
                            else if (key === "description" || key === "ar_description") {
                                if (themContext.themeLayout === "admin") {
                                    tempArr["description"] = item["description"];
                                } else {
                                    tempArr["ar_description"] = item["ar_description"];
                                }
                            }
                            else {
                                tempArr[key] = item[key];
                            }
                        }
                    }
                    arrValues.push(tempArr);
                })
                setValues(arrValues)
            }
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            console.log(err);
        })
    }, [page])

    const handlePageChange = (e) => {
        setPage(e.selected + 1);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        history.push(`?page=${e.selected + 1}`);
    }
    return (
        <>
            {loader && <Loader />}
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color={themContext.themeColor}>
                            <Grid container>
                                <Grid item xs={8} md={8} style={{ display: 'flex' }}>
                                    <h4 className={classes.cardTitleWhite}>{t('List Items')}</h4>
                                </Grid>
                                <Grid item xs={4} md={4} style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'end' }}>
                                    <Link to={`/${themContext.themeLayout}/add-product`}>
                                        <Button
                                            style={{ margin: "5px", color: 'white' }}
                                            variant="none"
                                        >
                                            <AddCircleIcon style={{ width: '40px', height: '40px' }} />
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>

                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor={themContext.themeColor}
                                tableData={values}
                                editPath={'edit-product'}
                                APIName={'products'}
                            />
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} >
                    <div className="paginationConatiner">
                        {meta ? (
                            <ReactPaginate
                                previousLabel={t("Previous")}
                                nextLabel={t("Next")}
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                pageCount={meta ? meta.last_page : 0}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                            />) : (<></>)
                        }
                    </div>
                </GridItem>
            </GridContainer >
        </>
    );
}
