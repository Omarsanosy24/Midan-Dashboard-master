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
import Table from "../../components/Table/Table.js";
import ReactPaginate from 'react-paginate';

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

export default function EditUser() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const themContext = useContext(ThemeContext);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [data, setData] = useState(false);
  const [orders, setOrders] = useState(false);
  const [transactions, settransactions] = useState(false);
  const [loader, setLoader] = useState(false);
  const [meta, setMeta] = useState();
  const [metaTans, setMetaTrans] = useState();
  const [values, setValues] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [pageOrder, setPageOrder] = useState(history.location.search.split("orderPage=")[1] ? history.location.search.split("orderPage=")[1] : 1);
  const [transactionsPage, settransactionsPage] = useState(history.location.search.split("transactionsPage=")[1] ? history.location.search.split("transactionsPage=")[1] : 1);
  useEffect(() => {
    if (id) {
      API.readAll(`/users/${id}?include=stores,stores.branches`).then(res => {
        setData(res.data)
        setLoader(true)
      })
      API.readAll(`/orders?filter[user.id]=${id}&page=${pageOrder}`).then(res => {
        setMeta(res.meta);
        if (res.data.length > 0) {
          const arrValues = [];
          res.data.map(item => {
            const tempArr = {};
            for (const key in item) {
              if (key !== "items" && key !== "branch" && key !== "updated_at" && key !== "notes" && key !== "created_at") {//item i dont want to list in the table
                if (key === "branch") {
                  tempArr["store_name"] = item["branch"].name;
                }
                else if (key === "name" || key === "ar_name") {
                  if (themContext.themeLayout === "admin") {
                    tempArr["name"] = item["name"];
                  } else {
                    tempArr["ar_name"] = item["ar_name"];
                  }
                }
                else {
                  tempArr[key] = item[key];
                }
              }
            }
            arrValues.push(tempArr);
          })
          setOrders(arrValues)
        }
      }).catch(err => {
        setLoader(false);
        console.log(err);
      })

      API.readAll(`/transactions?filter[user.id]=${id}&page=${transactionsPage}`).then(res => {
        setWallet(res.current_balance);
        setMetaTrans(res.meta);
        if (res.data.length > 0) {
          const arrValues = [];
          res.data.map(item => {
            const tempArr = {};
            for (const key in item) {
              if (key !== "") {//item i dont want to list in the table
                tempArr[key] = item[key];
              }
            }
            arrValues.push(tempArr);
          })
          settransactions(arrValues)
        }
      }).catch(err => {
        setLoader(false);
        console.log(err.response.data);
      })
    }
  }, [id, transactionsPage, pageOrder])

  const handlePageChange = (e) => {
    setPageOrder(e.selected + 1);
    history.push(`?orderPage=${e.selected + 1}`);
  }
  const handleTransactionsPageChange = (e) => {
    settransactionsPage(e.selected + 1);
    history.push(`?transactionsPage=${e.selected + 1}`);
  }

  const onSubmit = (data) => {
    setLoader(false);
    let formData = new FormData();
    formData.append("user_id", id);
    formData.append("amount", data.amount);
    formData.append("receipts[]", data.receipts[0]);
    API.create(`/deposits`, formData).then(res => {
      setLoader(true);
      window.location.reload();
    })
  };

  return (
    <div>
      {loader && data ? (
        <>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} >
              <Card className={"mb-5"}>
                <CardHeader color={themContext.themeColor}>
                  <h4 className={classes.cardTitleWhite}>{t("User info")}</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <h6>{t("name")}:{" "} {data.name}</h6>
                      <h6>{t("phone")}:{" "} {data.phone}</h6>
                      <h6>{t("wallet")}:{" "} {wallet}</h6>
                      {data.email && <h6>{t("email")}:{" "} {data.email}</h6>}
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
              {orders.length > 0 &&
                <Card>
                  <CardHeader color={themContext.themeColor}>
                    <h4 className={classes.cardTitleWhite}>{t("User orders")}</h4>
                  </CardHeader>
                  <CardBody>
                    <Table
                      tableHeaderColor={themContext.themeColor}
                      tableData={orders}
                      editPath={'edit-order'}
                      APIName={'products'}
                    />
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
                  </CardBody>
                </Card>}
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              {data.store &&
                <Card className={"mb-5"}>
                  <CardHeader color={themContext.themeColor}>
                    <h4 className={classes.cardTitleWhite}>{t("Store info")}</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <h6>{t("Store name")}:{" "} {data.store.name}</h6>
                        <h6>{t("Type")}:{" "} {data.store.store_type}</h6>
                        <hr />
                        <h4>{t("Branches")}</h4>
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">{t("id")}</th>
                              <th scope="col">{t("governate")}</th>
                              <th scope="col">{t("phone")}</th>
                              <th scope="col">{t("Region")}</th>
                              <th scope="col">{t("Latitude")}</th>
                              <th scope="col">{t("Longitude")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.store.branches.map((item, index) => (
                              <tr>
                                <th scope="row">{item.id}</th>
                                <td>{item.governate.name}</td>
                                <td>{item.phone}</td>
                                <td>{item.governate.region.name}</td>
                                <td>{item.latitude}</td>
                                <td>{item.longitude}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              }
              <form onSubmit={handleSubmit(onSubmit)}>
                <Card className={"mb-5"}>
                  <CardHeader color={themContext.themeColor}>
                    <h4 className={classes.cardTitleWhite}>{t("Create Deposit")}</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <TextField
                          className={classes.gridItem}
                          type={'number'}
                          {...register("amount", { required: true })}
                          id="filled-basic"
                          label={t("amount")}
                          required
                        />
                        <TextField
                          className={classes.gridItem}
                          type={'file'}
                          {...register("receipts", { required: true })}
                          id="filled-basic"
                          label={t("receipts")}
                          required
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button type={'submit'} color={themContext.themeColor}>{t('Create')}</Button>
                  </CardFooter>
                </Card>
              </form>
              {transactions.length > 0 &&
                <Card className={"mb-5"}>
                  <CardHeader color={themContext.themeColor}>
                    <h4 className={classes.cardTitleWhite}>{t("User Transactions")}</h4>
                  </CardHeader>
                  <CardBody>
                    <Table
                      tableHeaderColor={themContext.themeColor}
                      tableData={transactions}
                    // editPath={'edit-order'}
                    // APIName={'products'}
                    />
                    <div className="paginationConatiner">
                      {metaTans ? (
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
                          pageCount={metaTans ? metaTans.last_page : 0}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handleTransactionsPageChange}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                        />) : (<></>)
                      }
                    </div>
                  </CardBody>
                </Card>
              }

            </GridItem>
          </GridContainer>
        </>) : (<Loader />)
      }
    </div >
  );
}
