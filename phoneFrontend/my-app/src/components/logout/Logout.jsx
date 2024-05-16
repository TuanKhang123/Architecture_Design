import React from 'react'
import "../logout/Logout.css"

import { useDispatch } from 'react-redux';
import { logout } from '../feature/user/userSlice';
import { useNavigate } from 'react-router-dom';


const Logout = (props) => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        props.callbackparent()
        dispatch(logout())
        navigation('/login')
    }

    return (
        <div className='logout'>
            <div className="logout__overlay">

            </div>
            <div className="logout__content">

                <h1 className='logout__content-title'>Do you want to exit your account?</h1>

                <div className='logout__content-body'>

                    <button className="logout__content-body-no" onClick={() => { props.callbackparent() }}>
                        No
                    </button>
                    <button className="logout__content-body-confirm" onClick={() => handleLogout()}>
                        Confirm
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Logout
