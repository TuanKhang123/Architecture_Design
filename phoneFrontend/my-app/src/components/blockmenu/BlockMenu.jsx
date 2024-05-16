import React from 'react'
import "../blockmenu/BlockMenu.css"
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { BsCart3 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useState } from 'react';
import UserProfile from '../../components/userprofile/UserProfile'
import CreateDelivery from '../createdelivery/CreateDelivery';
import CreateNewPassword from '../createnewpassword/CreateNewPassword';
import Purchase from '../purchase/Purchase';
import Logout from '../logout/Logout';


const BlockMenu = () => {

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    }

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }
    return (
        <>
            <div className='block-menu'>
                <div onClick={() => toggleTab(1)}

                    className={toggleState === 1 ? "block-menu__item block-menu-active" : "block-menu__item"}
                >
                    <FaUserCircle className='block-menu__item-icon' />
                    <p className='block-menu__item-text'>User profile</p>
                </div>

                <div onClick={() => toggleTab(2)}
                    className={toggleState === 2 ? "block-menu__item block-menu-active" : "block-menu__item"}>
                    <MdOutlinePublishedWithChanges className='block-menu__item-icon' />
                    <p className='block-menu__item-text'>Change password</p>
                </div>

                <div onClick={() => toggleTab(3)}
                    className={toggleState === 3 ? "block-menu__item block-menu-active" : "block-menu__item"}>
                    <TbTruckDelivery className='block-menu__item-icon' />
                    <p className='block-menu__item-text'>Delivery address</p>
                </div>

                <div onClick={() => toggleTab(4)}
                    className={toggleState === 4 ? "block-menu__item block-menu-active" : "block-menu__item"}>
                    <BsCart3 className='block-menu__item-icon' />
                    <p className='block-menu__item-text'>Purchase</p>
                </div>

                <div onClick={() => {
                    toggleModal()
                }}
                    className={modal === true ? "block-menu__item block-menu-active" : "block-menu__item"}>
                    <FiLogOut className='block-menu__item-icon' />
                    <p className='block-menu__item-text'>Log out</p>
                </div>
            </div>

            {toggleState === 1 ? (<UserProfile />) : null}
            {toggleState === 2 ? (<CreateNewPassword />) : null}
            {toggleState === 3 ? (<CreateDelivery />) : null}
            {toggleState === 4 ? (<Purchase/>) : null}
            {modal === true ? (<Logout  callbackparent = {toggleModal}/>) : null}
        </>
    )
}

export default BlockMenu
