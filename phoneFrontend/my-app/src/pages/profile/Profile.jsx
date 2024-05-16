import React from 'react'
import "../profile/Profile.css"
import BlockMenu from "../../components/blockmenu/BlockMenu"
import Header from "../../components/header/Header"
import Fotter from "../../components/footer/Footer"

const Profile = () => {
    return (
        <div>
            <Header />
            <div className='profile'>

                <BlockMenu />
                
            </div>
            <Fotter />
        </div>
    )
}

export default Profile

