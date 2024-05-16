import React, { useEffect, useState } from 'react'
import "../header/Header.css"
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logout } from "../feature/user/userSlice"
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { BsList } from "react-icons/bs"
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Dropdown } from 'antd';
import { Image } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons'

const Header = (props) => {
  const { quantityCart } = useSelector((state) => state.cart);
  const check = useSelector((state) => state.cart);

  const { user, listUser } = useSelector((state) => state.user)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
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

  var itemsCate = category.map(item => (
    {
      key: item.idcate,
      label: (
        <a href={`http://localhost:3000/category/${item.idcate}`} >
          {item.namecate}
        </a>
      )
    }
  ))

  var itemsUser = [
    {
      key: '1',
      label: (
        <div className='wrapper-user'>
          <FaUserCircle className='option__subnav-profile' />
          <a onClick={() => { navigate('/profile') }}>My profile</a>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className='wrapper-user'>
          <BsList className='option__subnav-profile' />
          <a onClick={() => { navigate('/listfavourite') }} >Favourite</a>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className='wrapper-user'>
          <FiLogOut className='option__subnav-profile' />
          <a onClick={() => {
            navigate('/')
            dispatch(logout())
          }}>Log out</a>
        </div>
      ),
    },

  ];

  return (
    <header className='header'>
      <div className='container-search'>
        <div className="logo" onClick={() => navigate("/")}>
        </div>

        <div className="search">
          <FaSearch className="search__icon-search" />
          <input onChange={(e) => props.parentCallback(e.target.value)} className='search__input-search' type="text" placeholder="Find what that on Smartphone..." />
        </div>
      </div>



      <ul className="list-option">
        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate("/admin/register")}>
            <div className="option__icon-seller option__seller"></div>
            <p>Seller Channel</p>
          </a>
        </li>

        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate("/")}>
            <div className="option__icon-home option__home"></div>
            <p>Home</p>
          </a>
        </li>

        <li>
          <div>
            <Dropdown menu={{ items: itemsCate }} placement="bottom" arrow>
              <Button className='dropdown-phone'>
                <DownOutlined />
                Phone
              </Button>
            </Dropdown>
          </div>
        </li>
        <li className='list-option__item'>
          <a className='list-option__option' onClick={() => navigate("/cart")}>
            <div className="option__icon-cart option__cart option_contain-circle">
              <div className="circle-yellow">{quantityCart}</div>
            </div>
            <p>Cart</p>
          </a>
        </li>


        {
          (accessToken)
            ?
            <li className='list-option__item-login'>
              <div >
                {
                  <>
                    <Dropdown menu={{ items: itemsUser }} placement="bottom" arrow>
                      <Button className='dropdown-user'>
                        <Image
                          src={user ? user[0]?.avtuser : null}
                          className='avatar_user'
                        />
                        <span className='dropdown-name'>{user && user?.length > 0 ? user[0]?.lastname : "Login"}</span>
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </>
                }
            </div>
            </li>

            :

            <li className='list-option__item'>
              <a className='list-option__option list-option__login' href='/login'>
                <span className="option__icon-user option__user"></span>
                <p>Login</p>
              </a>
            </li>
        }


        {/* <li className='list-option__item-login'>
          <a className='list-option__option list-option__login'>
            <span className="option__icon-user option__user"></span>
            <p className='list-option__login-name'>{user && user.length > 0 ? user[0].fullname : "Login"}</p>
            <div className="option__icon-arrow-user option__phone">
            </div>
          </a>
          {
            <ul className='option__subnav option__subnav-pro'>
              <li>
                <FaUserCircle className='option__subnav-profile' />
                <a href="/profile">My profile</a>
              </li>
              <li>
                <FiLogOut />
                <a href="" onClick={() => dispatch(logout())}>Log out</a>
              </li>
            </ul>
          }
        </li> */}

      </ul>
    </header>

  )
}

export default Header