import React, { useEffect, useState } from 'react'
import "../headermanager/HeaderManager.css"
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logout } from "../feature/user/userSlice"
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Dropdown } from 'antd';
import { Image } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

const HeaderManager = (props) => {
  const { user } = useSelector((state) => state.user)

  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
  var itemsUser = [
    {
      key: '1',
      label: (
        <div className='wrapper-user'>
          <FiLogOut className='option__subnav-profile' />
          <a onClick={() => {
            dispatch(logout())
            navigate('/login')
          }}>Log out</a>
        </div>
      ),
    },

  ];


  useEffect(() => {
    if (accessToken) {
      dispatch(getUser(accessToken))
    }

    axios.get("http://localhost:8000/product/getcategory")
      .then(res => {
        setCategory(res.data)
      })
      .catch(error => console.log(error))
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className='header-manager'>
      <div className='container'>
        <div className="logo" onClick={() => navigate('/')}>
        </div>
        <p className='title'>Seller Channel</p>
      </div>

      <ul className="list-option">

        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate("/")}>
            <div className="option__icon-home option__home"></div>
            <p>Home</p>
          </a>
        </li>

        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate('/admin/chatdetail')}>
            <div className="option__icon option__chat"></div>
            <p>Chat</p>
          </a>
        </li>

        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate('/admin/productlist')}>
            <div className="option__icon option__product"></div>
            <p>Product</p>
          </a>
        </li>

        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate('/admin/dashboard')}>
            <div className="option__icon option__dashboard"></div>
            <p>Dashboard</p>
          </a>
        </li>


        <li className='list-option__item list-option__item-login'>
          {
            accessToken
              ?
              <div >
                {
                  <>
                    <Dropdown menu={{ items: itemsUser }} placement="bottom" arrow>
                      <Button className='dropdown-user'>
                        {/* <span className="option__icon-user option__user"></span> */}
                        <Image
                          src={user ? user[0]?.avtuser : null}
                          className='avatar_user'
                        />
                        {user && user.length > 0 ? user[0]?.lastname : "Login"}
                        <DownOutlined style={{ color: 'white' }} />
                      </Button>
                    </Dropdown>
                  </>
                }
              </div>
              :
              <a className='list-option__option list-option__login' href='/login'>
                <span className="option__icon-user option__user"></span>
                <p>Login</p>
              </a>
          }
        </li>
      </ul>
    </header>

  )
}

export default HeaderManager