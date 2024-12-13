import React from 'react';
import { useTranslation } from 'react-i18next';

function CancelledProducts({ products }) {
    const { t } = useTranslation();

    return (
        <div>
            {products.map((product, index) => {
                return (
                    <div>
                        <div className='d-flex' style={{ opacity: 0.8 }}>
                            <div className='mr-3'>
                                <img style={{ width: 45 }} src={product.images[0].url} />
                            </div>
                            <div className='w-100' id="accordion">
                                <div className='d-flex justify-content-between'>
                                    <p className='font-weight-bold mt-0 mb-0'>{product.name}</p>
                                    <p className='mt-0 mb-0'>{t("Cancelled")}</p>
                                </div>
                                <div className='d-flex'>
                                    <p className='mb-3 font-weight-normal mr-1 mb-0'>{product.stock_type.quantity}{" x "}{(product.price)}</p>
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
        </div >
    );

}

export default CancelledProducts;