import React, { useEffect } from 'react'
import "../detailbill/Detailbill.css"
import Templatecart from '../../components/templatecart/Templatecart';
import Header from '../../components/header/Header'
import Statusorder from '../../components/statusorder/Statusorder'
import Totalcart from '../../components/totalcart/Totalcart'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../components/feature/user/userSlice';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { deleteAllCart, getCart, totalCart, productInCart } from '../../components/feature/cart/cartSlice';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

const Detailbill = () => {
    const accessToken = localStorage.getItem("accessToken")
    const { totalPriceCart, quantityCart, dataOrder } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(dataOrder);
    const initialOptions = {
        clientId: "AUeA4VW5yEVQ7motDiiXgJDLVSwFZkFUCkaPk9Q4YOEnUD22fe7676G1K-LKgGwEPrGHTdq9Ie_XvSaq",
        currency: "USD",
        intent: "capture",
    };

    const createOrder = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/my-server/create-paypal-order',
                {
                    product: {
                        cost: totalPriceCart,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const order = response?.data;
            return order.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const onApprove = (data) => {
        console.log('onApprove');
        try {
            axios.post(
                'http://localhost:8000/my-server/capture-paypal-order',
                {
                    firstname: user[0]?.firstname,
                    lastname: user[0]?.lastname,
                    email: user[0]?.email,
                    address:
                        user[0]?.province === null
                            ? dataOrder?.detailaddress + " " + dataOrder?.wards + " " + dataOrder?.district + " " + dataOrder?.province
                            : user[0].detailaddress + " " + user[0].wards + " " + user[0].district + " " + user[0].province
                    ,
                    phonenumber: user[0]?.phonenumber,
                    cost: totalPriceCart,
                    orderID: data?.orderID,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + accessToken,
                    },
                }
            )
                .then(response => response?.data)
                .then(() => {
                    dispatch(deleteAllCart({ accessToken }))
                        .then(() => {
                            dispatch(getCart({ accessToken }))
                            navigate("/cartthanks")
                            dispatch(totalCart(0))
                            dispatch(productInCart([]))
                            localStorage.removeItem("user[0]")
                        })
                })
                .catch(error => console.log(error))
        } catch (error) {
            console.error('Error capturing order:', error);
            throw error;
        }
    };

    const handle_checkout = () => {
        console.log(user[0]?.province === null);
        axios.post("http://localhost:8000/invoice/checkout", {
            firstname: user[0].firstname,
            lastname: user[0].lastname,
            email: user[0].email,
            address:
                user[0]?.province === null
                    ? dataOrder?.detailaddress + " " + dataOrder?.wards + " " + dataOrder?.district + " " + dataOrder?.province
                    : user[0].detailaddress + " " + user[0].wards + " " + user[0].district + " " + user[0].province
            ,
            phonenumber: user[0].phonenumber,
            totalprice: totalPriceCart

        }, {
            headers: {
                Authorization: "Bearer " + accessToken,
            }
        })
            .then(() => {
                dispatch(deleteAllCart({ accessToken }));
                dispatch(totalCart(0))
                dispatch(productInCart([]))
                navigate("/cartthanks")
                localStorage.removeItem("user[0]")
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <Header></Header>
            <PayPalScriptProvider options={initialOptions}>
                <Templatecart text__my='Payment orders' text__btn='CONTINUES' text_back='/orderinfo'>
                    <Statusorder active_payment='active' />
                    <div className='detailbill'>
                        <h3 className='detailbill__order-info'> Order Information</h3>
                        <div >
                            <div className="detailbill__info-common">
                                <p>
                                    <span className='info-common-before'>Customer Name:</span>
                                    {user[0]?.firstname + " " + user[0]?.lastname}
                                </p>
                            </div>
                            <div className="detailbill__info-common">
                                <p>
                                    <span className='info-common-before'>Phone Number:</span>
                                    {user[0]?.phonenumber}
                                </p>
                            </div>
                            <div className="detailbill__info-common">
                                <p>
                                    <span className='info-common-before'>Email:</span>
                                    {user[0]?.email}
                                </p>
                            </div>
                            <div className="detailbill__info-common">
                                <p>
                                    <span className='info-common-before'>Receive Products At:</span>
                                    <span>
                                        {console.log(user[0])}
                                        {
                                            user[0]?.province === null
                                                ? `${dataOrder?.detailaddress} ${dataOrder?.wards} ${dataOrder?.district} ${dataOrder?.province}`
                                                : `${user[0]?.detailaddress} ${user[0]?.wards} ${user[0]?.district} ${user[0]?.province}`
                                        }

                                    </span>
                                </p>
                            </div>
                            <div className="detailbill__info-common">
                                <p>
                                    <span className='info-common-before'>Total Money</span>
                                    {totalPriceCart.toLocaleString('en-US').replace(/,/g, '.') + '$'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* <PayPalButtons className='detailbill__paypalbtn'
                        createOrder={() => createOrder()}
                        onApprove={(data) => onApprove(data)}
                    /> */}
                </Templatecart>
                <Totalcart
                    text__btn='CONTINUES'
                    handle__checkout={handle_checkout}
                    PayPalButtons={<PayPalButtons className='detailbill__paypalbtn'
                        createOrder={() => createOrder()}
                        onApprove={(data) => onApprove(data)}
                    />}
                />
            </PayPalScriptProvider>
        </>
    )
}

export default Detailbill
