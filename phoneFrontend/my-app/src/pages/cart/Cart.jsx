import React, { useEffect } from 'react'
import '../cart/Cart.css'
import { GrFormClose } from "react-icons/gr";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import Templatecart from '../../components/templatecart/Templatecart';
import Header from '../../../src/components/header/Header'
import Totalcart from '../../components/totalcart/Totalcart';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseItemQuantity, decreaseQuantity, deleteCart, getCart, increaseItemQuantity, increaseQuantity } from '../../components/feature/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"


const Cart = () => {
    const { cart } = useSelector(state => state.cart)
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handle_order = () => {
        navigate("/orderinfo")
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <Header></Header>
            <Templatecart text__my='My Cart' text__btn='PROCEED TO ORDER' text_back='/'>
                <div className="product">
                    {
                        cart ? cart.map((value, index) => (

                            <div className='product__item' key={index}>
                                <img src={value ? value?.image[0]?.avt : ''} alt="" className='item__img' />
                                <div className='item__info'>
                                    <a className='info__name-pro'>{value?.nameproducts}<span>{value?.size[0]?.namesize}({value?.size[0]?.color[0]?.namecolor})</span></a>
                                    <div className='info__line-2'>
                                        <p className='info__sale-price'>{(value?.size[0]?.pricesize - ((value?.size[0]?.pricesize * value?.discount) / 100)).toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                                        <div className='change-quantity'>
                                            <button onClick={() => {
                                                if (value?.quantity > 1) {
                                                    dispatch(decreaseItemQuantity(value?.size[0]?.color[0]?.idcolor))
                                                    dispatch(decreaseQuantity({ idsize: value?.size[0]?.idsize, idcolor: value?.size[0]?.color[0]?.idcolor, accessToken }))
                                                }
                                            }} className='contain-minus'>
                                                <AiOutlineMinus className='minus' />
                                            </button>
                                            <input type="text" name='quantity' min="1" value={value?.quantity} onChange={() => null} />
                                            <button onClick={() => {
                                                if (value?.quantity < value?.maxquantity) {
                                                    dispatch(increaseItemQuantity(value.size[0]?.color[0]?.idcolor))
                                                    dispatch(increaseQuantity({ idsize: value?.size[0]?.idsize, idcolor: value?.size[0]?.color[0]?.idcolor, accessToken }))
                                                }
                                                else {
                                                    toast.info(
                                                        'You can only buy the maximum current quantity',
                                                        {
                                                            position: 'top-right',
                                                            autoClose: 3000,
                                                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                                                        }
                                                    );
                                                }
                                            }} className='contain-plus'>
                                                <AiOutlinePlus className='plus' />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='info__line-3'>
                                        <p className='info__sale-regular'>{(value?.size[0]?.pricesize).toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                                        <p className='sales'> {value?.discount}%</p>
                                    </div>
                                    <GrFormClose className='info__icon' onClick={() => {
                                        dispatch(deleteCart({ idsize: value?.size[0]?.idsize, idcolor: value?.size[0]?.color[0]?.idcolor, accessToken }))
                                            .then(() => {
                                                dispatch(getCart({ accessToken })).then(() => {
                                                    toast.success(
                                                        'Delete successfully',
                                                        {
                                                            position: 'top-right',
                                                            autoClose: 3000,
                                                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                                                        }
                                                    );
                                                })
                                            })
                                    }} />
                                </div>
                            </div>

                        ))
                            : null
                    }
                </div>
            </Templatecart >
            <Totalcart
                text__btn='PROCEED TO ORDER'
                handle__checkout={handle_order}
                styleCart="handle_unique"
            />
        </>
    )
}

export default Cart
