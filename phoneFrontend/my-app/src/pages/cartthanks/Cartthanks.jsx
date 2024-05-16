import React from 'react'
import "../cartthanks/Cartthanks.css"
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

const Cartthanks = () => {
    return (
        <>
            <Header/>
            <div className="cart-thanks">
                <img src="https://img.wattpad.com/7742e622a894dab459b7e8622c58bafa5089425f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f6e395f587a6e5a386e59745878673d3d2d3639393536373039362e313538363562613935623864343130333231393436333332333237302e676966?s=fit&w=720&h=720" alt="" className='img-thank'/>
                <h1 className='cart-thanks__text-thank'>Thank You For  <br />
                Your Order</h1>
            </div>
            <Footer/>
        </>
    )
}

export default Cartthanks
