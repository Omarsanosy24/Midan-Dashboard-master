import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function ProductsListNew({ products, setProductsNew }) {
    const { t } = useTranslation();

    const handleRemoveProduct = (item) => {
        setProductsNew(products.filter(product => item.id !== product.id));
    }

    const handleUpdateQuantity = (quantity, product) => {
        const objIndex = products.findIndex(obj => obj.id === product.id);
        if (product.stock.stock >= (product.stock_type.quantity * parseInt(quantity)) ) {
            const updatedObj = { ...products[objIndex], ...{ quantity: parseInt(quantity) } };
            const updatedProducts = [
                ...products.slice(0, objIndex),
                updatedObj,
                ...products.slice(objIndex + 1),
            ];
            setProductsNew(updatedProducts)
        } else {
            toast.error(`Out of stock, Available: ${product.stock.stock}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }


    const handleApplyDiscount = (discount, product) => {
        const objIndex = products.findIndex(obj => obj.id === product.id);
        if (discount.length > 0) {
            const updatedObj = {
                ...products[objIndex], ...{
                    applied_discount: {
                        value_type: "fixed",
                        value: parseInt(discount),
                        description: ""
                    }
                }
            };
            const updatedProducts = [
                ...products.slice(0, objIndex),
                updatedObj,
                ...products.slice(objIndex + 1),
            ];
            setProductsNew(updatedProducts)
        } else {
            const updatedObj = {
                ...products[objIndex], ...{
                    applied_discount: {
                        value_type: "fixed",
                        value: 0,
                        description: ""
                    }
                }
            };
            const updatedProducts = [
                ...products.slice(0, objIndex),
                updatedObj,
                ...products.slice(objIndex + 1),
            ];
            setProductsNew(updatedProducts)
        }
    }
    return (
        <div>
            {products.map((product, index) => {
                return (
                    <div key={index}>
                        <div className='d-flex'>
                            <div className='mr-3'>
                                <img style={{ width: 65 }} src={product.images[0].url} />
                            </div>
                            <div className='w-100' id="accordion">
                                <div className='d-flex justify-content-between'>
                                    <p className='font-weight-bold mt-0 mb-0'>{product.name}</p>
                                    <p className='mt-0 mb-0'>{product.quantity*(product.stock_type.quantity * product.store_price_after_sale - (product.applied_discount ? product.applied_discount.value : 0))}</p>
                                </div>
                                <div className='d-flex'>
                                
                                    <p className='font-weight-normal mr-1 mb-0'>{product.quantity}x{"("}{product.stock_type.quantity}{" x "}{(product.store_price_after_sale)}{")"}</p>
                                </div>
                                {product.applied_discount && product.applied_discount.value > 0 &&
                                    <div>
                                        <p className='text-danger font-weight-normal mb-1'>-{product.applied_discount.value}</p>
                                    </div>
                                }
                                <div className='d-flex'>
                                    <p data-toggle="collapse" href={`#collapseQuantity-${product.id}`} aria-expanded="false" aria-controls="collapseQuantity" style={{ cursor: 'pointer', textDecoration: 'underline', color: '#5369f8' }} className='mb-3 font-weight-normal mr-3'>{t("Adjust quantity")}</p>
                                    <p style={{ cursor: 'pointer', textDecoration: 'underline', color: '#5369f8' }} className='mb-3 font-weight-normal mr-3' onClick={() => handleRemoveProduct(product)}>{t("Remove item")}</p>
                                    <p data-toggle="collapse" href={`#collapseDiscount-${product.id}`} aria-expanded="false" aria-controls="collapseQuantity" style={{ cursor: 'pointer', textDecoration: 'underline', color: '#5369f8' }} className='mb-3 font-weight-normal mr-3' >{t("Apply discount")}</p>
                                </div>
                                <div class="collapse" id={`collapseQuantity-${product.id}`} data-parent="#accordion">
                                    <h5 class="modal-title">{t("Update quantity")}</h5>
                                    <div className='d-flex mb-2'>
                                        <div style={{ width: '100%' }}>
                                            <input
                                                id={`input-${product.id}`}
                                                type={`number`}
                                                defaultValue={1}
                                                class="form-control col-lg-12" />
                                        </div>
                                        <button onClick={() => { handleUpdateQuantity(document.getElementById(`input-${product.id}`).value, product) }} data-toggle="collapse" href={`#collapseQuantity-${product.id}`} aria-expanded="false" aria-controls="collapseQuantity" type="button" style={{ border: '1px solid #b3b3b3' }} className=' btn btn-light ml-2'>{t("Done")}</button>
                                    </div>
                                </div>
                                <div class="collapse" id={`collapseDiscount-${product.id}`} data-parent="#accordion">
                                    <h5 class="modal-title">{t("Apply discount")}</h5>
                                    <div className='d-flex mb-2'>
                                        <div style={{ width: '100%' }}>
                                            <input
                                                id={`discount-${product.id}`}
                                                type={`number`}
                                                defaultValue={1}
                                                class="form-control col-lg-12" />
                                        </div>
                                        <button onClick={() => { handleApplyDiscount(document.getElementById(`discount-${product.id}`).value, product) }} data-toggle="collapse" href={`#collapseDiscount-${product.id}`} aria-expanded="false" aria-controls="collapseQuantity" type="button" style={{ border: '1px solid #b3b3b3' }} className=' btn btn-light ml-2'>{t("Done")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            products.length - 1 !== index &&
                            <hr className='mt-0' />
                        }
                    </div>
                )
            })}
            <ToastContainer />

        </div >
    );

}

export default ProductsListNew;