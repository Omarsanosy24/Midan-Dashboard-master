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
import { Grid } from "@material-ui/core";
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
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
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

export default function Complains() {
    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();
    const themContext = useContext(ThemeContext);
    const [meta, setMeta] = useState(false)
    const [values, setValues] = useState([]);
    const [page, setPage] = useState(history.location.search.split("page=")[1] ? history.location.search.split("page=")[1] : 1);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        API.readAll(`/complains?page=${page}`).then(res => {
            setMeta(res.meta);
            if (res.data.length > 0) {
                const arrValues = [];
                res.data.map(item => {
                    const tempArr = {};
                    for (const key in item) {
                        if (key === "user") {
                            if (item[key]) {
                                tempArr["name"] = item[key].name ? item[key].name : "N/A";
                                tempArr["phone"] = item[key].phone ? item[key].phone : "N/A";
                                if (key && item[key].store)
                                    tempArr["store_name"] = item[key].store.name ? item[key].store.name : "N/A";
                            }
                        }
                        else {
                            tempArr[key] = item[key];
                        }

                    }
                    arrValues.push(tempArr);
                })
                setValues(arrValues)
            }
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            console.log(err.response.data);
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
                                <Grid item xs={12} md={12} className="d-md-flex justify-content-between" >
                                    <h4 className={classes.cardTitleWhite}>{t('List Items')}</h4>
                                </Grid>
                            </Grid>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor={themContext.themeColor}
                                tableData={values}
                                editPath={false}
                                APIName={'users'}
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
