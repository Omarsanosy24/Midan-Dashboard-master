import React, { useState, useEffect, useRef } from 'react';
import API from '../../API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductListModal from './common/ProductListModal';
import ProductsListNew from './common/ProductsListNew';
import ProductsListEditable from './common/ProductsListEditable';
import CancelledProducts from './common/CancelledProducts';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function EditOrderPrducts() {
    const { t } = useTranslation();
    const { id } = useParams();
    const mounted = useRef(true);
    const toastId = useRef("1234");
    const [productsNew, setProductsNew] = useState([]);
    const [productsEditable, setProductsEditable] = useState([]);
    const [shippedProducts, setShippedProducts] = useState([]);
    const [cancelledProducts, setCancelledProducts] = useState([]);
    const [oldPayment, setOldPayment] = useState([]);
    const [newPayment, setNewPayment] = useState({});
    const [loader, setLoader] = useState(true);
    const [count, setCount] = useState(1);
    const [oldProductsEditable, setOldProductsEditable] = useState([]);
    const [oldShippedProducts, setOldShippedProducts] = useState([])

    useEffect(() => {
        API.readAll(`/orders/${id}/products`).then(response => {
            setOldPayment(response.data.payment);

            setShippedProducts(response.data.products.shipped);
            setOldShippedProducts(response.data.products.shipped);

            setProductsEditable(response.data.products.editable);
            setOldProductsEditable(response.data.products.editable);

            setCancelledProducts(response.data.products.cancelled);
        })
    }, [])

    useEffect(() => {
        setLoader(true);
        if (!mounted.current) {
            const temp = [...oldProductsEditable];
            const arrProducts = [...oldShippedProducts, ...temp];
            const Arr = [];
            arrProducts.map(product => {
                Arr.push({
                    quantity: product.quantity,
                    applied_discount: product.applied_discount ? product.applied_discount : null,
                    stock_id: product.stock.id,
                    stock_type_id: product.stock_type.id,
                })
            })
            API.create(`/orders/${id}/products/calculate`, { products: Arr }).then(response => {
                setNewPayment(response.data);
                setLoader(false);
            })
        }
        mounted.current = false;
    }, [oldProductsEditable, oldShippedProducts])

    const handleSaveChange = () => {
        const temp = [...productsNew, ...productsEditable];
        const arrProducts = [...shippedProducts, ...temp];
        const Arr = [];
        arrProducts.map(product => {
            Arr.push({
                id: product.id,
                quantity: product.quantity,
                applied_discount: product.applied_discount ? product.applied_discount : null,
                stock_id: product.stock.id,
                stock_type_id: product.stock_type.id,
            })
        })
        API.create(`/orders/${id}/products`, { products: Arr }).then(response => {
            setProductsNew([]);
            setCount(count + 1);
            setOldPayment(response.data.payment);
            setShippedProducts(response.data.products.shipped);
            setProductsEditable(response.data.products.editable);
            setCancelledProducts(response.data.products.cancelled);
            toast.success("Order updated", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoader(true);
                if (!mounted.current) {
                    const temp = [...productsNew, ...productsEditable];
                    const arrProducts = [...shippedProducts, ...temp];
                    const Arr = [];
                    arrProducts.map(product => {
                        Arr.push({
                            quantity: product.quantity,
                            applied_discount: product.applied_discount ? product.applied_discount : null,
                            stock_id: product.stock.id,
                            stock_type_id: product.stock_type.id,
                        })
                    })
                    API.create(`/orders/${id}/products/calculate`, { products: Arr }).then(response => {
                        setNewPayment(response.data);
                        setLoader(false);
                    })
                }
                mounted.current = false;
        })
            .catch(() => {
                toast.update(toastId.current, {
                    render: "Your message...",
                    type: "error",
                    isLoading: "false"
                })
            })
    }

    return (
        <div className={"d-md-flex justify-content-center"}>
            <div className='col-md-8 px-0 px-md-2'>
                <div className={"card mb-2"}>
                    <div className={"card-body"}>
                        <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                            <label>{t("Add Product")}</label>
                        </div>
                        <div className={"mb-0 d-flex"}  >
                            <div style={{ width: '100%' }}>
                                <input
                                    data-toggle="modal" data-target="#addProductModal"
                                    type={`text`}
                                    placeholder={t("Search for product")}
                                    class="form-control col-lg-12" />
                            </div>
                            <button type="button" data-toggle="modal" data-target="#addProductModal" style={{ border: '1px solid #b3b3b3' }} className='btn btn-light mx-2'>{t("Browse")}</button>
                        </div>
                        <div>
                            <ProductListModal count={count} setProductsNew={setProductsNew} setCancelledProducts={setCancelledProducts} cancelledProducts={cancelledProducts}/>
                            {productsNew.length > 0 &&
                                <div>
                                    <hr />
                                    <ProductsListNew products={productsNew} setProductsNew={setProductsNew} />
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {productsEditable.length > 0 &&
                    <div className={"card mb-2"}>
                        <div className={"card-body"}>
                            <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                <label>{t("Products")}</label>
                            </div>
                            <div>
                                <ProductsListEditable products={productsEditable} setProducts={setProductsEditable} cancelledProducts={cancelledProducts} setCancelledProducts={setCancelledProducts} />
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

                <div className={"card mb-2"}>
                    <div className={"card-body"}>
                        <div>
                            <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                <label>{t("Payment")}</label>
                            </div>
                            <div className={"mb-0 d-flex justify-content-between"}>
                                <h6>{t("Subtotal")}</h6>
                                <h6>{oldPayment.subtotal}</h6>
                            </div>
                            <div className={"mb-0 d-flex justify-content-between"}>
                                <h6>{t("Total")}</h6>
                                <h6>{oldPayment.total}</h6>
                            </div>
                            <hr />
                            <div className={"mb-0 d-flex justify-content-between"}>
                                <h6>{t("Paid by customer")}</h6>
                                <h6>{oldPayment.paid}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-4 p-0'>
                <div className={"card mb-2"}>
                    <div className={"card-body"}>
                        <div>
                            <div className={"mb-3 d-flex align-items-center justify-content-between"}>
                                <label>{t("Summary")}</label>
                            </div>
                            <div className={"mb-0 d-flex justify-content-between"}>
                                <h6>{t("Updated total")}</h6>
                                <h6>{newPayment.total}</h6>
                            </div>
                            <div className={"mb-0 d-flex justify-content-between"}>
                                <h6>{t("Paid by customer")}</h6>
                                <h6>{newPayment.already_paid}</h6>
                            </div>
                            <hr />
                            <div className={"mb-0 d-flex justify-content-between"}>
                                <h6>{t('Amount to collect')}</h6>
                                <h6>{newPayment.amount_to_collected}</h6>
                            </div>
                            <hr />
                            <div className={"mb-0 d-flex align-items-center justify-content-center"}>
                                <button style={{ width: "100%" }} className="btn btn-success" onClick={() => handleSaveChange()}>{t("Save the change")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EditOrderPrducts;

