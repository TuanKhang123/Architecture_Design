import React, { useState, useEffect } from 'react'
import "./Orderinfo.css"
import Templatecart from '../../components/templatecart/Templatecart';
import Header from '../../components/header/Header'
import Statusorder from '../../components/statusorder/Statusorder'
import Totalcart from '../../components/totalcart/Totalcart'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../components/feature/user/userSlice';
import { setDataOrder } from '../../components/feature/cart/cartSlice';
import { useNavigate } from 'react-router-dom'

const Orderinfo = () => {

    const [province, setProvince] = useState([])
    const [district, setDistrict] = useState([])
    const [wards, setWards] = useState([])
    const dataUser = useSelector(state => state?.user)
    const [selectedProvince, setSelectedProvince] = useState()
    const [selectedDistrict, setSelectedDistrict] = useState()
    const [selectedWard, setSelectedWard] = useState()
    const { user, accessToken } = useSelector((state) => state?.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    // useEffect(() => {
    //     if (accessToken) {
    //         dispatch(getUser({ accessToken }))
    //     }
    // }, [accessToken])

    useEffect(() => {
        axios.get("https://vapi.vnappmob.com/api/province")
            .then((response) => {
                setProvince(response?.data?.results)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])
    useEffect(() => {
        if (dataUser?.user[0]?.province && province) {
            const checkPro = province.find(item => item?.province_name === dataUser?.user[0]?.province)
            if (checkPro)
                setSelectedProvince(checkPro?.code)
        }
    }, [province])

    // useEffect(() => {
    //     if (dataUser?.user[0]?.district && district) {

    //         const checkDis = district.find(item => item?.name === dataUser?.user[0]?.district)
    //         if (checkDis)
    //             setSelectedDistrict(checkDis?.code)

    //     }
    // }, [district])

    // useEffect(() => {
    //     if (dataUser?.user[0]?.wards && wards) {
    //         const checkWard = wards.find(item => item?.name === dataUser?.user[0]?.wards)
    //         if (checkWard)
    //             setSelectedWard(checkWard?.code)

    //     }
    // }, [wards])

    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
                .then((response) => {
                    setDistrict(response.data.results)
                }
                    
                )
                .catch(error => {
                    console.log(error);
                })
            setSelectedWard(0)
        }
    }, [selectedProvince])


    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`)
                .then((response) => {
                    setWards(response?.data?.results)
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [selectedDistrict])

    const handleOrder = (e) => {
        e?.preventDefault()
        console.log(e.target.firstname);
        const data = {
            firstname: e?.target?.firstname?.value,
            lastname: e?.target?.lastname?.value,
            phonenumber: e?.target?.phonenumber?.value,
            email: e?.target?.email?.value,
            province: province.filter((value) => {
                return value?.province_id === e?.target?.province?.value
            })[0]?.province_name,
            district: district.filter((value) => {
                return value?.district_id === e?.target?.district?.value
            })[0]?.district_name,
            wards: wards.filter((value) => {
                return value?.ward_id === e?.target?.wards?.value
            })[0]?.ward_name,
            detailaddress: e?.target?.detailaddress?.value
        }
        JSON.stringify(dispatch(setDataOrder(data)))
        localStorage.setItem("dataOrder", JSON.stringify(data))
        navigate("/detailbill")
    }
    

    return (
        <>
            <Header></Header>
            <Templatecart text__my='Order information' text__btn='CONTINUES' text_back='/cart'>
                <Statusorder />
                <form action="" onSubmit={handleOrder}>
                    <div className='order-info'>
                        <div className="order-info__customer">
                            <p className='customer__text'>Customer Information</p>
                            <div className='customer__personnal'>
                                <div className='name_user'>
                                    <input
                                        type="text"
                                        className='personnal__inp firstname__input'
                                        placeholder='Enter firstname'
                                        name='firstname'
                                        id='firstname'
                                        required
                                        defaultValue={user ? user[0]?.firstname : null} />
                                    <input
                                        type="text"
                                        className='personnal__inp lastname__input'
                                        placeholder='Enter lastname'
                                        name='lastname'
                                        id='lastname'
                                        required
                                        defaultValue={user ? user[0]?.lastname : null}
                                    />
                                </div>

                                <input
                                    type="text"
                                    className='personnal__inp phone__input'
                                    placeholder='Phone Number (obligatory)'
                                    id='phonenumber' name='phonenumber'
                                    required
                                    defaultValue={user[0]?.phonenumber} />
                                <input
                                    type="text"
                                    className='personnal__inp email__input'
                                    placeholder='Email'
                                    name="email"
                                    id='email'
                                    defaultValue={user[0]?.email}
                                    required />
                            </div>
                        </div>
                        <div className="order-info__delivery-method">
                            <p className='delivery-method__text'>Choose a delivery method</p>
                            <div className="delivery-method__choose">
                                <div className="choose__pick-up">
                                    <input name='method' type="radio" value="xxx" className='pick-up__input' checked />
                                    <label for="html" className='pick-up__text'>Pick up at the store</label>
                                </div>
                                <div className="choose__delivery">
                                    <input name='method' type="radio" value="yyy" className='delivery__input' />
                                    <label for="html" className='delivery__text'>Delivery</label>
                                </div>
                            </div>
                            <div className="delivery-method__address">
                                <div className='address__row mg-bt-5'>
                                    <select
                                        name="province"
                                        id="province"
                                        className='row__province row__common'
                                        required
                                        value={selectedProvince}
                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                    >

                                        <option value="">--Province--</option>
                                        {
                                            province?.map((value) => (
                                                <option
                                                    key={value?.province_id}
                                                    value={value?.province_id}
                                                    name={value?.province_name}>
                                                    {value?.province_name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <select
                                        name="district"
                                        id="district"
                                        className='row__district row__common'
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                    >
                                        <option value="">--District--</option>
                                        {
                                            district.map((value) => (
                                                <option key={value.district_id} value={value.district_id} name={value.district_name}>{value.district_name}</option>

                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='address__row'>
                                    <select name="wards" id="wards" className='row__wards row__common'
                                        value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} >
                                        <option value="">--Wards--</option>
                                        {
                                            
                                            wards?.map((value) => (
                                                <option key={value.ward_id} value={value.ward_id} name={value.ward_name}>{value.ward_name}</option>
                                            ))
                                        }
                                    </select>
                                    <input
                                        placeholder='Detailed address'
                                        name='detailaddress'
                                        id='detailaddress'
                                        type="text"
                                        className='detail__input'
                                        required
                                        defaultValue={dataUser?.user[0]?.address ? dataUser?.user[0]?.address : ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Totalcart text__btn='CONTINUES' handle__checkout={handleOrder} />
                </form>
            </Templatecart>
        </>
    )
}
export default Orderinfo
