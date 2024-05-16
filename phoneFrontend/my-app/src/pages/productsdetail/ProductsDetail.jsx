import React, { useEffect, useState, } from 'react'
import "../productsdetail/ProductsDetail.css"
import { FaStar, FaAngleDown, FaAngleUp, FaCartPlus, FaMobileAlt, FaRegHandPointRight } from 'react-icons/fa'
import { AiOutlineCheck, AiOutlineHeart, AiFillHeart, AiOutlineClockCircle, AiOutlineSend } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Relative from '../../components/relative/Relative';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, getCart } from "../../components/feature/cart/cartSlice"
import Header from "../../components/header/Header"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { addFavorite, deleteFavorite } from '../../components/feature/favorite/favoriteSlice';
import { getProducts, getProductsById } from '../../components/feature/products/productsSlice';
import ModalReview from '../../components/modalreview/ModalReview';
import { getUser, getUsers } from '../../components/feature/user/userSlice';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'; // Import plugin
import ListComment from '../../components/ListComment/ListComment';
import HeaderManager from '../../components/headermanager/HeaderManager';
dayjs.extend(relativeTime);


const addressData = [
    {
        phone: "0342578371",
        address: "Nguyễn Thái Học, P. Phạm Ngũ Lão, Q.1, TP HCM"
    },
    {
        phone: "0905504715",
        address: "218-220 Trần Quang Khải, Phường Tân Định, Quận 1"
    },
    {
        phone: "0978050292",
        address: "157-159 Nguyễn Thị Minh Khai, P. Phạm Ngũ Lão, Q. 1"
    },
    {
        phone: "0872419419",
        address: "55B Trần Quang Khải, P. Tân Định, Q. 1"
    },
    {
        phone: "0982744714",
        address: "190 Nguyễn Thị Định, khu phố 2, phường An Phú, quận 2"
    },
    {
        phone: "0982744714",
        address: "177 Khánh Hội, P. 3, Q. 4"
    },
    {
        phone: "0982744714",
        address: "458 - 460 Hậu Giang, phường 12, Quận 6"
    },
    {
        phone: "0982744714",
        address: "248 Nguyễn Thị Thập, P. Tân Quy, Q. 7"
    },
]

const promotion = [
    "Up to 1% more discount for Smember members (applicable depending on products)",
    "Comprehensive product protection with extended warranty service",
    "Extra 5% off up to 500,000 VND when paying via Kredivo",
    "Additional discount up to 300,000 VND for orders of 5 million VND or more when paying via VNPAY",
    "Additional discount of VND 600,000 via JCB credit card for orders from VND 10,000,000",
    "Extra 4% off (up to 250,000 VND) via Moca wallet for orders from 500,000 VND",
    "Open UOB card - Get Evoucher up to 3 million purchases at CellphoneS",
    "Open a VIB credit card - Receive a voucher of VND 200,000 for purchases at CellphoneS",
    "New old collection: High price - Quick procedure - Best subsidy"
]

const listStar = [
    {
        number: 5,
        image: <FaStar style={{ color: "#ffbf00", fontSize: "16px" }} />
    },
    {
        number: 4,
        image: <FaStar style={{ color: "#ffbf00", fontSize: "16px" }} />
    },
    {
        number: 3,
        image: <FaStar style={{ color: "#ffbf00", fontSize: "16px" }} />
    },
    {
        number: 2,
        image: <FaStar style={{ color: "#ffbf00", fontSize: "16px" }} />
    },
    {
        number: 1,
        image: <FaStar style={{ color: "#ffbf00", fontSize: "16px" }} />
    },
]

