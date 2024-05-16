import React from 'react'
import "../chatdetail/ChatDetail.css"
import Chat from '../../components/chat/Chat'
import SideBar from '../../components/sidebar/SideBar'
import Header from '../../components/header/Header'
import HeaderManager from '../../components/headermanager/HeaderManager'

const ChatDetail = () => {
    return (
        <>
            <HeaderManager />
            <div className='chatdetail'>
                <SideBar />
                <Chat />
            </div>
        </>
    )
}

export default ChatDetail