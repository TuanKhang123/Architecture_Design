import React, { useEffect, useState } from 'react'
import "../productsmodifier/ProductsModifier.css"
import Modal from '../../components/modal/Modal'
import { FaPenAlt } from "react-icons/fa"
import { IoIosArrowBack, IoIosClose } from "react-icons/io"
import { GrFormAdd } from "react-icons/gr"
import { useDispatch } from 'react-redux';
import { addProducts } from '../../components/feature/products/productsSlice';
import { toast } from "react-toastify"
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderManager from '../../components/headermanager/HeaderManager'

const ProductsModifier = () => {
    const [data, setData] = useState({
        name: '',
        discount: '',
        promotion: '',
        description: ''
    });

    const location = useLocation()
    const navigate = useNavigate()
    const productdetail = location?.state?.product;
    const [productloca, setProductloca] = useState(productdetail);
    const [modalOpen, setOpenModal] = useState(-2)
    const [preview, setPreview] = useState([])
    const fileObj = []

    const { name, discount, promotion, description } = data

    const [size, setSize] = useState([])
    const [select, setSelect] = useState(2)

    const [category, setCategory] = useState([])
    const dispatch = useDispatch()

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }


    useEffect(() => {
        if (location?.state !== null) {
            localStorage.setItem('productdetail', JSON.stringify(location?.state?.product))
            setData({ name: productloca?.nameproducts, discount: productloca?.discount, promotion: productloca?.promotion, description: productloca?.description })
            setSelect(productloca?.idcate)

            productloca?.image.forEach(element => {
                preview?.push(element.avt)
                setPreview([... new Set(preview)])
            });

            setSize(productloca?.size);
        }
    }, [location?.state])

    const handleAddUnit = (e) => {
        e.preventDefault()
        setOpenModal(-1)
    }
    const changeHandler = (e) => {
        let files = e.target.files
        fileObj.push(files)
        let reader;
        for (var i = 0; i < fileObj[0].length; i++) {
            reader = new FileReader()
            reader.readAsDataURL(fileObj[0][i])
            reader.onload = event => {
                preview.push(event.target.result)
                setPreview([... new Set(preview)])
            }
        }
    }

    const HandleRemove = (index) => {
        preview.splice(index, 1)
        setPreview([... new Set(preview)]);
    }

    const updateProducts = async (productupdate) => {
        const response = await axios.post(
            "http://localhost:8000/product/updateproduct",
            productupdate,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        return response;

    };


    const handleAddProducts = async (e) => {
        e.preventDefault()

        var flag = 0;
        size.forEach(sizeitem => {
            if (sizeitem?.color?.length === 0) flag = 1;
        });
        if (flag === 1) {
            toast.error(
                '1 size must have at least 1 color',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        }
        else if (preview.length === 0) {
            toast.error(
                'Must have at least 1 photo',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        }
        else if (location.state !== null) { // Update product
            const productlocal = JSON.parse(localStorage.getItem('productdetail'));
            size.forEach((itemsize, i) => {
                itemsize.color.forEach((color, j) => {
                    if ((i < productlocal.size.length) && (j < productlocal.size[i].color.length))
                        color.idcolor = productlocal.size[i].color[j].idcolor;
                });
            });

            const productupdate = {
                selectedcategory: category.filter((value) => {
                    return value.idcate == parseInt(e.target.category.value)
                })[0].idcate,
                idproducts: location.state.product.idproducts,
                nameproducts: e.target.name.value,
                promotion: e.target.promotion.value,
                discount: e.target.discount.value,
                description: e.target.description.value,
                sizes: size.map(value => {
                    return value
                }),
                images: preview.map((value, i) => {
                    if (i < productlocal.image.length)
                        return { avt: value, idimage: productlocal.image[i].idimage }
                    else
                        return { avt: value, idimage: '' }
                }),
            }
            const response = await updateProducts(productupdate)
            toast.success(
                response.data.message,
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
            navigate('/admin/productlist');
        }
        else { // create product
            const product = {
                selectedcategory: category.filter((value) => {
                    return value.idcate === parseInt(e.target.category.value)
                })[0].idcate,
                nameproducts: e.target.name.value,
                promotion: e.target.promotion.value,
                discount: e.target.discount.value,
                description: e.target.description.value,
                sizes: size.map(value => {
                    return value
                }),
                images: preview,
            }
            dispatch(addProducts({ product: product })).then(() => {
                toast.success(
                    'Add Products Is Succesfull',
                    {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                    }
                );
                navigate('/admin/productlist');
            })

        }
    }

    useEffect(() => {
        axios.get("http://localhost:8000/product/getcategory")
            .then(res => {
                setCategory(res.data)
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <>
            <HeaderManager />
            <div className='container-modify'>
                <div>
                    <h1 className='container-modify__title'>
                        Products Modifier
                        <a className='container-modify__title-back' onClick={() => navigate("/admin/productlist")}>
                            <IoIosArrowBack className='title__icon' />
                            <p>Back</p>
                        </a>
                    </h1>
                </div>

                <div className='product-modifier'>
                    <form className='form' onSubmit={handleAddProducts}>
                        <div className='product-modifier__info'>
                            <div className='row-one'>
                                <input className='products-name' type='text' name='name' placeholder='Products Name' value={name} onChange={handleOnChange} required />
                                <input className='discount' name='discount' placeholder='Discount' value={discount} onChange={handleOnChange} required />
                            </div>
                            <div className='row-two'>
                                <input className='promotion' type='text' name='promotion' placeholder='Promotion' value={promotion} onChange={handleOnChange} required />
                            </div>
                            <textarea style={{ resize: 'none' }} type='text' name='description' placeholder='Products Description' value={description} onChange={handleOnChange} required />
                            <h2>Category</h2>
                            <select name="category" value={select} onChange={(e) => setSelect(e.target.value)}>
                                {
                                    category ? category.map((value) => (
                                        <option key={value.idcate} value={value.idcate} name={value.namecate}>
                                            {
                                                value.namecate
                                            }
                                        </option>
                                    )) : null
                                }
                            </select>
                            <h2>Unit</h2>
                            <div className='container-unit'>
                                {
                                    size.length !== 0 ?
                                        <div className='unit-title'>
                                            <p className='unit-title-com'>Name Size</p>
                                            <p className='unit-title-com '>Price Size</p>
                                            <p className='unit-title-com'>Name Color</p>
                                            <p className='unit-title-com'>Quantity</p>
                                            <p className='unit-title-com'>Action</p>
                                        </div>

                                        : null
                                }

                                {
                                    size ? size.map((value, index) => (

                                        <div key={index} className='sizes'>

                                            <p>{value.namesize}</p>
                                            <p>{value.pricesize.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                                            <div className='container-unit__namecolor'>
                                                {
                                                    value.color.map((color, index) => (

                                                        <div key={index} className='container-unit__namecolor-item'>
                                                            <p >{color.namecolor}</p>
                                                        </div>

                                                    ))
                                                }
                                            </div>
                                            <div>
                                                {
                                                    value.color.map((color, index) => (
                                                        <div key={index + 1}>
                                                            <p className='quantity'>{color.quantity}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            <div>
                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    setOpenModal(index)
                                                }}>
                                                    <FaPenAlt />
                                                </button>
                                            </div>
                                        </div>
                                    )) : null
                                }
                            </div>
                            <div>
                                <button className='add-size' onClick={handleAddUnit}>Add Unit</button>
                            </div>
                        </div>
                        <div className='rl'>
                            <label htmlFor="firstimage">
                                <GrFormAdd className='icon-image' />
                            </label>

                            <input id='firstimage' type="file" name='file' multiple onChange={changeHandler} style={{ display: 'none', visibility: 'none' }} />
                            <div className='rl-container'>
                                {
                                    (preview || []).map((url, index) => (
                                        <div className='rl-container-item' key={index}>
                                            <img src={url} key={index} alt="" className='rl-container-img' />
                                            <IoIosClose onClick={() => HandleRemove(index)} key={index + 1} className='rl-container-close' />
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='format'>
                                <button className='save'>SAVE</button>
                            </div>
                        </div>
                    </form >
                </div >
                {
                    modalOpen >= -1 &&
                    <Modal size={size[modalOpen]}
                        setOpenModal={() => setOpenModal(-2)}
                        onSubmit={(data) => setSize((prev) => {
                            if (modalOpen === -1) {
                                return [...prev, data]
                            }
                            prev[modalOpen] = data
                            return [...prev]
                        })}
                    />
                }
            </div>
        </>

    )
}

export default ProductsModifier