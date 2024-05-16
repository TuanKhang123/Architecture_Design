import React, { useEffect, useState } from 'react'
import "../orderdetail/Orderdetail.css"
import { MdRadioButtonChecked } from "react-icons/md";
import { GrBasket } from "react-icons/gr";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from "../feature/user/userSlice"

const Orderdetail = (props) => {

    const datetime = new Date(props.dataFromParent[0].ivday)
    const [totalproduct, setTotalProduct] = useState(0)
    const [totaldiscount, setTotalDiscount] = useState(0)
    const user = useSelector(state => state.user)
    console.log(user);
    const accessToken = localStorage.getItem('accessToken')
    const dispatch = useDispatch()

    useEffect(() => {
        props.dataFromParent.map((item, i) => {
            setTotalProduct((prev) => prev + item.pricesize)
            setTotalDiscount((prev) => prev + (item.pricesize - item.price))
        })
        if (accessToken) 
            dispatch(getUser(accessToken))
    }, [])

    return (
        <div className='orderdetail'>
            <p className='orderdetail__name'>ORDER DETAIL</p>
            <div className="orderdetail__back" onClick={() => props.parentCallback(-1)}>
                <BsArrowLeftShort className='orderdetail__back-icon' />
                <p className="orderdetail__back-text">Back</p>
            </div>

            <div className={`orderdetail-container_status orderdetail-container_status-${props.dataFromParent[0].statusiv}`} >
                {props.dataFromParent[0].statusiv}
            </div>

            <div className='orderdetail_container'>
                {
                    props.dataFromParent.map((itemiv, i) => (
                        
                        <div className="orderdetail__item" key={i}>
                            <div className="orderdetail__item-pro">
                                <img src={itemiv.avt} alt="" className='orderdetail__item-pro-img' />
                                <div className="orderdetail__item-pro-detail">
                                    <p className="orderdetail__item-pro-detail-namepro">{itemiv.nameproducts}</p>
                                    <div className='container-size-color'>
                                        <p className="orderdetail__item-pro-detail-size">Size: {itemiv.namesize}</p>
                                        <p className="orderdetail__item-pro-detail-color">Color: {itemiv.namecolor}</p>
                                    </div>

                                    <p className="orderdetail__item-pro-detail-quantity">Quantity: {itemiv.quantity}</p>
                                    <div className='container-price'>
                                        <p className="orderdetail__item-pro-detail-price">{itemiv.price.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                                        <p className="orderdetail__item-pro-detail-pricesize">{itemiv.pricesize.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="time-detail">
                <p className='time-detail__title'>Time details:</p>
                <div className="time-detail__point">
                    <div className="time-detail__point-group">
                        <MdRadioButtonChecked className='time-detail__point-group-icon' />
                        <p className='time-detail__point-group-detail-status'>Order confirmed</p>

                    </div>

                    <p className='time-detail__point-time'>
                        {(datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate())}

                        <br />

                        {(datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds())}
                    </p>
                </div>

                <div className="time-detail__point time-detail__point-under">
                    <div className="time-detail__point-group">
                        <MdRadioButtonChecked className='time-detail__point-group-icon' />
                        <p className='time-detail__point-group-detail-status'>Your order has been delivered to you</p>

                    </div>

                    <p className='time-detail__point-time'>
                    2023-07-24
                    </p>
                </div>
            </div>

            <div className="orderdetail__orderinfo">
                <div className="orderdetail__orderinfo-title">
                    <GrBasket className='orderdetail__orderinfo-title-basket' />
                    <p className="orderdetail__orderinfo-title-text">Order information</p>
                </div>

                <div className="orderdetail__orderinfo-total">
                    <p className='orderdetail__orderinfo-total-text'>Total product cost:</p>
                    <p className='orderdetail__orderinfo-total-product'>{totalproduct.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                </div>

                <div className="orderdetail__orderinfo-tran-fee">
                    <p className='orderdetail__orderinfo-tran-fee-text'>Total discount:</p>
                    <p className='orderdetail__orderinfo-tran-fee-price'>{totaldiscount.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                </div>

                <div className="orderdetail__orderinfo-total">
                    <p className='orderdetail__orderinfo-total-text'>Transport fee:</p>
                    <p className='orderdetail__orderinfo-total-fee'>Free of charge</p>
                </div>

                <div className="orderdetail__orderinfo-total">
                    <p className='orderdetail__orderinfo-total-text-total-price'>Total order value:</p>
                    <p className='orderdetail__orderinfo-total-price'>{props.dataFromParent[0].totalprice.toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                </div>
            </div>

            <div className="orderdetail__cusinfo">
                <div className="orderdetail__cusinfo-title">
                    <BiUserCircle className='orderdetail__cusinfo-title-icon' />
                    <p className="orderdetail__cusinfo-title-text">Customer information</p>
                </div>

                <div className="orderdetail__cusinfo-row">
                    <AiOutlineUser className='orderdetail__cusinfo-row-icon' />
                    <p className="orderdetail__cusinfo-row-name">{user?.user[0]?.firstname + " " + user?.user[0]?.lastname}</p>
                </div>

                <div className="orderdetail__cusinfo-row">
                    <BsTelephone className='orderdetail__cusinfo-row-phone' />
                    <p className="orderdetail__cusinfo-row-name">{user?.user[0]?.phonenumber}</p>
                </div>

                <div className="orderdetail__cusinfo-row">
                    <GrLocation className='orderdetail__cusinfo-row-icon' />
                    <p className="orderdetail__cusinfo-row-name">{user?.user[0]?.province}</p>
                </div>

            </div>
        </div>
    )
}
export default Orderdetail