import React from 'react'
import "../userprofile/UserProfile.css"
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../feature/user/userSlice'
import { toast } from "react-toastify"
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const UserProfile = () => {

    const dispatch = useDispatch()
    const { user, accessToken } = useSelector(state => state?.user)
    const [name, setName] = useState('')
    const [dates, setDates] = useState([]);

    const [months, setMonths] = useState([]);
    const [monthchoose, setMonthChoose] = useState('');
    const [fileList, setFileList] = useState([]);

    const [years, setYears] = useState([]);
    const [yearchoose, setYearChoose] = useState('');

    const [inputDate, setInputDate] = useState()
    const [gender, setGender] = useState()

    const {
        register,
        setValue,
        handleSubmit,
        control,
        getValues,

    } = useForm()

    const getDate = (d) => {
        var tempdates = []
        for (var i = 1; i <= d; i++) {
            tempdates.push(i);
        }
        setDates(tempdates)
    }

    const getMonth = (m) => {
        var tempmonth = []
        for (var i = 1; i <= m; i++) {
            tempmonth.push(i);
        }
        setMonths(tempmonth)
    }

    const handleMonth = (e) => {
        switch (parseInt(e.target.value)) {
            case 0:
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                setMonthChoose(0)
                getDate(31);
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                setMonthChoose(1)
                getDate(30);
                break;
            case 2:
                setMonthChoose(2)
                checkLeapYear(yearchoose) ? getDate(29) : getDate(28);
                break;
        }
    }

    const uploadButton = (
        <div className='uploads_button'>
            <PlusOutlined className='uploads_button-icon' />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const isImageValid = (file) => {
        const acceptedFormats = ['.png', '.jpg'];
        const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
        return acceptedFormats.includes('.' + fileExtension.toLowerCase());
    };
    useEffect(() => {
        getDate(31)
        const getYear = () => {
            const temp = new Date();
            const yearcurr = temp.getFullYear();
            var tempYear = []
            for (var i = yearcurr; i >= 1890; i--) {
                tempYear.push(i);
            }
            setYears(tempYear)
        }
        getMonth(12)
        getYear()
        setInputDate()

    }, [])

    useEffect(() => {
        if (user) {
            setValue('firstname', user ? user[0]?.firstname : 0);
            setValue('lastname', user ? user[0]?.lastname : 0);
            setValue('email', user ? user[0]?.email : 0);
            setValue('phonenumber', user ? user[0]?.phonenumber : 0);

            setValue('date', user ? user[0]?.days : 0);
            setValue('month', user ? user[0]?.months : 0);
            setValue('year', user ? user[0]?.years : 0);
            setValue('gender', user && user[0]?.gender !== null ? user[0]?.gender : null);
            setFileList(user && user[0]?.avtuser
                ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: user[0]?.avtuser
                    }
                ]
                : []
            )
            setValue('avatar', user && user[0]?.avtuser
                ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        thumbUrl: user[0]?.avtuser
                    }
                ]
                : []
            )
        }
    }, [user])

    const checkLeapYear = (y) => {
        return ((y % 4 === 0) && (y % 100 !== 0 || y % 400 === 0)) ? true : false
    }

    const handleYear = (e) => {
        setYearChoose(parseInt(e.target.value))
        if (monthchoose === 2) {
            checkLeapYear(parseInt(e.target.value)) ? getDate(29) : getDate(28);
        }
    }

    const updateUser = async (data) => {
        console.log(data);

        const response = await axios.post(
            "http://localhost:8000/auth/user/updateUser",
            {
                firstName: data?.firstname,
                lastName: data?.lastname,
                avatar: data?.avatar[0]?.thumbUrl,
                email: data?.email,
                phonenumber: data?.phonenumber,
                gender: data?.gender,
                days: data?.date,
                months: data?.month,
                years: data?.year
            },
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
        return response
    }

    const handleUpdateProfile = async (data) => {
        // e.preventDefault();
        console.log(data);
        if (data?.date === '0' || data?.month === '0' || data?.year === '0')
            toast.error(
                'The date of birth has not been filled in',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        else {
            const res = await updateUser(data);
            if (res.status === 200) {
                dispatch(getUser(accessToken)).then((res) => {
                    toast.success(
                        'Successfully updated',
                        {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                        }
                    );
                })
            }
        }
    }
    return (
        <div className='userprofile'>
            <p className='userprofile__name'>{name}</p>

            <form action="" onSubmit={handleSubmit(handleUpdateProfile)}>
                <Controller
                    name="avatar" // Tên của trường trong data
                    control={control}
                    defaultValue={[]} // Giá trị mặc định của fileList
                    render={({ field }) => (
                        <>
                            <Upload
                                accept='.png, .jpg'
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-circle"
                                fileList={fileList}
                                customRequest={async ({ file, onSuccess, onError }) => {
                                    onSuccess();
                                }}
                                beforeUpload={(file) => {
                                    if (!isImageValid(file)) {
                                        toast.error(
                                            'Chỉ chấp nhận các file ảnh có định dạng .png hoặc .jpg',
                                            {
                                                position: 'top-right',
                                                autoClose: 3000,
                                                style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                                            }
                                        );
                                        return false;
                                    }
                                    return true;
                                }}
                                onChange={(info) => {
                                    const { fileList } = info;
                                    const validFiles = fileList.filter(file => isImageValid(file));
                                    setFileList(validFiles)
                                    field.onChange(validFiles);
                                }}
                                className='wrapper-upload'
                            >
                                {field?.value?.length >= 1 || fileList.length >= 1 ? null : uploadButton}

                            </Upload>

                            <div className='row-one'>
                                <div className='userprofile__form'>
                                    <label className='userprofile__form-text'>FIRST NAME</label>
                                    <input
                                        {...register('firstname')}
                                        name='firstname'
                                        placeholder='Add first name'
                                        className='userprofile__form-input'
                                        type="text"
                                        required
                                        defaultValue={user ? user[0]?.firstname : ''}
                                    />
                                </div>

                                <div className='userprofile__form'>
                                    <label className='userprofile__form-text'>LAST NAME</label>
                                    <input
                                        {...register('lastname')}
                                        name='lastname'
                                        placeholder='Add last name'
                                        defaultValue={user ? user[0]?.lastname : ''}
                                        className='userprofile__form-input'
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='userprofile__form'>
                                <label className='userprofile__form-text'>EMAIL</label>
                                <input
                                    placeholder='Add email'
                                    className='userprofile__form-input'
                                    type="text"
                                    name='email'
                                    defaultValue={user ? user[0]?.email : ''}
                                    {...register('email')}
                                    required
                                />
                            </div>

                            <div className='userprofile__form'>
                                <label className='userprofile__form-text'>PHONE NUMBER</label>
                                <input
                                    placeholder='Add phone number'
                                    className='userprofile__form-input'
                                    type="text"
                                    name='phonenumber'
                                    {...register('phonenumber')}
                                    defaultValue={user ? user[0]?.phonenumber : ''}
                                    required
                                />
                            </div>

                            <div className="userprofile__form">
                                <label className='userprofile__form-text'>GENDER</label>

                                <div className='userprofile__form-choose'>
                                    <div className="choose__male">
                                        <input
                                            name='gender'
                                            {...register('gender')}
                                            type="radio"
                                            value="Male"
                                            className='pick-up__input'
                                            onChange={e => setGender(e.target.value)}
                                        />
                                        <label htmlFor="html" className='pick-up__text'>Male</label>
                                    </div>

                                    <div className="choose__female">
                                        <input
                                            name='gender'
                                            type="radio"
                                            {...register('gender')}
                                            value="Female"
                                            className='delivery__input'
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label htmlFor="html" className='delivery__text'>Female</label>
                                    </div>
                                </div>
                            </div>

                            <div className='userprofile__form'>
                                <label className='userprofile__form-text'>DATE OF BIRTH</label>

                                <div className='userprofile__form-birth'>
                                    <select
                                        name="date"
                                        id="date-select"
                                        className='userprofile__form-birth-input'
                                        required
                                        {...register('date')}
                                    >
                                        <option value="0" placeholder=''>Date</option>
                                        {
                                            dates
                                                ? dates.map((date, index) => (
                                                    <option
                                                        key={index}
                                                        value={date}
                                                        placeholder=''
                                                        selected={
                                                            user ? user[0]?.days === date : false
                                                        }
                                                    >{date}</option>
                                                ))
                                                : null
                                        }
                                    </select>

                                    <select
                                        required
                                        name="month"
                                        id="month-select"
                                        className='userprofile__form-birth-input'
                                        {...register('month')}
                                        onChange={(e) => {
                                            handleMonth(e)
                                        }}>
                                        <option value="0" placeholder=''>Month</option>
                                        {
                                            months
                                                ? months.map((month, index) => (
                                                    <option
                                                        selected={
                                                            user ? user[0]?.months === month : false
                                                        }
                                                        key={index}
                                                        value={month}
                                                        placeholder=''>
                                                        {month}</option>
                                                ))
                                                : null
                                        }
                                    </select>

                                    <select
                                        required
                                        {...register('year')}
                                        name="year"
                                        id="year-select"
                                        className='userprofile__form-birth-input'
                                        onChange={(e) => {
                                            handleYear(e)
                                        }}>
                                        <option value='0' placeholder=''>Year</option>
                                        {
                                            years
                                                ? years.map((year, index) => (
                                                    <option
                                                        key={index}
                                                        value={year}
                                                        placeholder=''
                                                        selected={
                                                            user ? user[0]?.years === year : false
                                                        }
                                                    >{year}
                                                    </option>
                                                ))
                                                : null
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className='userprofile__form'>
                                <button type="submit" className='userprofile__form-update'>UPDATE INFOMATION</button>
                            </div>
                        </>
                    )}
                />
            </form>
        </div>
    )

}

export default UserProfile