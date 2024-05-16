import React, { useEffect, useState } from 'react'
import "../chat/Chat.css"
import { AiOutlineSend } from "react-icons/ai";
import Message from '../message/Message';
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { useSelector } from 'react-redux';
import { node } from 'prop-types';
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';

const Chat = () => {
    const [messages, setMessages] = useState([])
    const { user } = useSelector(state => state.user)
    const { userChat, chatId } = useSelector(state => state.chat)
    const [text, setText] = useState("")
    const [img, setImg] = useState(null)

    const handleKey = (e) => {
        (e.code === "Enter" || e.code === "NumpadEnter") && (handleSend())
    }

    const handleSend = async () => {
        if (user) {
            const id = uuid();
            if (img) {
                const storageRef = ref(storage, id);
                uploadBytes(storageRef, img)
                    .then((res) => {
                        getDownloadURL(storageRef)
                            .then((downloadURL) => {
                                updateDoc(doc(db, 'chats', chatId), {
                                    messages: arrayUnion({
                                        id: id,
                                        text,
                                        senderId: user[0]?.idusers,
                                        date: Timestamp.now(),
                                        img: downloadURL,
                                    })
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    })

            } else if (text !== '') {
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: id,
                        text,
                        senderId: user[0]?.idusers,
                        date: Timestamp.now(),
                    })
                })
            } else {
                toast.warn('Please enter a message', {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { backgroundColor: '#D7F1FD' },
                });
            }

            await updateDoc(doc(db, "adminChats", user[0]?.idusers.toString()), {
                [chatId + ".lastMessage"]: {
                    text,
                },
                [chatId + ".date"]: serverTimestamp(),
                [chatId + ".flagUser"]: true
            });
            setText('')
            setImg(null)
        }
    }
    useEffect(() => {

        if (chatId) {
            setText('')
            setImg(null)
            const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
                doc.exists() && setMessages(doc.data()?.messages)
            });
            return () => {
                unsub()
            }
        }

    }, [chatId])
    return (
        <div className='chat'>

            <div className='chat__with'>
                <img src={userChat ? userChat?.avtuser : null} alt="" />
                <div className="chat__with-right">
                    <p style={{ fontWeight: 600, fontSize: 18 }}>{`Chat with ${userChat ? userChat?.lastname : null}`}</p>
                </div>
            </div>

            <div className="chat__boxchat">

                <div className="list-message">
                    {
                        messages
                            ? messages?.map((m, index) => {
                                return (
                                    m?.senderId === user[0].idusers
                                        ? <Message message={m} key={index} flag='admin' />
                                        : <Message message={m} key={index} flag='user' />
                                )
                            })
                            : null
                    }
                </div>
                <div
                    className="input-message"
                >
                    <input
                        onChange={e => setText(e.target.value)}
                        required={true}
                        type="text"
                        value={text}
                        placeholder={userChat ? `Send message to ${userChat ? userChat?.lastname : null}` : `Send message to ..`}
                        onKeyDown={handleKey}
                    />

                    <input
                        className='input-img'
                        type="file" id='file'
                        style={{ display: "none" }}
                        onChange={e => setImg(e.target.files[0])} />

                    <label className='input-message__img' style={{ width: "20px", height: "20px" }} htmlFor="file">
                        <img style={{ width: "20px", height: "20px" }} src="/uploadimage.png" alt="" />
                    </label>


                    <AiOutlineSend className='icon__send' onClick={() => handleSend()} />

                </div>

            </div>
        </div>
    )
}

export default Chat