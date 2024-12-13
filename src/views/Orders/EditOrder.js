import React, { useContext, useState, useEffect } from 'react';
import API from '../../API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import ThemeContext from "../../layouts/theme-setting/SettingContext";
import { useTranslation } from 'react-i18next';
import CancelledProducts from './common/CancelledProducts';
import ProductsListEditable from './common/ProductsListEditable';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FormControl, InputLabel } from "@material-ui/core";
import Select from "react-select";

function EditOrder() {
    const { id } = useParams();
    const history = useHistory();
    const { t } = useTranslation();
    const themContext = useContext(ThemeContext);
    const [order, setOrder] = useState([]);
    const [status, setStatus] = useState(
        [
            { value: "Processing", label: "Processing" },
            { value: "Preparing", label: "Preparing" },
            { value: "Out for delivery", label: "Out for delivery" },
            { value: "Delivered", label: "Delivered" },
        ]
    );
    const [productsEditable, setProductsEditable] = useState([]);
    const [cancelledProducts, setCancelledProducts] = useState([]);

    useEffect(() => {
        API.readAll(`/orders/${id}`).then(response => {
            setOrder(response.data);
          response.data.items.map((item,index)=>(
            <>
          {  item.status!=="Cancelled"?
            API.update(`/products/${item.id}/variants`, item.stock.id, {'stock': 9999}).then(res => {
                console.log(res)
            }).catch(err => { console.log(err) }):""}
        </>
        ))

        })
        API.readAll(`/orders/${id}/products`).then(response => {
            setProductsEditable(response.data.products.editable);
            setCancelledProducts(response.data.products.cancelled);
        })
    }, [])

    const handleStatus = (e)=>{
        
        API.create(`/orders/${id}`, { status: e.value, _method: "PUT" }).then((res) => { 
            setOrder(res.data)
        
         })
     

    
    }

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <div className='mb-2 d-flex justify-content-between align-items-center' >
                        <div>
                            <h4>{t("Products")}</h4>
                        </div>
                        <div>
                            <button className="btn btn-secondary" onClick={() => { history.push(`/${themContext.themeLayout}/edit-order-products/${id}`); }}>{t("Edit")} {t("Products")}</button>
                        </div>
                    </div>
                    {productsEditable.length > 0 &&
                        <div className={"card mb-2"}>
                            <div className={"card-body"}>
                                <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                    <label>{t("Products")}</label>
                                </div>
                                <div>
                                    <ProductsListEditable notEditable={true} products={productsEditable} setProducts={setProductsEditable} cancelledProducts={cancelledProducts} setCancelledProducts={setCancelledProducts} />
                                </div>
                            </div>
                        </div>
                    }
                    {cancelledProducts.length > 0 &&
                        <div className={"card mb-2"}>
                            <div className={"card-body"}>
                                <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                    <label>{t("Cancelled")} {t("Products")}</label>
                                </div>
                                <div>
                                    <CancelledProducts products={cancelledProducts} setProducts={setCancelledProducts} />
                                </div>
                            </div>
                        </div>
                    }
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    {order.branch ? 
                        <div className={"card mb-2"}>
                            <div className={"card-body"}>
                                <div>
                                    <div className={"mb-3"}>
                                        <label>{t("Branch")}</label>
                                    </div>
                                    <div className={"mb-0"}>
                                        <p className={"mb-0"}>{t("name")}: {order.branch.name}</p>
                                        <p className={"mb-0"}>{t("Street")}: {order.branch.street}</p>
                                        <p className={"mb-0"}>{t("Special mark")}: {order.branch.special_mark}</p>
                                        <p className={"mb-0"}>{t("phone")}: {order.branch.phone}</p>
                                        <p className={"mb-0"}>{t("governate")}: {order.branch.governate.name}</p>
                                        <p className={"mb-0"}>{t("Latitude")}: {order.branch.latitude}</p>
                                        <p className={"mb-0"}>{t("Longitude")}: {order.branch.longitude}</p>
                                        <p className={"mb-0"}>{t("Store name")}: {order.branch.store.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div> : ""
                    }
                    <div className={"card mb-2"}>
                        <div className={"card-body"}>
                            <div>
                                <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                    <label>{t("Status")}</label>
                                </div>
                                <div className={"mb-0 d-flex justify-content-between"}>
                                    <h6>{t("Current status")}</h6>
                                    <h6>{order.status}</h6>
                                </div>
                                {order.status==="Delivered"?
                                "":
                                <FormControl style={{ zIndex: 12 }} fullWidth>
                                <Select
                                    options={status}
                                    isMulti={false}
                                    defaultValue={order.status}
                                    onChange={handleStatus}
                                    className={"col-lg-12  pl-0 pr-0"} />
                            </FormControl>
                                }
                               
                            </div>
                        </div>
                    </div>
                    <div className={"card mb-2"}>
                        <div className={"card-body"}>
                            <div>
                                <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                    <label>{t("Payment")}</label>
                                </div>
                                <div className={"mb-0 d-flex justify-content-between"}>
                                    <h6>{t("Subtotal")}</h6>
                                    <h6>{order.subtotal}</h6>
                                </div>
                                <div className={"mb-0 d-flex justify-content-between"}>
                                    <h6>{t("Shipping fee")}</h6>
                                    <h6>{order.shipping_fee}</h6>
                                </div>
                                <div className={"mb-0 d-flex justify-content-between"}>
                                    <h6>{t("tax")}</h6>
                                    <h6>{order.tax}</h6>
                                </div>
                                <hr />
                                <div className={"mb-0 d-flex justify-content-between"}>
                                    <h6>{t("Total")}</h6>
                                    <h6>{order.total}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </GridItem>
            </GridContainer>
            <ToastContainer />
        </div>
    );
}

export default EditOrder;

