import React, { useEffect, useState } from 'react'
import "../listfavourite/ListFavourite.css"
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { getListFavorite } from '../../components/feature/favorite/favoriteSlice'
import { Link } from 'react-router-dom'
import { FaStar, FaPlusCircle } from 'react-icons/fa'
import { Button } from 'antd';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import axios from 'axios'

const ListFavourite = () => {
    const favorites = useSelector((state) => state.favorite)
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()
    const [More, setMore] = useState(false)
    const [rating, setRating] = useState([])

    useEffect(() => {
        dispatch(getListFavorite({ accessToken }))

        axios.get("http://localhost:8000/evaluate/getAllEvaluate")
            .then(res => {
                setRating(res.data.data)
            }).catch(error => console.log(error))
    }, [])

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

    return (
        <div style={{ marginTop: "32px" }}>
            <Header />

            <div className='title__list-favourite'>LIST FAVORITE</div>
            {
                favorites.favorites.length === 0 ?
                    (<div className="favourite__list-empty">
                        <img src="https://media.itsnicethat.com/original_images/giphy-2021-gifs-and-clips-animation-itsnicethat-02.gif" alt="" className='favourite__list-empty-image' />
                        <p className='favourite__list-empty-text'>Empty</p>
                    </div>)
                    : null
            }

            <div className='list-favourite' style={{ maxHeight: More ? undefined : '410px' }}>

                {
                    favorites?.favorites.map((value, index) => (
                        <Link to={`/productsdetail/${value.idproducts}`} state={{ product: value }} key={index} className='link'>
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
                                <div className='promotion' style={{ color: "#000" , marginBottom: '5px'}}>
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

                    ))

                }
            </div>
            {
                favorites.favorites.length >= 6
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
            <Footer />
        </div>
    )
}

export default ListFavourite