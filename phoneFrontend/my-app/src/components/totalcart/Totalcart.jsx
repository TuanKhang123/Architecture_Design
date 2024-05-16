import React from 'react'
import "../totalcart/Totalcart.css"
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
});
const Totalcart = ({ text__btn, handle__checkout, styleCart, PayPalButtons }) => {
    const { totalPriceCart } = useSelector(state => state.cart)
    return (
        <>

            <div className='container__total-cart'>
                <div className={styleCart ? `total-cart ${styleCart}` : `total-cart`}>

                    <div className='total-cart__title'>
                        <p className='title__text'>Total money temporary:</p>
                        <p className='title__price'>{(totalPriceCart).toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                    </div>

                    {
                        PayPalButtons ? PayPalButtons : null 
                    }
                    <div className='total-cart__btn-submit' >
                        <button className='btn-submit__order'
                            onClick={() => handle__checkout()}
                        >
                            {text__btn}
                        </button>

                        <a href='/' className='btn-submit__add-product'>
                            CHOOSE ADD THE OTHER PRODUCT
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

Totalcart.propTypes = {
    text__btn: PropTypes.string,
    handle__checkout: PropTypes.func,
};

export default Totalcart

