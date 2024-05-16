import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../components/feature/products/productsSlice'
import Slider from '../../components/slider/Slider'
import { FaStar, FaPlusCircle, FaStarHalf } from 'react-icons/fa'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "../home/Home.css"
import "swiper/css/navigation";
import { Grid, Navigation } from "swiper"
import { Link, useNavigate } from "react-router-dom"
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import axios from 'axios'
import { HiChat } from 'react-icons/hi';
import PopupChat from '../../components/popupchat/PopupChat'
import { getDoc, doc, setDoc, updateDoc, serverTimestamp, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from 'antd';
import HeaderManager from '../../components/headermanager/HeaderManager'
import { getUsers } from '../../components/feature/user/userSlice'
import { RiErrorWarningFill } from "react-icons/ri";

const Home = () => {
    const products = useSelector((state) => state?.products)
    const { user, listUser } = useSelector((state) => state.user)
    const [category, setCategory] = useState([])
    const [inputhome, setInputHome] = useState('')
    const [isPopupChat, setIsPopupChat] = useState(false)
    const [accountAdmin, setAccountAdmin] = useState({})
    const [combinedId, setCombinedId] = useState()
    const [chats, setChats] = useState([])
    const [flagU, setFlagU] = useState()

    const dispatch = useDispatch()
    const accessToken = localStorage.getItem("accessToken")

    const navigate = useNavigate()
    const role = localStorage.getItem('role');
    var profilter = [];

    const [rating, setRating] = useState([])

    useEffect(() => {
        dispatch(getProducts())
        dispatch(getUsers(accessToken))

        axios.get("http://localhost:8000/product/getcategory")
            .then(res => {
                setCategory(res.data)
            })
            .catch(error => console.log(error))

        axios.get("http://localhost:8000/evaluate/getAllEvaluate")
            .then(res => {
                setRating(res.data.data)
            }).catch(error => console.log(error))

    }, [])


    useEffect(() => {
        if (accountAdmin) {
            const getChats = () => {
                const unsub = onSnapshot(doc(db, "adminChats", accountAdmin?.idusers.toString()), (doc) => {
                    setChats(doc.data())
                });

                return () => {
                    unsub();
                }
            }
            accountAdmin?.idusers && getChats()
        }
    }, [accountAdmin ? accountAdmin?.idusers : null])

    useEffect(() => {
        const chatEntry = chats ? Object.entries(chats).find(chat => chat[0] === combinedId) : null;
        setFlagU(chatEntry ? chatEntry[1].flagUser : null);
    }, [chats])


    useEffect(() => {
        if (listUser) {
            const admin = listUser?.find(user => user?.role === 'admin')
            setAccountAdmin(admin)
        }
    }, [listUser])

    useEffect(() => {
        if (user && accountAdmin?.idusers && user[0]?.role === 'user') {
            setCombinedId(accountAdmin?.idusers > user[0]?.idusers
                ? accountAdmin?.idusers.toString() + user[0]?.idusers.toString()
                : user[0]?.idusers.toString() + accountAdmin?.idusers.toString())
        }
    }, [user, accountAdmin])

    const setInput = (childdata) => {
        setInputHome(childdata)
    }

    const handlePopupChat = async () => {
        setIsPopupChat(!isPopupChat)
        // Thực hiện đưa code vào đây
        try {
            const res = await getDoc(doc(db, "chats", combinedId))
            if (!res.exists()) {
                console.log('create');
                // create a chat in chats collection
                await setDoc(doc(db, 'chats', combinedId), { messages: [] })

                // create user chats
                await updateDoc(doc(db, 'adminChats', accountAdmin?.idusers.toString()), {
                    [combinedId + ".userInfo"]: {
                        idusers: user[0]?.idusers.toString(),
                        displayName: user[0]?.lastname,
                        photoURL: user[0]?.avtuser
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                })
            }
            else if (flagU) {
                await updateDoc(doc(db, "adminChats", accountAdmin?.idusers.toString()), {
                    [combinedId + ".flagUser"]: false
                });
                setFlagU(!flagU)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isPopupChat) {
            const checkNew = async () => {
                try {
                    await updateDoc(doc(db, "adminChats", accountAdmin?.idusers.toString()), {
                        [combinedId + ".flagUser"]: false
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            checkNew()
        }
    }, [isPopupChat, chats])

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
        <>
            <div style={{ marginTop: "32px" }}>
                {
                    role === "admin"
                        ? <HeaderManager />
                        : <Header parentCallback={setInput} />
                }
                <Slider />
                <div className='home'>
                    <div className='product-list-title'>
                        <div>
                            <h2>THE MOST OUTSTANDING PHONE</h2>
                        </div>
                        <div>
                            {
                                category.map(value => (
                                    <Button onClick={() => { navigate(`/category/${value?.idcate}`) }} className='related-tag' key={value?.idcate}>
                                        {value.namecate}
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="product-list">
                        <Swiper
                            slidesPerView={5}
                            navigation={true}
                            grid={{
                                rows: 2,
                            }}
                            spaceBetween={30}
                            modules={[Grid, Navigation]}
                            className="mySwiper"
                        >
                            {
                                Array.isArray(products?.data) && products ?
                                    profilter =
                                    products?.data.filter((product) => {
                                        if (inputhome === '')
                                            return product;
                                        else if (product?.nameproducts?.toLowerCase().includes(inputhome.toLowerCase()))
                                            return product;
                                    })
                                        .map((value, index) => {
                                            return (
                                                <SwiperSlide key={index} style={{}}>
                                                    <Link to={`/productsdetail/${value?.idproducts}`}>
                                                        <div className='item' key={index} onClick={() => window.location.replace(`/productsdetail/${value.idproducts}`)}>
                                                            <div className='discount'>
                                                                <p >Giảm <span>{value?.discount}%</span></p>
                                                            </div>
                                                            <div className='url'>
                                                                <img key={index} src={value?.image[0]?.avt ? value?.image[0]?.avt : null} alt="Image product" />
                                                            </div>
                                                            <h3 style={{ color: "#000" }}>{value?.nameproducts}</h3>
                                                            <div className='format'>

                                                                <p>{(value?.size[0]?.pricesize - ((value?.size[0]?.pricesize * value?.discount) / 100)).toLocaleString('en-US').replace(/,/g, '.') + '$'}&nbsp;</p>
                                                                <p>{(value?.size[0]?.pricesize).toLocaleString('en-US').replace(/,/g, '.') + '$'}&nbsp;</p>
                                                            </div>
                                                            <div className='promotion' style={{ color: "#000" }}>
                                                                {value?.promotion}
                                                            </div>
                                                            <div className='icon'>
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
                                                                <div>
                                                                    <button>
                                                                        <FaPlusCircle className='circle' size={24} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                </SwiperSlide>
                                            )
                                        })
                                    : null
                            }
                        </Swiper>
                        {
                            profilter.length === 0
                                ?
                                <div className='product-list-container'>

                                    <img
                                        src="https://media.itsnicethat.com/original_images/giphy-2021-gifs-and-clips-animation-itsnicethat-02.gif"
                                        alt="" className='product-list-container__image'
                                    />

                                    <h1 className='product-list-container__empty'>NO PRODUCT FOUND</h1>
                                </div>
                                : null
                        }
                    </div>
                </div>
                <Footer />
            </div >

            {
                role === 'user'
                    ? isPopupChat
                        // chat
                        ? <PopupChat setIsPopupChat={setIsPopupChat} combinedId={combinedId} accountAdmin={accountAdmin} />
                        : <>
                            <div onClick={handlePopupChat}
                                className='chat-user'
                            >
                                {
                                    flagU
                                        ? <RiErrorWarningFill className='chat-user_notice' />
                                        : null
                                }
                                <HiChat style={{ color: "white", fontSize: "32px" }} />
                            </div>
                        </>
                    : null
            }
        </>
    )
}

export default Home