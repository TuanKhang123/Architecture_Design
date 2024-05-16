import React, { useEffect, useState } from 'react'
import "../forgotpassword/ForgotPassword.css"
import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../../components/feature/user/userSlice'
import { toast } from "react-toastify"
import Header from '../../components/header/Header'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch()

  const { success, message, isError } = useSelector(state => state.user)
  useEffect(() => {
    if (success) {
      toast(message)
    }
    if (isError) {
      toast(message)
      setEmail("")
    }
  }, [success, isError, message])

  const handleConfirm = (data) => {
    dispatch(forgotPassword(data))
  }

  return (
    <>
      <Header />
      <div className='grid-containerforgot'>
        <h1>Forgot Password</h1>
        <div className='grid-content'>
          <form action="">
            <div style={{ marginBottom: "1rem", position: "relative", width: "350px" }}>
              <input {...register("email")} type="email" placeholder='Email' name='email' value={email || ""} onChange={(e) => setEmail(e.target.value)} />
              <svg stroke="currentColor" fill="currentColor" style={{ position: "absolute", right: "5%", top: "30%" }} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
            </div>
          </form>
        </div>
        <div className='btn-cofirm'>
          <Link to="/changepassword">
            <button onClick={handleSubmit(handleConfirm)}>Confirm</button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword