import React, { useEffect, useState } from 'react'
import "../adminregister/AdminRegister.css"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header/Header'
import { Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import Chat from '../../components/chat/Chat'



const initial = {
    firstname: "",
    lastname: "",
    phonenumber: "",
    password: "",
    retypepassword: ""
}

const AdminRegister = () => {

    const [state, setState] = useState(initial)
    const { register, handleSubmit, control } = useForm()
    const [fileList, setFileList] = useState([]);
    const { firstname, lastname, email, password, retypepassword } = state
    const navigate = useNavigate()
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setState({ ...state, [name]: value })
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

    // UseEffect dùng cho Firebase
    useEffect(() => {

    }, [])


    const submitForm = async (data) => {

        // try {
        //     const email = data?.email;
        //     const displayName = data?.lastname;
        //     const file = data?.avatar[0]?.thumbUrl;
        //     const res = await createUserWithEmailAndPassword(auth, data?.email, data?.password)
        //     const storageRef = ref(storage, displayName);
        //     const uploadTask = uploadBytesResumable(storageRef, file);

        //     const createAdminChats = await setDoc(doc(db, "adminChats", res?.user?.uid), {
        //         uid: res?.user?.uid,
        //         displayName,
        //         email,
        //     })

        // uploadTask.on(
        //     (error) => {
        //         console.log(error);
        //     },
        //     () => {
        //         console.log('abc');
        //         getDownloadURL(uploadTask.snapshot.ref)
        //             .then(async (downloadURL) => {
        //                 await updateProfile(res.user, {
        //                     displayName,
        //                     photoURL: downloadURL,
        //                 })

        //                 await setDoc(doc(db, "users", res?.user?.uid), {
        //                     uid: res?.user?.uid,
        //                     displayName,
        //                     email,
        //                     photoURL: downloadURL,
        //                 })

        //                 // await setDoc(doc(db, "userChats", res?.user?.uid), {

        //                 // })
        //             })
        //             .catch((error) => {
        //                 console.log(error);
        //             })

        //     }
        // );

        // } catch (error) {
        //     console.log(error);
        // }


        if (data?.password !== data?.retypepassword) {
            toast.error(
                'Password is not match',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        }
        else {
            await axios.post(
                "http://localhost:8000/auth/admin/register",
                {
                    avatar: data?.avatar[0]?.thumbUrl,
                    firstname: data?.firstname,
                    lastname: data?.lastname,
                    email: data?.email,
                    password: data?.password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then(async (res) => {
                    const email = data?.email;
                    const displayName = data?.firstname + ' ' + data?.lastname;
                    await setDoc(doc(db, "adminChats", res?.data?.idAdmin.toString()), {})
                    toast.success(
                        'Successfully register',
                        {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                        }
                    );
                    navigate("/login")
                })
        }
    }

    return (
        <>
            <Header />
            <div className='admin-register' >
                <h1>Amin Register</h1>
                <div className='grid-content'>

                    <form onSubmit={handleSubmit(submitForm)}>
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
                                        {field?.value?.length >= 1 ? null : uploadButton}
                                    </Upload>

                                    <div className='row-one'>
                                        <input
                                            {...register('firstname')}
                                            name='firstname'
                                            type="text"
                                            placeholder='First Name'
                                            onChange={handleInputChange}
                                            required />
                                        <input
                                            {...register('lastname')}
                                            name='lastname'
                                            type="text"
                                            placeholder='Last Name'
                                            onChange={handleInputChange}
                                            required />
                                    </div>

                                    <div className='row-two'>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder='Email'
                                            name='email'
                                            onChange={handleInputChange}
                                            required />
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                                    </div>
                                    <div className='row-three'>
                                        <input
                                            {...register('password')}
                                            type="password"
                                            placeholder='Password'
                                            name='password'
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <div className='row-four'>
                                        <input
                                            {...register('retypepassword')}
                                            type="password"
                                            placeholder='Retype Password'
                                            name='retypepassword'
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <p className='row-five'>By Confirming, you agree to the <span>terms of use</span></p>
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
                        <FaFacebook className='iconFace' />
                        <p >Facebook</p>
                    </div>
                    <div className='format'>
                        <FaGoogle className='iconGoogle' />
                        <p >Google</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminRegister;