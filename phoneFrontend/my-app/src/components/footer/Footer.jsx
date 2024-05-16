import React, { useEffect, useState } from 'react'
import "../footer/Footer.css"
import { FaGithub, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import axios from 'axios';

const Footer = () => {
  const [category, setCategory] = useState([])
  useEffect(() => {
    axios.get("http://localhost:8000/product/getcategory")
      .then(res => {
        setCategory(res.data)
      })
      .catch(error => console.log(error))

  }, [])

  return (
    <div className='f-wrapper'>

      <div className="f-wrapper__line">
      </div>

      <div className="f-wrapper__content">
        <div className="list-1">

          <div className="list-1__tspblack"></div>

          <a className="list-1__component" href=''>
            <FaGithub className='component__logo' />
            <p>Github</p>
          </a>

          <br />
          <a className="list-1__component" href=''>
            <FaFacebook className='component__logo' />
            <p>Facebook</p>
          </a>

          <br />
          <a className="list-1__component" href=''>
            <FaInstagram className='component__logo' />
            <p>Instagram</p>
          </a>

          <br />
          <a className="list-1__component" href=''>
            <FaYoutube className='component__logo' />
            <p>Youtube</p>
          </a>

        </div>

        <div className="list-2">
          <h2 className='list-2__title'>Products</h2>
          <div className='list-2__pro'>
            {
              category.map(value => (
                <p to={`/category/${value.idcate}`} className='related-tag' key={value.idcate}>
                  {value.namecate}
                </p>
              ))
            }
          </div>
        </div>

        <div className="list-3">
          <h2 className='list-3__title'>Contact</h2>

          <div className='list-3__title__item'>
            Email:
            <p className='list-3__title__email'> example@email.com</p>
          </div>
          <br />
          <p className='list-3__title__item'>Hotline: 1900 0000</p>
          <br />
          <p className='list-3__title__item'>Address: 540 ap Tay, Tan Thanh , Thanh Binh, Dong Thap</p>
        </div>
      </div>
    </div>


  )
}

export default Footer