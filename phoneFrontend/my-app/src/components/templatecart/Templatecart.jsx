import React from 'react'
import "../templatecart/Templatecart.css"
import { IoIosArrowBack } from "react-icons/io";
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const Templatecart = ({ text__my, children, text_back }) => {

    const navigate = useNavigate()

    return (
        <div className='template-cart'>
            <h1 className='template-cart__title'>
                {text__my}
                <a className='title__back' onClick={() => navigate(text_back)}>
                    <IoIosArrowBack className='title__icon' />
                    <p>Back</p>
                </a>
            </h1>

            {children}

        </div>
    )
}

Templatecart.propTypes = {
    text__my: PropTypes.string,
};

export default Templatecart