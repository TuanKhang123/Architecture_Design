import React, { useEffect, useRef, useState } from 'react'
import { FaStar, FaPlusCircle } from 'react-icons/fa'
import "swiper/css";
import "swiper/css/grid";
import "../category/Category.css"
import "swiper/css/navigation";
import { Link } from "react-router-dom"
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import axios from 'axios'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { Button } from 'antd';
import HeaderManager from '../../components/headermanager/HeaderManager';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
});

const Category = () => {
    const [category, setCategory] = useState([])
    const [More, setMore] = useState(false)
    const [categorytemp, setCategorytemp] = useState([])
    const role = localStorage.getItem('role');
    const [rating, setRating] = useState([])

    const renderStars = (averageValue) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            let starPercentage = Math.max(0, Math.min(100, (averageValue - i) * 100));
            stars.push(
                <div key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '20px' }}>
                    <FaStar fill='rgba(145,158,171,.522)' />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${starPercentage}%`,
                        overflow: 'hidden',
                        height: '100%',
                    }}>
                        <FaStar style={{ color: "#ffbf00" }} />
                    </div>
                </div>
            )
        }
        return stars;
    };
    
    useEffect(() => {
        axios.get(`http://localhost:8000/product/getcategory/${window.location.href.substring(
            window.location.href.lastIndexOf("/") + 1
        )}`)
            .then(res => {
                setCategory(res.data)
                setCategorytemp(res.data)
            })
            .catch(error => console.log(error))

        axios.get("http://localhost:8000/evaluate/getAllEvaluate")
            .then(res => {
                setRating(res.data.data)
            }).catch(error => console.log(error))
    }, [])

    const handleLH = () => {

        const sortedData = [...category].sort((a, b) => {
            const priceA = a.size[0].pricesize - (a.size[0].pricesize * (a.discount / 100));
            const priceB = b.size[0].pricesize - (b.size[0].pricesize * (b.discount / 100));
            return priceA - priceB;
        });
        setCategorytemp(sortedData);

    }

    const handleHL = () => {
        const sortedData = [...category].sort((a, b) => {
            const priceA = a.size[0].pricesize - (a.size[0].pricesize * (a.discount / 100));
            const priceB = b.size[0].pricesize - (b.size[0].pricesize * (b.discount / 100));
            return priceB - priceA;
        });
        setCategorytemp(sortedData);
    }
    return (
        <>
            {
                role === "admin" ? <HeaderManager /> :
                    <Header />
            }
            <div className='category'>
                {
                    categorytemp.length !== 0 ?
                        <div className='category__sort'>
                            <h2 className='category__sort-title'>Sorted by</h2>

                            <div className='category__sort-filter'>

                                <Button className='category__sort-filter-wrap' onClick={() => handleLH()}>
                                    <div className='category__sort-filter-wrap-icon category__sort-filter-wrap-icon-lh'></div>
                                    <p className='category__sort-filter-hl-title'>Price Low - High</p>
                                </Button>

                                <Button className='category__sort-filter-wrap' onClick={() => handleHL()}>
                                    <div className='category__sort-filter-wrap-icon category__sort-filter-wrap-icon-hl'></div>
                                    <p className='category__sort-filter-hl-title'>Price High - Low</p>
                                </Button>
                            </div>
                        </div>
                        : null
                }

                {
                    categorytemp.length === 0 ?
                        (<div className="category__list-empty">
                            <img src="https://media.itsnicethat.com/original_images/giphy-2021-gifs-and-clips-animation-itsnicethat-02.gif" alt="" className='category__list-empty-image' />
                            <p className='category__list-empty-text'>Empty</p>
                        </div>)
                        : null
                }

                <div className="category__product-list" style={{ maxHeight: More ? undefined : '410px' }}>

                    {
                        categorytemp ? categorytemp.map((value, index) => {
                            return (
                                <Link to={`/productsdetail/${value.idproducts}`} state={{ product: value }}>
                                    <div className='item' key={index} onClick={() => window.location.replace(`/productsdetail/${value.idproducts}`)}>
                                        <div className='discount'>
                                            <p >Giảm <span>{value.discount}%</span></p>
                                        </div>
                                        <div className='url'>
                                            <img key={index} src={value.image[0].avt} alt="" />
                                        </div>
                                        <h3 style={{ color: "#000" }}>{value.nameproducts}</h3>
                                        <div className='format'>
                                            <p>{(value?.size[0]?.pricesize - ((value?.size[0]?.pricesize * value?.discount) / 100)).toLocaleString('en-US').replace(/,/g, '.') + '$'}&nbsp;</p>
                                            <p>{(value?.size[0]?.pricesize).toLocaleString('en-US').replace(/,/g, '.') + '$'}&nbsp;</p>
                                        </div>
                                        <div className='promotion' style={{ color: "#000" }}>
                                            {value.promotion}
                                        </div>
                                        <div>
                                            {
                                                rating.find((rate) => rate?.idproducts === value?.idproducts.toString())
                                                    ? rating.filter((item) => parseInt(item.idproducts) === value.idproducts).map((rate) => (
                                                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                                            {renderStars(rate.averageRating)}
                                                        </div>
                                                    ))
                                                    :
                                                    <div div style={{ display: "flex", gap: "0.4rem", alignItems: "center", width: '100px', height: '45px' }}>
                                                        {
                                                            <div style={{ display: 'flex', gap: '5px', position: 'relative', fontSize: '20px' }}>

                                                                {
                                                                    Array.from({ length: 5 }, (_, index) => (
                                                                        <FaStar key={index} fill='rgba(145,158,171,.522)' style={{}} />
                                                                    ))
                                                                }
                                                            </div>

                                                        }
                                                    </div>

                                            }
                                        </div>
                                    </div>
                                </Link>

                            )
                        }) : null
                    }
                </div>
                {
                    categorytemp.length >= 6
                        ?
                        <div className='category__btn-show'>
                            <Button onClick={() => setMore(!More)}>
                                <span>
                                    {
                                        More ? 'Collagse' : 'See More'
                                    }
                                </span>
                                <div>
                                    {
                                        More ? <FaAngleUp /> : <FaAngleDown />
                                    }
                                </div>
                            </Button>
                        </div>
                        : null
                }
            </div>

            <Footer />
        </>
    )
}

export default Category

