import React, { useEffect, useRef } from "react"
import "../message/Message.css"
import { useSelector } from "react-redux"
import { Image } from "antd"

const Message = ({ message, flag }) => {
    const { userChat } = useSelector(state => state.chat)
    const { user } = useSelector(state => state.user)

    const ref = useRef()
    useEffect(() => {
        ref?.current?.scrollIntoView();
    }, [message])

    return (

        message?.text !== ""
            ? <div ref={ref} className="message" style={flag === 'user' ? { flexDirection: 'row' } : null}>
                <div className="messageInfo">
                    <img src={flag === 'user'
                        ? userChat
                            ? userChat?.avtuser
                            : null
                        : user
                            ? user[0]?.avtuser
                            : null
                    } alt="" />
                </div>
                <div className="messageContent" style={flag === 'user' ? { alignItems: 'start' } : null}>
                    <p className="messageContent-text" style={flag === 'admin' ? { color: "white", backgroundColor: '#1a94ff' } : null} >{message?.text}</p>
                    {
                        message?.img
                            ? <Image
                                width={300}
                                src={message ? message?.img : null}
                                style={{ marginTop: '10px' }}
                            />
                            : null
                    }
                </div>
            </div>
            : <div className="message" style={flag === 'user' ? { flexDirection: 'row' } : null}>
                <div className="messageInfo">
                    <img src={flag === 'user'
                        ? userChat
                            ? userChat?.avtuser
                            : null
                        : user
                            ? user[0]?.avtuser
                            : null
                    } alt="" />
                </div>
                <div className="messageContent" style={flag === 'user' ? { alignItems: 'start' } : null}>
                    {
                        message?.img
                            ? <Image
                                width={300}
                                src={message ? message?.img : null}
                                style={{ marginTop: '10px' }}
                            />
                            : null
                    }
                </div>
            </div>
    )
}

export default Message