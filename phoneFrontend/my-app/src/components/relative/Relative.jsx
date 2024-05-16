import React, { useEffect } from 'react'
import "../relative/Relative.css"
import { FaStar, FaPlusCircle } from 'react-icons/fa'
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../feature/products/productsSlice';
import { Grid, Navigation } from 'swiper';

const Relative = (props) => {
    const { products } = props
    console.log(products);

    return (
        <div className='relative'>
            <h3 className='title'>Relative</h3>
            <div className='product-list'>
                <Swiper
                    slidesPerView={5}
                    navigation={true}
                    spaceBetween={30}
                    modules={[Grid, Navigation]}
                    className="mySwiper"
                >
                    {
                        // products.data ? products.data.map((value, index) => {
                        //     return (
                        //         <SwiperSlide key={index}>
                        //             <Link to={`/productsdetail/${value.idproducts}`} state={{ product: value }}>
                        //                 <div className='item' key={index} onClick={() => window.location.replace(`/productsdetail/${value.idproducts}`)}>
                        //                     <div className='discount'>
                        //                         <p >Giảm <span>{value.discount}%</span></p>
                        //                     </div>
                        //                     <div className='url'>
                        //                         <img key={index} src={value.image[0].avt} alt="" />
                        //                     </div>
                        //                     <h3 style={{ color: "#000" }}>{value.nameproducts}</h3>
                        //                     <div className='format'>
                        //                         <p>{((value.size[0].pricesize * value.discount) / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        //                         <p>{(value.size[0].pricesize).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        //                     </div>
                        //                     <div className='promotion' style={{ color: "#000" }}>
                        //                         {value.promotion}
                        //                     </div>
                        //                     <div className='icon'>
                        //                         <div>
                        //                             <FaStar className='star' />
                        //                             <FaStar className='star' />
                        //                             <FaStar className='star' />
                        //                             <FaStar className='star' />
                        //                             <FaStar className='star' />
                        //                         </div>
                        //                         <button>
                        //                             <FaPlusCircle className='circle' />
                        //                         </button>
                        //                     </div>
                        //                 </div>
                        //             </Link>

                        //         </SwiperSlide>
                        //     )
                        // }) : null
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default Relative