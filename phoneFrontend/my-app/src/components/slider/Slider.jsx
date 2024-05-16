import React, { useEffect, useState } from 'react'
import "../slider/Slider.css"
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

const array = [
    {
        url: "./1.jpg"
    },
    {
        url: "./2.png"
    },
    {
        url: "./3.jpg"
    },
]

const Slider = () => {
    const [banner] = useState(array)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const lastIndex = banner.length - 1
        if (index < 0) {
            setIndex(lastIndex)
        }
        if (index > lastIndex) {
            setIndex(0)
        }
    }, [index, banner])

    // Automatic slider
    useEffect(() => {
        const slider = setInterval(() => {
            setIndex(index + 1)
        }, 4000)
        return () => {
            clearInterval(slider)
        }
    }, [index])
    
    return (
        <>
            <div className="section">
                <div className='banner'>
                    <div className="main-banner">
                        {
                            banner.map((value, indexBanner) => {
                                let position = "nextSlide"
                                if (indexBanner === index) {
                                    position = "activeSlide"
                                }
                                if (indexBanner === index - 1 || (index === 0 && indexBanner === banner.length - 1)) {
                                    position = "lastSlide"
                                }
                                return (
                                    <article className={position} key={indexBanner}>
                                        <img src={value.url} alt="" />
                                    </article>
                                )
                            })
                        }
                    </div>
                    <div className="sub-banner">
                        <img className='sub-banner-img' src="./4.jpg" alt="" />
                        <img className='sub-banner-img' src="./5.png" alt="" />
                    </div>
                </div>
            </div>
            <button className='prev' onClick={() => setIndex(index - 1)}>
                <FaAngleLeft style={{ fontSize: "2rem", color: "#dcdcdc" }} />
            </button>
            <button className='next' onClick={() => setIndex(index + 1)}>
                <FaAngleRight style={{ fontSize: "2rem", color: "#dcdcdc" }} />
            </button>
        </>
    )
}

export default Slider