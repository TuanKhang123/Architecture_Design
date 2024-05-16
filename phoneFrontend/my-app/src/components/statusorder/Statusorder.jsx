import React from 'react'
import "../statusorder/Statusorder.css"
import { FaShoppingCart } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi";
import { MdOutlinePayment } from "react-icons/md";
import { GiCardboardBoxClosed } from "react-icons/gi";

const Statusorder = ({active_payment}) => {
    return (
        <div className='status-order'>

            <div className='status-order__choose active'>
                <div className='choose__icon'>
                    <FaShoppingCart className='status-order__icon' />

                </div>
                <p className='choose__text'>Choose product</p>
            </div>

            <div className='status-order__choose active'>
                <div className='choose__icon'>
                    <HiIdentification className='status-order__icon' />
                </div>
                <p className='choose__text'>Order information</p>
            </div>
        
            <div className={`status-order__choose ${active_payment}`}>
                <div className='choose__icon'>
                    <MdOutlinePayment className='status-order__icon' />

                </div>
                <p className='choose__text'>Payment orders</p>
            </div>

            <div className='status-order__choose'>
                <div className='choose__icon'>
                    <GiCardboardBoxClosed className='status-order__icon' />

                </div>
                <p className='choose__text'>Complete your order</p>
            </div>
        </div>
    )
}
export default Statusorder