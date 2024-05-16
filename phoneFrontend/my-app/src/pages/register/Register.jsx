import React, { useEffect, useState } from 'react'
import "../register/Register.css"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from "react-redux"
import { registerUser, reset } from '../../components/feature/user/userSlice'
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/header/Header'
import { PlusOutlined } from '@ant-design/icons'
import { Upload } from 'antd'

const initial = {
    firstname: "",
    lastname: "",
    fullname: "",
    phonenumber: "",
    email: "",
    password: "",
    retypepassword: ""
}

const Register = () => {
    const navigate = useNavigate()
    const [state, setState] = useState(initial)
    const dispatch = useDispatch()
    const { register, handleSubmit, control } = useForm()
    const { firstname, lastname, phonenumber, email, password, retypepassword } = state
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setState({ ...state, [name]: value })
    }

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        dispatch(reset())
    }, [])

    const submitForm = (data) => {
        if (data.password !== data.retypepassword) {
            toast.error(
                'Password is not match',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
            setState("")
            return;
        }
        data.email = data.email.toLowerCase();
        dispatch(registerUser(data)).then(async (res) => {
            console.log(res);
            if (res?.payload?.success) {
                toast.success(
                    'Register successfully',
                    {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                    }
                );
                
                // await setDoc(doc(db, "userChats", res?.user?.uid), {})

                navigate("/login")
            }
            else {
                toast.error(
                    'Register fail',
                    {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                    }
                );
            }
        })
    }

    const isImageValid = (file) => {
        const acceptedFormats = ['.png', '.jpg'];
        const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
        return acceptedFormats.includes('.' + fileExtension.toLowerCase());
    };

    const uploadButton = (
        <div className='uploads_button'>
            <PlusOutlined className='uploads_button-icon' />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Header />
            <div className='grid-containerregis'>
                <h1>Register</h1>
                <div className='grid-content'>
                    <form onSubmit={handleSubmit(submitForm)}>
                        <Controller

                            name="avatar" // Tên của trường trong data
                            control={control}
                            defaultValue={[]} // Giá trị mặc định của fileList
                            render={({ field }) => (
                                <>
                                    <Upload
                                        required
                                        accept='.png, .jpg'
                                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                        listType="picture-circle"
                                        fileList={fileList}
                                        customRequest={async ({ file, onSuccess, onError }) => {
                                            onSuccess();
                                        }}
                                        help={fileList?.length === 0 ? 'Hãy tải lên một hình ảnh' : null}
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
                                        {field?.value?.length >= 1 ? null : uploadButton}
                                    </Upload>

                                    <div className='row-one'>
                                        <input
                                            {...register('firstname')}
                                            name='firstname'
                                            type="text"
                                            placeholder='First Name'
                                            value={firstname || ""}
                                            onChange={handleInputChange}
                                            required />
                                        <input
                                            {...register('lastname')}
                                            name='lastname'
                                            type="text"
                                            placeholder='Last Name'
                                            value={lastname || ""}
                                            onChange={handleInputChange}
                                            required />
                                    </div>

                                    <div className='row-two'>
                                        <input
                                            {...register('phonenumber')}
                                            type="text"
                                            placeholder='Phone Number'
                                            name='phonenumber'
                                            value={phonenumber || ""}
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <div className='row-three'>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder='Email'
                                            name='email'
                                            value={email || ""}
                                            onChange={handleInputChange}
                                            required />
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            viewBox="0 0 24 24"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                                    </div>
                                    <div className='row-four'>
                                        <input

                                            {...register('password')}
                                            type="password"
                                            placeholder='Password'
                                            name='password'
                                            value={password || ""}
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <div className='row-five'>
                                        <input
                                            {...register('retypepassword')}
                                            type="password"
                                            placeholder='Retype Password'
                                            name='retypepassword'
                                            value={retypepassword || ""}
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <p className='row-six'>By Confirming, you agree to the <span>terms of use</span></p>
                                    <div className='btn-confirm'>
                                        <button type='submit'>Confirm</button>
                                    </div>
                                </>
                            )}
                        />
                    </form>
                </div>
                <div className='icon'>
                    <div className='format'>
                        <FaFacebook className='icon-face' />
                        <p >Facebook</p>
                    </div>
                    <div className='format'>
                        <FaGoogle className='icon-google' />
                        <p >Google</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register