const ProductsDetail = () => {
    const [selectedProvince, setSelectedProvince] = useState()
    const [selectedDistrict, setSelectedDistrict] = useState()
    const [province, setProvince] = useState([])
    const [district, setDistrict] = useState([])
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isMore, setIsMore] = useState(false)
    const dispatch = useDispatch()
    const productsById = useSelector(state => state.products)
    // const accessToken = localStorage.getItem("accessToken")
    const { accessToken } = useSelector(state => state?.user)
    const [data, setData] = useState(null)
    const [idSize, setIdSize] = useState(null);
    const [idColor, setIdColor] = useState();
    const [maxQuantity, setMaxquantity] = useState()
    const [priceSize, setPriceSize] = useState(null)
    const [nameSize, setNameSize] = useState()
    const [isHeart, setIsHeart] = useState()
    const navigate = useNavigate()
    const [isModal, setIsModal] = useState(false)
    const { user } = useSelector(state => state?.user)
    const [listEvaluate, setListEvaluate] = useState([])
    const [statisticsOfReview, setStatisticsOfReview] = useState([])
    const [selectedStar, setSelectedStar] = useState(null)
    const [comment, setComment] = useState("")
    const [listComment, setListComment] = useState([])
    const { cart } = useSelector(state => state.cart)
    const role = localStorage.getItem('role');
    const { listUser } = useSelector(state => state.user)
    const handleAddToCart = async (number) => {
        if (!accessToken) {
            navigate("/login")
        } else {
            const selectedProduct = productsById.data?.size.find((size) => {
                return size.color.some((item) => item.idcolor === idColor && item.quantity > 0);
            });
            if (selectedProduct) {
                const checkItemCart = cart?.find((item) =>
                    item?.idproducts === productsById.data?.idproducts &&
                    item?.idsize === idSize &&
                    item?.idcolor === idColor
                )

                if (checkItemCart && checkItemCart?.quantity === checkItemCart?.maxquantity) {
                    toast.info(
                        'You can only buy the maximum current quantity',
                        {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                        }
                    );
                } else {
                    await dispatch(addCart({ idproducts: productsById.data?.idproducts, idsize: idSize, idcolor: idColor, idimage: productsById.data?.image[0].idimage, maxquantity: maxQuantity, accessToken }))
                        .then(() => {
                            toast.success(
                                'Add successfully ',
                                {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                                }
                            );
                            dispatch(getCart({ accessToken })).then(() => {
                                if (number === 1)
                                    navigate("/cart")
                            })
                        })
                }
            } else {
                toast.info(
                    'The product is out of stock',
                    {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                    }
                );
            }
        }
    }

    const handleAddFavorite = (e) => {
        e.preventDefault()
        if (accessToken) {
            dispatch(addFavorite({ accessToken, idproducts: productsById.data?.idproducts, idimage: productsById.data?.image[0].idimage }))
            setIsHeart(true)
            toast.success(
                'You have added the product to your favorites list',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        }
        else {
            toast.error('You need to log in to do this', {
                position: 'top-right',
                autoClose: 3000,
                style: { color: '#bf0d0d', backgroundColor: '#D7F1FD' },
            });
        }
    }

    const handleDeleteFavorite = (e) => {
        e.preventDefault()
        dispatch(deleteFavorite({ accessToken, idproducts: productsById.data?.idproducts }))
        setIsHeart(false)
        toast.success(
            'You have delete the product to your favorites list',
            {
                position: 'top-right',
                autoClose: 3000,
                style: { color: '$color-default', backgroundColor: '#DEF2ED' },
            }
        );
    }

    const handleOpenModal = (e) => {
        e.stopPropagation()
        if (user)
            setIsModal(true)
        else
            toast.error('You need to log in to do this', {
                position: 'top-right',
                autoClose: 3000,
                style: { color: '#bf0d0d', backgroundColor: '#D7F1FD' },
            });
    }

    const getListEvaluate = async () => {
        if (productsById && productsById.data) {
            try {
                const response = await axios.get(`http://localhost:8000/evaluate/getEvaluate/${productsById.data.idproducts}`, {
                    params: {
                        starRating: selectedStar
                    }
                });
                setListEvaluate(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    };



    useEffect(() => {
        dispatch(getUsers(accessToken))
            .then(res => console.log(res))
    }, [])


    const getStatisticsOfReview = async () => {
        if (productsById && productsById.data) {
            try {
                const response = await axios.get(`http://localhost:8000/evaluate/getEvaluate/${productsById.data.idproducts}`);
                setStatisticsOfReview(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getListComments = async () => {
        if (productsById && productsById.data) {
            try {
                const response = await axios.get(`http://localhost:8000/comment/getComment/${productsById.data.idproducts}`);
                setListComment(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const calculateAverage = (list, property, number) => {
        let total = 0;

        for (let i = 0; i < list.length; i++) {
            total += list[i][property][number];
        }

        return total / list.length;
    };

    const averageRating = calculateAverage(statisticsOfReview, 'starnumber', 'number');
    // const handleComment = (e) => {
    //     e.preventDefault()
    //     if (user)
    //         setComment(e.target.value)
    //     // else
    //     //     toast.error('You need to log in to do this', {
    //     //         position: 'top-right',
    //     //         autoClose: 3000,
    //     //         style: { color: '#bf0d0d', backgroundColor: '#D7F1FD' },
    //     //     });

    // }

    const averagePerformance = calculateAverage(statisticsOfReview, 'performance', 'number');
    const averageBatteryLife = calculateAverage(statisticsOfReview, 'batterylife', 'number');
    const averageCameraQuantity = calculateAverage(statisticsOfReview, 'cameraquantity', 'number');

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

    const countStars = (targetStarNumber) => {
        const starCount = statisticsOfReview.filter(value => value.starnumber.number === targetStarNumber.starnumber).length;
        return starCount;
    };

    const filteredEvaluations =
        selectedStar ?
            listEvaluate.filter((evaluate) => evaluate.starnumber.number === selectedStar) :
            listEvaluate

    useEffect(() => {
        dispatch(getProductsById({ accessToken }))
        axios.get("https://provinces.open-api.vn/api/p/")
            .then((response) => {
                setProvince(response.data)
            })
            .catch(error => {
                console.log(error);
            })
        if (selectedProvince) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => {
                    setDistrict(response.data.districts)
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [selectedProvince])

    useEffect(() => {
        if (productsById.data?.size?.length > 0) {
            setIdSize(productsById.data.size[0].idsize);
            setPriceSize(productsById.data?.size[0].pricesize)
            setData(productsById.data?.size[0].color)
            setNameSize(productsById.data?.size[0].namesize)
            setIdColor(productsById.data.size[0].color[0].idcolor)
            setMaxquantity(productsById.data.size[0].color[0].quantity)
            setIsHeart(productsById?.data?.isHeart)
        }
    }, [productsById])

    useEffect(() => {
        dispatch(getUser(accessToken))
    }, [productsById])

    useEffect(() => {
        getListEvaluate()
        getListComments()
    }, [selectedStar, productsById])
    useEffect(() => {
        getStatisticsOfReview()
    }, [productsById, listEvaluate])

    const handleSubmitComments = (e) => {
        e.preventDefault()
        if (productsById && productsById.data) {
            axios.post("http://localhost:8000/comment/addComment", {
                idproducts: productsById.data.idproducts,
                comment: comment,
                parentId: null
            }
                , {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    },
                }
            )
                .then(() => {
                    getListComments()
                    setComment("")
                })
                .catch((error) => {
                    if (error?.response?.data?.message === "Invalid Token") {
                        toast.error('You need to log in to do this', {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '#bf0d0d', backgroundColor: '#D7F1FD' },
                        });
                    }
                })
        }
    }

    return (
        <>
            {
                role === "admin" ? <HeaderManager /> :
                    <Header />
            }
            <div className='product-detail'>
                <div className='format-child'>
                    <div>
                        <h1>{productsById?.data?.nameproducts} <span>{nameSize}</span> </h1>
                    </div>
                    <div className='icon'>
                        {
                            user && user[0]?.role !== 'admin'
                                ? isHeart ?
                                    <button onClick={handleDeleteFavorite}>
                                        <AiFillHeart className='fill-heart' />
                                    </button> :
                                    <button onClick={handleAddFavorite}>
                                        <AiOutlineHeart className='outline-heart' />
                                    </button>
                                : null
                        }
                    </div>
                </div>
                <hr />
                <div className='flex-container'>
                    <div className='left-container'>
                        <div className='gallery'>
                            <Swiper
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                            >
                                {
                                    productsById.data?.image?.map((value, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={value.avt} />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                        <div className='child-gallery'>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={12}
                                slidesPerView={6}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {
                                    productsById.data?.image?.map((value, index) => (
                                        <SwiperSlide key={index}>
                                            <img style={{ width: "100%", height: "100%" }} src={value.avt} />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                    </div>
                    <div className='middle-container'>
                        <div className='box-price'>
                            <p className='price-show'>
                                {priceSize && (priceSize - ((priceSize * productsById.data?.discount) / 100)).toLocaleString('en-US').replace(/,/g, '.') + '$'}
                            </p>
                            <p className='price-through'>{priceSize && (priceSize).toLocaleString('en-US').replace(/,/g, '.') + '$'}</p>
                        </div>
                        <div className='form-format'>
                            <form>
                                {
                                    productsById.data?.size?.map((value) => (
                                        <label className='item-linked' key={value.idsize} htmlFor={value.idsize} style={
                                            {
                                                border: value.idsize === idSize ? "1.4px solid #1a94ff" : "",
                                            }
                                        }>
                                            <div className='content'>
                                                <p className='name'>
                                                    {
                                                        value.idsize === idSize ? (
                                                            <AiOutlineCheck style={{ color: "#fff", backgroundColor: "#1a94ff", fontWeight: "bold", position: "absolute", left: "0", top: "0" }} />
                                                        ) :
                                                            null
                                                    }
                                                    {value.namesize}
                                                </p>
                                                <p className="price">
                                                    {(value?.pricesize - ((value?.pricesize * productsById.data?.discount) / 100)).toLocaleString('en-US').replace(/,/g, '.') + '$'}
                                                </p>
                                            </div>
                                            <input type="radio" name="size" id={value.idsize} value={value.idsize}
                                                onChange={(e) => {
                                                    setIdSize(value.idsize)
                                                    if (e.target.checked) {
                                                        setData(value.color)
                                                        setPriceSize(value.pricesize)
                                                        setNameSize(value.namesize)
                                                    }
                                                }}
                                            />
                                        </label>
                                    ))
                                }
                            </form>
                        </div>
                        <div className='choose-color'>
                            <p>Choose color to see price</p>
                        </div>
                        <div className='form-format'>
                            <form>
                                {
                                    data?.map((item) => (
                                        <label key={item.idcolor} className='item-linked' style={
                                            {
                                                opacity: item?.quantity === 0 ? "0.4" : "",
                                                border:
                                                    item?.quantity === 0
                                                        ? "1.4px solid red"
                                                        : item?.idcolor === idColor
                                                            ? "1.4px solid #1a94ff"
                                                            : ""
                                                ,
                                                color: item?.quantity === 0 ? "red" : ""
                                            }
                                        }
                                        >
                                            <div className='content'>
                                                <p className='name'>
                                                    {
                                                        item.idcolor === idColor && item.quantity > 0 ? (
                                                            <AiOutlineCheck style={{ color: "#fff", backgroundColor: "#1a94ff", fontWeight: "bold", position: "absolute", left: "0", top: "0" }} />
                                                        ) :
                                                            null
                                                    }
                                                    {item.namecolor}
                                                </p>
                                                {
                                                    productsById.data ? productsById.data.size.map((value) => (
                                                        <div key={value.idsize}>
                                                            {
                                                                value.idsize === idSize ? <p className='price'>
                                                                    {(value.pricesize - ((value.pricesize * productsById.data.discount) / 100)).toLocaleString('en-US').replace(/,/g, '.') + '$'}
                                                                </p> : null
                                                            }
                                                        </div>
                                                    )) : null
                                                }
                                            </div>
                                            <input
                                                type="radio"
                                                id={item.idcolor}
                                                name="color"
                                                value={item.namecolor}
                                                checked={item.idcolor === idColor}
                                                onChange={(e) => {
                                                    setMaxquantity(item.quantity)
                                                    setIdColor(item.idcolor)
                                                }}
                                                disabled={item.quantity === 0 ? true : false}
                                            />
                                        </label>
                                    ))
                                }
                            </form>
                        </div>
                        <div>
                        </div>
                        {
                            localStorage.getItem("role") !== "admin" &&
                            <div className='format-button'>
                                <div >
                                    <button onClick={() => handleAddToCart(1)}>BUY NOW</button>
                                </div>
                                <button className='cart' onClick={() => handleAddToCart(2)}>
                                    <FaCartPlus style={{ fontSize: "1.2rem" }} />
                                    <span className='btnadd'>ADD TO CART</span>
                                </button>
                            </div>
                        }
                        <div className='promotion'>
                            <div className='promotion-title'>
                                EXTRA OFFER
                            </div>
                            <div className='render-promotion'>
                                <ul style={{ listStyle: "none" }}>
                                    {
                                        promotion.map((item, index) => (
                                            <li key={index}>
                                                <a href="" >
                                                    {item}
                                                </a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div >
                    <div className='right-container'>
                        <div className='is-flex'>
                            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="box-on-stock-option"
                            >
                                <option value="">Tỉnh/Thành Phố</option>
                                {
                                    province.map((value) => (
                                        <option key={value.code} value={value.code}>{value.name}</option>
                                    ))
                                }
                            </select>
                            <select value={selectedDistrict} style={{ width: "43.7%" }} onChange={(e) => setSelectedDistrict(e.target.value)} className="box-on-stock-option"

                            >
                                <option value="">Quận/Huyện</option>

                                {
                                    district.map((value) => (
                                        <option key={value.code} value={value.code}>{value.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <p className='box-on-stock-count'>There are <strong>4</strong> stores with products</p>
                        <div className='box-on-stock-address'>
                            {
                                addressData.map((item, index) => (
                                    <div key={index} className="box-on-child">
                                        <div className='box-on-stock-item'>
                                            <div className='icon-cps'>
                                                <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"></path></svg>
                                            </div>
                                            <div className='phone'>
                                                <a>{item.phone}</a>
                                            </div>
                                            <div className='address'>
                                                <a href=''>
                                                    -
                                                    <svg style={{ marginRight: "5px" }} data-v-6d14a780="" height="15" fill='#0864c1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path data-v-6d14a780="" d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"></path></svg>
                                                    {item.address}
                                                </a>
                                            </div>
                                        </div></div>
                                ))
                            }

                        </div>
                        <div className='box-warranty-info'>
                            <div className='box-title'>
                                <p>Product information</p>
                            </div>
                            <div className='box-content'>
                                <div className='item-warranty'>
                                    <div>
                                        <FaMobileAlt />
                                    </div>
                                    <div className='item-warranty-description'>
                                        New, full accessories from the manufacturer
                                    </div>
                                </div>
                                <div className='item-warranty'>
                                    <div>
                                        <FaRegHandPointRight />
                                    </div>
                                    <div className='item-warranty-description'>
                                        12 months warranty at Genuine service center. 1 to 1 exchange in 30 days if there is a hardware defect from the manufacturer. <a style={{ color: "red" }} href="">(
                                            See details)</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className='review'>
                    <div>
                        <h4>Reviews & comments {productsById.data?.nameproducts}
                            {
                                productsById?.data?.size.map((size, index) => (
                                    <span key={index}> {size.namesize}</span>
                                ))
                            }
                        </h4>
                    </div>
                    {
                        listEvaluate.length > 0 || selectedStar !== null ? <div>
                            <div className='box-review'>
                                <div className='box-score'>

                                    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{averageRating.toFixed(2)}/5</p>

                                    <div style={{ display: "flex", gap: "0.8rem", height: "24px" }}>
                                        {renderStars(averageRating)}
                                    </div>

                                    <p style={{ textDecoration: "underline", color: "#1a94ff", fontWeight: "bold" }}>{statisticsOfReview.length} reviews</p>

                                </div>
                                <div className='box-star'>
                                    {
                                        [1, 2, 3, 4, 5].map((star, index) => {
                                            const starExistsInList = statisticsOfReview.some(value => value.starnumber.number === star);
                                            return (
                                                <div key={index} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                        <span style={{ fontWeight: "bold" }}>{star}</span>
                                                        <FaStar style={{ color: "#ffbf00", fontSize: "14px" }} />
                                                    </div>
                                                    <progress max={statisticsOfReview.length}
                                                        value={starExistsInList ? countStars({ starnumber: star }) / statisticsOfReview.length : 0}></progress>
                                                    <span style={{ fontSize: "14px" }}>
                                                        {starExistsInList ? countStars({ starnumber: star }) : 0} review
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className='box-experience'>
                                <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>Evaluation based on experience</div>
                                <div style={{ display: "flex", justifyContent: "space-between", lineHeight: "1.5" }}>
                                    <div>Performance</div>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            {renderStars(averagePerformance)}

                                        </div>
                                        <div style={{ fontWeight: "bold" }}>{averagePerformance.toFixed(2)}/5</div>
                                        <div>({statisticsOfReview.length})</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", lineHeight: "1.5" }}>
                                    <div>Battery life</div>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            {renderStars(averageBatteryLife)}
                                        </div>
                                        <div style={{ fontWeight: "bold" }}>{averageBatteryLife.toFixed(2)}/5</div>
                                        <div>({statisticsOfReview.length})</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", lineHeight: "1.5" }}>
                                    <div>Camera quanlity</div>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            {renderStars(averageCameraQuantity)}
                                        </div>
                                        <div style={{ fontWeight: "bold" }}>{averageCameraQuantity.toFixed(2)}/5</div>
                                        <div>({statisticsOfReview.length})</div>
                                    </div>
                                </div>
                            </div>


                            {
                                user[0]?.role !== 'admin'
                                    ? (
                                        <div className='button-review-container'>
                                            <div>
                                                <p style={{ margin: "0.4rem 0" }}>How do you rate this product?</p>
                                                <button
                                                    style={{
                                                        backgroundColor: "#1a94ff",
                                                        border: "none", borderRadius: "5px",
                                                        padding: "10px 30px",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        margin: "10px auto",
                                                        cursor: "pointer"
                                                    }} onClick={handleOpenModal}>
                                                    Evaluate now
                                                </button>
                                            </div>
                                        </div>

                                    )
                                    : null
                            }


                            <div>
                                <h3>Sort by</h3>
                                <ul style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                                    <li onClick={() => setSelectedStar(null)}
                                        style={{
                                            backgroundColor: selectedStar === null ? "#1a94ff" : "#fff",
                                            padding: "4px 12px",
                                            cursor: "pointer",
                                            borderRadius: "15px",
                                            border: " 1px solid #637381",
                                            listStyle: "none",
                                            color: selectedStar === null ? "#fff" : "#637381"
                                        }}
                                    >
                                        All
                                    </li>
                                    {
                                        listStar.map((star, index) => (
                                            <li onClick={() => setSelectedStar(star.number)} key={index}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    backgroundColor: selectedStar === star.number ? "#1a94ff" : "#fff",
                                                    padding: "4px 8px",
                                                    cursor: "pointer",
                                                    borderRadius: "15px",
                                                    border: " 1px solid #637381",
                                                }}>
                                                <p style={{ color: selectedStar === star.number ? "#fff" : "#637381" }}>{star.number}</p>
                                                <div>
                                                    {star.image}
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div>
                                <ul style={{ margin: "24px 0", listStyleType: "none" }}>
                                    {
                                        filteredEvaluations.length > 0 ? filteredEvaluations.map((evaluate, index) => (
                                            <li key={index} style={{
                                                borderBottom: "1px solid rgba(145,158,171,.239)", marginBottom: "15px", paddingBottom: "15px"
                                            }}>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    {/* {
                                                        console.log(evaluate)
                                                    } */}
                                                    <img
                                                        style={{ height: '32px', width: '32px', borderRadius: '50%' }}
                                                        src={evaluate ? listUser.filter((item) => item?.idusers === evaluate?.idusers)[0]?.avtuser : null}
                                                        alt=""
                                                    />

                                                    <div>
                                                        <div style={{ display: "flex", gap: "8px" }}>
                                                            <span style={{ fontWeight: "bold" }}>{evaluate?.lastname}</span>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                                                                <p>
                                                                    <AiOutlineClockCircle />
                                                                </p>
                                                                {dayjs(evaluate.evaluateday).format('YYYY/MM/DD  h:mm A')}
                                                            </div>
                                                        </div>
                                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", marginTop: "4px", color: "#229a16", fontWeight: "bolder" }}>
                                                            <div>
                                                                <AiOutlineClockCircle />
                                                            </div>
                                                            Purchased at TSP
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft: "40px", padding: "10px 15px 0 0" }}>
                                                    <div style={{ display: "flex", fontSize: "12px", gap: "10px", alignItems: "center" }}>
                                                        <div style={{
                                                            display: "flex",
                                                            borderRight: "1px solid rgba(145,158,171,.239)",
                                                            paddingRight: "10px"
                                                        }}>
                                                            {
                                                                Array.from({ length: 5 }).map((value, index) => {
                                                                    if (evaluate.starnumber.number - (index + 1) >= 0) {
                                                                        return (
                                                                            <FaStar key={index} style={{ color: "#ffbf00", fontSize: "14px" }} />
                                                                        )
                                                                    }
                                                                    return (
                                                                        <FaStar key={index} fill='rgba(145,158,171,.522)' style={{ fontSize: "14px" }} />
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div style={{
                                                            boxShadow: "0 0 0 0.5px rgba(145,158,171,.239)",
                                                            color: "#637381", padding: "3px 10px"
                                                        }}>{evaluate.performance.value}</div>
                                                        <div style={{
                                                            boxShadow: "0 0 0 0.5px rgba(145,158,171,.239)",
                                                            color: "#637381", padding: "3px 10px"
                                                        }}>
                                                            {evaluate.batterylife.value}
                                                        </div>
                                                        <div style={{
                                                            boxShadow: "0 0 0 0.5px rgba(145,158,171,.239)",
                                                            color: "#637381", padding: "3px 10px"
                                                        }}>
                                                            {evaluate.cameraquantity.value}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: "12px", marginTop: "15px" }}>
                                                        <p>
                                                            {evaluate.review}
                                                        </p>
                                                    </div>
                                                    <div style={{ marginTop: "15px", gap: "15px", display: "flex" }}>
                                                        {
                                                            evaluate.images.map((image, i) => (
                                                                <img key={i} style={{ borderRadius: "10px", height: "60px", maxHeight: "60px", objectFit: "cover", width: "60px" }} src={image} alt="" />
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        )) :
                                            <p style={{ margin: "0.4rem 0", textAlign: "center" }}>
                                                There are currently no satisfactory reviews.
                                            </p>
                                    }
                                </ul>
                            </div>
                        </div> :
                            <div className='button-review-container'>
                                <p style={{ margin: "0.4rem 0" }}>
                                    There are currently no reviews.
                                </p>
                                <p>
                                    Will you be the first to review this product?

                                </p>
                                <div >
                                    <button style={{ backgroundColor: "#1a94ff", border: "none", borderRadius: "5px", padding: "10px 30px", color: "white", fontWeight: "bold", margin: "10px auto", cursor: "pointer" }} onClick={handleOpenModal}>
                                        Evaluate now
                                    </button>
                                </div>
                            </div>
                    }

                </div>
                <div className='comment'>
                    <h3>Answer and Question</h3>
                    <form action="" style={{ margin: "12px 0" }} onSubmit={handleSubmitComments}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <img className='img-user' src={user ? user[0]?.avtuser : null} alt="" />
                            </div>
                            <div>
                                <textarea
                                    name='review'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{
                                        borderRadius: "8px",
                                        resize: "vertical",
                                        display: "block",
                                        boxShadow: "0 0 10px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15)",
                                        border: "0",
                                        padding: "8px",
                                        width: "650px"
                                    }}
                                    placeholder='Please leave your questions'
                                    required>
                                </textarea>
                            </div>
                            <div>
                                <button type='submit' style={{ border: "none", backgroundColor: "#1a94ff", color: "white", fontWeight: "bold", display: "flex", alignItems: "center", padding: "8px", cursor: "pointer", fontSize: "16px", borderRadius: "8px" }}>
                                    <AiOutlineSend size={24} />
                                    Send
                                </button>
                            </div>
                        </div>
                    </form>
                    {
                        listComment.map((value, index) => (
                            value.parentId === null &&
                            <ListComment comment={value} key={index} accessToken={accessToken} productsById={productsById} />
                        ))
                    }
                </div>
                {isModal &&
                    <ModalReview
                        getListEvaluate={getListEvaluate}
                        productsById={productsById}
                        isModal={isModal}
                        setIsModal={setIsModal}
                    />}

            </div >
        </>
    )
}

export default ProductsDetail