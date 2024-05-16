import React, { useEffect, useState } from 'react'
import "./ProductList.css"
import { BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../components/feature/products/productsSlice';
import { BiTrash } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import HeaderManager from '../../components/headermanager/HeaderManager';
import Modelcancel from '../../components/modelcancel/Modelcancel';
import { toast } from "react-toastify"
import axios from 'axios';

const ProductList = () => {
    const navigate = useNavigate()
    const products = useSelector((state) => state.products);
    const [modallist, setModalList] = useState(-1)
    const [inputSearch, setInputSearch] = useState('')
    const [prodelete, setProDelete] = useState([])

    var profilter = [];

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getProducts())
    }, [])

    const toggleModal = (data, number) => {
        setProDelete(data)
        setModalList(number)
    }

    const Createproduct = () => {
        navigate("/admin/productsmodifier")
    }

    const removeProduct = async (idproducts) => {
        const response = await axios.post("http://localhost:8000/product/removeproduct",
            { idproducts },
            {
                headers: {

                    "Content-Type": "application/json",
                },
            })
            .then((result) => {
                toast(result.data.message)
                dispatch(getProducts())
            })
            .catch((error) => {
                toast(error)
            })
    }

    const handleYes = (prochoose) => {
        removeProduct(prochoose.idproducts)
        setModalList(-1)
    }

    const handleNo = () => {
        setModalList(-1)
    }

    return (
        <>
            <HeaderManager />
            <div className='productlist'>

                <h1 className='productlist__title'>PRODUCTS LIST</h1>

                <div className='productlist__search'>
                    <input title='search' type="text" className='productlist__search-input' placeholder='Search here .....' onChange={e => setInputSearch(e.target.value)} />
                    <button onClick={() => { Createproduct() }} className='productlist__search-btn'>CREATE</button>
                </div>


                <div className='productlist__detail-title'>
                    <p className='productlist__detail-title-com'>ID</p>
                    <p className='productlist__detail-title-com'>Name Product</p>
                    <p className='productlist__detail-title-com'>Discount</p>
                    <p className='productlist__detail-title-com'>Name Size</p>
                    <p className='productlist__detail-title-com '>Price Size</p>
                    <p className='productlist__detail-title-com'>Name Color</p>
                    <p className='productlist__detail-title-com'>Quantity</p>
                    <p className='productlist__detail-title-com'>Action</p>
                </div>

                <div className='productlist__detail'>
                    {
                        products.data ? profilter = products.data
                            .filter((product) => {
                                if (inputSearch === '')
                                    return product;
                                else if (product.nameproducts.toLowerCase().includes(inputSearch.toLowerCase()))
                                    return product;
                            })
                            .map((data, i) => (
                                <>
                                    <div className='productlist__detail-product' key={i}>
                                        <div className='productlist__detail-product-common'>{data.idproducts}</div>

                                        <div className='productlist__detail-product-common'>{data.nameproducts}</div>
                                        <div className='productlist__detail-product-common'>{data.discount}</div>
                                        <div>
                                            {
                                                data.size ? data.size.map((size, j) => (
                                                    <div className='productlist__detail-product-size' key={j}>
                                                        <p className='productlist__detail-title-common'>{size.namesize}</p>
                                                        <p className='productlist__detail-title-common productlist__detail-title-price'>{size.pricesize.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>

                                                        <div className='productlist__detail-title-namecolor'>
                                                            {
                                                                size.color ? size.color.map((color, k) => (
                                                                    <p key={k} className='productlist__detail-title-common'>{color.namecolor}</p>
                                                                )) : null
                                                            }
                                                        </div>

                                                        <div className='productlist__detail-title-quantity'>
                                                            {
                                                                size.color ? size.color.map((color, k) => (
                                                                    color.quantity > 0
                                                                        ? <p key={k} className='productlist__detail-title-common'>{color.quantity}</p>
                                                                        : <p key={k} className='productlist__detail-title-common'>Out off stock</p>
                                                                )) : null
                                                            }
                                                        </div>
                                                    </div>
                                                )) : null

                                            }
                                        </div>
                                        <div key={i}>
                                            <Link to="/admin/productsmodifier" state={{ product: data, message: "update" }}>
                                                <BsPencil className='productlist__detail-product-common-icon productlist__detail-product-common-pen' />
                                            </Link>
                                            <BiTrash className='productlist__detail-product-common-icon productlist__detail-product-common-trash' onClick={() => toggleModal(data, i)} />
                                        </div>
                                    </div>
                                </>
                            ))
                            : null
                    }

                    {modallist !== -1 ? <Modelcancel parentCallbackNo={handleNo} parentCallbackYes={handleYes} dataFromParent={prodelete} text = 'Do you want to delete this product?'/> : null}

                    {
                        profilter.length === 0
                            ?
                            <div className='product-list-container'>

                                <img src="https://media.itsnicethat.com/original_images/giphy-2021-gifs-and-clips-animation-itsnicethat-02.gif" alt="" className='product-list-container__image' />

                                <h1 className='product-list-container__empty'>NO PRODUCT FOUND</h1>
                            </div>
                            : null
                    }
                </div>
            </div>
        </>
    )
}


export default ProductList