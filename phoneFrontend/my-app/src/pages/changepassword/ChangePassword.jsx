import React, { useEffect, useState } from 'react'
import "../changepassword/ChangePassword.css"
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword } from '../../components/feature/user/userSlice'
import {toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'

const initial = {
  password: "",
  retypeNewPassword: ""
}

const ChangePassword = () => {
  const [state, setState] = useState(initial)
  const { password, retypeNewPassword } = state

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const { success } = useSelector(state => state.user)

  useEffect(() => {
    if (state) {
      navigate("/login")
    }
  }, [success])
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm()

  const dispatch = useDispatch()

  const submitForm = (data) => {
    if (data.password !== data.retypeNewPassword) {
      toast("Password is not match")
      setState("");
      return;
    }
    dispatch(changePassword(data))
  }
  return (
    <>
      
      <div className='grid-containerchange'>
        <h1>Change Password</h1>
        <div className='grid-content'>
          <form action="" >
            <div style={{ marginBottom: "1rem", width: "350px" }}>
              <input {...register("password")} type="password" placeholder='New Password' name='password' value={password || ""} onChange={handleInputChange} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input {...register("retypeNewPassword")} type="password" placeholder='Re-type New Password' name='retypeNewPassword' value={retypeNewPassword || ""} onChange={handleInputChange} />

            </div>
          </form>
        </div>
        <div className='btnChange'>
          <button onClick={handleSubmit(submitForm)}>Login</button>
        </div>
      </div></>
  )
}

export default ChangePassword
