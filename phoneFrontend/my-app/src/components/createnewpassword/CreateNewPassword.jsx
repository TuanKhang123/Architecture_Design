import React, { useEffect } from 'react'
import "../createnewpassword/CreateNewPassword.css"
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createNewPassword, reset } from '../feature/user/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateNewPassword = () => {
    var [newUser, setNewUser] = useState({ curpass: '', newpass: '', confirmpass: '', })
    const accessToken = localStorage.getItem('accessToken');
    const dispatch = useDispatch();
    const message = useState('')

    useEffect(() => {
        dispatch(reset())
    }, [])

    const createNewPassword = async () => {
        const response = await axios.post(
            "http://localhost:8000/auth/user/createnewpassword",
            {
                curpass: newUser.curpass,
                newpass: newUser.newpass,
            },
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        )
            .then((result) => {
                toast.success(
                    result.data.message,
                    {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                    }
                );
            })
            .catch(error => {
                toast.error(
                    error.response.data.message,
                    {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                    }
                );
            })
    }

    const handleCreateNewPassWord = (e) => {

        e.preventDefault();

        if (newUser.curpass === newUser.newpass)
            toast.error(
                'Current password must be different from newpassword',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        else if (newUser.newpass !== newUser.confirmpass)

            toast.error(
                "Confirm password isn't the same new password",
                {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#DEF2ED' },
                }
            );
        else
            createNewPassword();
    }

    return (
        <>
            <div className='createnewpassword'>
                <p className='createnewpassword__name'>CREATE NEW PASSWORD</p>

                <form action="" onSubmit={handleCreateNewPassWord}>
                    <div className='userprofile__form'>
                        <label className='userprofile__form-text'>CURRENT PASSWORD</label>
                        <input type='password' required onChange={e => { setNewUser({ ...newUser, curpass: e.target.value }) }} placeholder='Add current password' className='userprofile__form-input' name='username' />
                    </div>

                    <div className='userprofile__form'>
                        <label className='userprofile__form-text'>NEW PASSWORD</label>
                        <input type='password' required onChange={e => { setNewUser({ ...newUser, newpass: e.target.value }) }} placeholder='Add new password' className='userprofile__form-input' name='username' />
                    </div>

                    <div className='userprofile__form'>
                        <label className='userprofile__form-text'>CONFIRM NEW PASSWORD</label>
                        <input type='password' required onChange={e => { setNewUser({ ...newUser, confirmpass: e.target.value }) }} placeholder='Confirm new password' className='userprofile__form-input' name='username' />
                    </div>

                    <div className='userprofile__form'>
                        <button type="submit" className='userprofile__form-update'>UPDATE INFOMATION</button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default CreateNewPassword