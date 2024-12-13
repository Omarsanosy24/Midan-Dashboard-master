import React, { useState, useEffect,useContext } from 'react';
import API from '../../../API';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from 'react-i18next';
import ThemeContext from "../../../layouts/theme-setting/SettingContext";

function ProductListSelect({ setProductsNew, count, cancelledProducts, setCancelledProducts }) {
    const { t } = useTranslation();
    const themContext = useContext(ThemeContext);
    const { register: register1, handleSubmit: handleSubmit1 } = useForm();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = React.useState(false);
    const [productsAdded, setProductsAdded] = useState([]);

    useEffect(() => {
      
        API.readAll(`/products?page=${1}&include=stocks,stock_types&filter[name]=${search}`).then(response => {
            setData(response.data);
            if (response.meta.last_page > 1) {
                setPage(2);
                setHasMore(true)
            } else {
                setPage(1);
            }
        })
    }, [search, count]);

    const loadFunc = async () => {
        setHasMore(false);
        API.readAll(`/products?page=${page}&include=stocks,stock_types&filter[name]=${search}`).then(response => {
            setData([...data, ...response.data])
            if (response.meta.last_page > page) {
                setHasMore(true)
                setPage(page + 1)
            }
        })
    }

    const onSubmit = (data) => {
        setSearch(data.search);
    }

    const handleSelectProduct = (e, variantProduct, parentProduct) => {
        cancelledProducts.map((item,index)=>{
            if(item.id===parentProduct.id){
                const arr = cancelledProducts.splice(index,1);
                setCancelledProducts(arr);
            }
        })
        if (e.target.checked) {
            if (variantProduct.stock > (parentProduct.stock_type ? parentProduct.stock_type.quantity : parentProduct.stock_types[0].quantity)) {
                const images = (parentProduct.images);
                setProductsAdded([...productsAdded, { ...variantProduct, ...{ name: parentProduct.name, quantity: 1, images: images, stock: variantProduct, stock_type: (parentProduct.stock_type ? parentProduct.stock_type : parentProduct.stock_types[0]) } }])
            } else {
                document.getElementById(`variant-${variantProduct.id}`).checked = false;
                toast.error('Out of stock', {
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
        } else {
            setProductsAdded(productsAdded.filter(product => variantProduct.id !== product.id));
        }
    }

    const handleAdd = () => {
        setProductsNew(productsAdded);
        document.getElementById('closeModal').click();
        setProductsAdded([]);
        var checkboxes = document.getElementsByName('checkbox');
        for (var checkbox of checkboxes) {
            checkbox.checked = false;
        }
    }

    const handleChangeStockType = (e, product, variant) => {
        document.getElementById(`variant-${variant.id}`).checked = false;
        setProductsAdded(productsAdded.filter(product => variant.id !== product.id));
        const objIndex = data.findIndex(obj => obj.id === product.id);
        const updatedObj = { ...data[objIndex], ...{ stock_type: JSON.parse(e.target.value) } };
        const updatedProducts = [
            ...data.slice(0, objIndex),
            updatedObj,
            ...data.slice(objIndex + 1),
        ];
        setData(updatedProducts)
    }
    
    return (
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog  modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{t("Add Product")}</h5>
                        <button type="button" className="close m-0" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-header">
                        <div style={{ width: '100%' }}>
                            <form onSubmit={handleSubmit1(onSubmit)} >
                                <h5 class="modal-title">{t("Search")}</h5>
                                <div className='d-flex'>
                                    <div style={{ width: '100%' }}>
                                        <input
                                            {...register1("search")}
                                            type={`text`}
                                            placeholder={t("Search for product")}
                                            class="form-control col-lg-12" />
                                    </div>
                                    <button type="submit" style={{ border: '1px solid #b3b3b3' }} className='btn btn-light mx-2'>{t("Search")}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-body" id="scrollableDiv">
                        <div>
                            <InfiniteScroll
                                dataLength={data.length}
                                next={loadFunc}
                                hasMore={hasMore}
                                loader={<h4>Loading...</h4>}
                                scrollableTarget="scrollableDiv"
                            >
                                {data.map((item, index) => (
                                    <div key={item.id} className='p-0'>
                                        <div class="accordion" id={`accordion-${item.id}`}>
                                            <div class="card mb-2" style={{ borderRadius: "5px" }}>
                                                <div class="card-header" id={`heading-${item.id}`}>
                                                    <h2 class="m-0">
                                                        <button class="btn btn-block text-left collapsed p-0 m-0" type="button" data-toggle="collapse" data-target={`#collapse-${item.id}`} aria-expanded="false" aria-controls={`collapse-${item.id}`}>
                                                            <div className={'d-flex align-items-center'}>
                                                                <div>
                                                                    <img style={{ width: 40, height: 40 }} src={item.images[0].url} />
                                                                </div>
                                                                <div className='px-3'>
                                                                    <h6 className='mt-0 mb-0'>{themContext.themeLayout=== "admin" ? item.name: item.ar_name}</h6>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id={`collapse-${item.id}`} class="collapse" aria-labelledby={`heading-${item.id}`} data-parent={`#accordion-${item.id}`}>
                                                    <div class="card-body pt-2 pl-0 pr-0">
                                                        {item.stocks.map(variant => {
                                                            return (
                                                                <div className='container'>
                                                                    <label key={variant.id} className="input-group pl-2" for={`variant-${variant.id}`} style={{ cursor: 'pointer' }}>
                                                                        <input type="checkbox" name={'checkbox'} id={`variant-${variant.id}`} aria-label="Checkbox for following text input" onChange={(e) => handleSelectProduct(e, variant, item)} />
                                                                        <div className='d-md-flex justify-content-between mx-2' style={{ width: "90%" }}>
                                                                            <div className='d-flex mb-1 mt-1'>
                                                                                {variant.options.map((item, index) => {
                                                                                    if (item.type === "colorpicker") {
                                                                                        return (
                                                                                            <div className='d-flex align-items-center'>
                                                                                                <div className='mr-1' style={{ width: '16px', height: '16px', backgroundColor: item.value }} />
                                                                                                <span>{" "}{item.value2}{(variant.options.length - 1 !== index) && <>{" / "}</>}</span>
                                                                                            </div>
                                                                                        )
                                                                                    } else {
                                                                                        return (
                                                                                            <div className='d-flex align-items-center'>
                                                                                                <span>{" "}{item.value}{variant.options.length - 1 !== index && <>{" / "}</>}</span>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                })}
                                                                            </div>
                                                                            <div>
                                                                                <h6>{t("Price")}: {variant.store_price_after_sale}</h6>
                                                                                <h6>{t("Stock")}: {variant.stock}</h6>
                                                                            </div>
                                                                            <div className='d-flex w0'>
                                                                                <label>{t("Stock Type")}:</label>
                                                                                <select className="form-control mx-1" onChange={(e) => handleChangeStockType(e, item, variant)}>
                                                                                    {item.stock_types.map((stock) => {
                                                                                        return (
                                                                                            <option value={JSON.stringify(stock)}>{stock.name}</option>
                                                                                        )
                                                                                    })}
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                    </label>
                                                                    <div className='d-flex justify-content-center'>
                                                                        <hr style={{ width: "90%" }} />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </InfiniteScroll>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-between">
                        <div>
                            <span>{productsAdded.length} {t("products selected")}</span>
                        </div>
                        <div>
                            <button type="button" class="btn btn-secondary" id={"closeModal"} data-dismiss="modal">{t("Close")}</button>
                            <button type="button" class="btn btn-primary mx-2" disabled={productsAdded.length > 0 ? false : true} onClick={handleAdd}>{t("Add")}</button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default ProductListSelect;