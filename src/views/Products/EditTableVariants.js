import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../API';
import { useTranslation } from 'react-i18next';
var _ = require('lodash');

function TableVariants({ tableVariants,setTableVariants }) {
    const { t } = useTranslation();
    const {id} =useParams();
    const [isEditVariant, setIsEditVariant] = useState(false);
    const [editVariant, setEditVariant] = useState({});

    const handleEditVariant = (variantId) => {
        if (isEditVariant === variantId) {
            API.update(`/products/${id}/variants`,  variantId,editVariant).then(res => {
                setTableVariants(res.data.stocks);
                setIsEditVariant(false);
                setEditVariant({});
            }).catch(err => { console.log(err) });
        } else {
            setIsEditVariant(variantId);
        }
    }

    const handleChange = (e, variantId) => {
        setEditVariant({ ...editVariant, 'stock': 9999 ,...{ [e.target.name]: e.target.value } });
    }

    return (
        <>
            {tableVariants.length > 0 &&
                <div class="card-body text-muted row justify-content-center VariantsContainer" id="AttributesContainer23">
                    <div style={{ overflow: "auto", boxShadow: '0px 0px 2px 0px', borderRadius: '10px', padding: '15px' }} class="col-lg-12">
                        <table class="table">
                            <thead>
                                <tr className='mx-5'>
                                    <th>{t("Variants")}</th>
                                    <th>{t("Pharmacy price")}</th>
                                    <th>{t("Pharmacy price after sale")}</th>
                                    <th>{t("Store price")}</th>
                                    <th>{t("Store price after sale")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableVariants.map((item, index) => {
                                    return (<>
                                        <tr key={index}>
                                            <th>
                                                <div>
                                                    {item.options.map((variant, i) => {
                                                        return (
                                                          
                                                            <span>{variant.value}                         {
                                                                item.options.length - 1 !== i &&
                                                                <Fragment> / {" "}</Fragment>
                                                            }   </span>
                                                        )
                                                    })}
                                                </div>
                                            </th>
                                            <th>
                                                {isEditVariant === item.id ? (<input type={`number`} defaultValue={item.pharmacy_price} className="form-control" name={'pharmacy_price'} onChange={(e) => handleChange(e, item.id)} />) : item.pharmacy_price}
                                            </th>
                                            <th>
                                                {isEditVariant === item.id ? (<input type={`number`} defaultValue={item.pharmacy_price_after_sale} className="form-control" name={'pharmacy_price_after_sale'} onChange={(e) => handleChange(e, item.id)} />) : item.pharmacy_price_after_sale}
                                            </th>
                                            <th>
                                                {isEditVariant === item.id ? (<input type={`number`} defaultValue={item.store_price} className="form-control" name={'store_price'} onChange={(e) => handleChange(e, item.id)} />) : item.store_price}
                                            </th>
                                            <th>
                                                {isEditVariant === item.id ? (<input type={`number`} defaultValue={item.store_price_after_sale} className="form-control" name={'store_price_after_sale'} onChange={(e) => handleChange(e, item.id)} />) : item.store_price_after_sale}
                                            </th>
                                            
                                            <th>
                                                {isEditVariant === item.id ?
                                                    (
                                                        <a className='mb-2' style={{ color: 'green' }} onClick={() => handleEditVariant(item.id)}>{t("Save")}</a>
                                                    ) : (
                                                        <a className=' mb-2' style={{ color: 'blue' }} onClick={() => handleEditVariant(item.id)}>{t("Edit")}</a>
                                                    )}
                                            </th>
                                        </tr>
                                    </>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
    );
}

export default TableVariants;


