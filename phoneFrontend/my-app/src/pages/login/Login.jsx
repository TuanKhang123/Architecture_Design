import React, { useEffect, useState } from 'react'
import "../login/Login.css"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import Hiden from '../../components/hiden/Hiden'
import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../components/feature/user/userSlice'
import { toast } from "react-toastify"
import Header from '../../components/header/Header'


const Login = () => {
    const navigate = useNavigate()
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [typePassword, setTypePassword] = useState("password")
    const { register, handleSubmit } = useForm()
    const dispatch = useDispatch()

    const submitForm = (data) => {
        dispatch(loginUser(data))
            .then((res) => {
                if (res?.payload && res?.payload?.role === 'user') {
                    navigate("/")
                    toast.success(
                        'Login Successfully',
                        {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                        }
                    );
                    localStorage.setItem("role", res?.payload?.role)
                }
                else if (res?.payload && res?.payload?.role === 'admin') {
                    navigate("/")
                    toast.success(
                        'Login Successfully',
                        {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                        }
                    );
                    localStorage.setItem("role", res?.payload?.role)

                } else if (res?.payload === undefined) {
                    toast.error(
                        "Login failed",
                        {
                            position: 'top-right',
                            autoClose: 3000,
                            style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                        }
                    );
                    setInputEmail("")
                    setInputPassword("")
                }
            })
    }

    return (
        <>
            <Header />
            <div className='grid-containerlogin'>
                <h1>Login</h1>
                <div className='grid-content'>
                    <form action="">
                        <div className='row-one'>
                            <input {...register("email")} type="email" placeholder='Email' name='email' value={inputEmail || ""} onChange={(e) => setInputEmail(e.target.value)} required />
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>

                        </div>
                        <div >
                            <input {...register("password")} type={typePassword} placeholder='Password' name='password' value={inputPassword || ""}
                                onChange={(e) => {
                                    setInputPassword(e.target.value)
                                }} />
                        </div>
                    </form>
                    <Hiden typePassword={typePassword} setTypePassword={setTypePassword} />
                </div>
                <div className='link'>
                    <a href="/forgotpassword">Forgot Password?</a>
                    <a href="/register">Register</a>
                </div>
                <div className='btn-login'>
                    <button onClick={handleSubmit(submitForm)}>Login</button>
                </div>
                <div className='icon'>
                    <div className='format'>
                        <FaFacebook className='icon-face' />
                        <p >Facebook</p>
                    </div>
                    <div className='format'>
                        <FaGoogle className='icon-google' />
                        <p>Google</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login