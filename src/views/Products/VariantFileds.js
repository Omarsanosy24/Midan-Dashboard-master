import React from 'react';
import Button from "../../components/CustomButtons/Button.js";
import { useTranslation } from 'react-i18next';

function Variants({index, variant, editable, setOpen, handleIncreaseInput,handleDeleteVariant }) {
    const { t } = useTranslation();

    return (
        <>
            <div key={index} className='col-md-4 mb-2'>
                <div className="card" style={{ borderRadius: '10px', width: "100%", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>
                    {editable &&
                        <div className='card-header d-flex justify-content-between'>
                            <Button type={'button'} onClick={() => {  handleIncreaseInput(variant.values.length); setOpen({ data: variant, open: true }); }}>{t("Edit")}</Button>
                            <Button type={'button'} onClick={() => { console.log(variant.key);  handleDeleteVariant(variant.key); }}>{t("Delete")}</Button>
                        </div>
                    }
                    <div class="card-body">
                        <label>{t('Variant Name')} :</label>
                        <h5 class="card-title">{variant.key}</h5>
                        <hr style={{ width: '100%' }} />
                        <label>{t('Variant Values')} :</label>
                        {variant.values!==undefined?
                        <>{variant.values.map((item) => {
                            return (
                                <h6>{item}</h6>
                            )
                        })}</>:""}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Variants;


