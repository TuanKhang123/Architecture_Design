import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from "react-icons/io"
import { IoIosSend } from "react-icons/io";
import "../popupchat/PopupChat.css"
import { db, storage } from '../../firebase';
import { v4 as uuid } from 'uuid'
import { Image } from 'antd';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';


const PopupChat = (props) => {
    const { user } = useSelector((state) => state.user)
    const { setIsPopupChat } = props
    const messageContainerRef = useRef(null)
    const [messages, setMessages] = useState([]);
    const [img, setImg] = useState(null)
    const [text, setText] = useState("")

    useEffect(() => {
        if (props?.combinedId) {
            const unsub = onSnapshot(doc(db, "chats", props?.combinedId), (doc) => {
                doc.exists() && setMessages(doc.data()?.messages)
            });
            return () => {
                unsub()
            }
        }
    }, [props?.combinedId])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCloseModalChat = () => {
        setIsPopupChat(false)
    }

    const scrollToBottom = () => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSend();
        scrollToBottom();
    }

    const handleSend = async () => {
        if (user) {
            const id = uuid();
            if (img) {
                const storageRef = ref(storage, id);
                console.log(storageRef);

                uploadBytes(storageRef, img)
                    .then((res) => {
                        getDownloadURL(storageRef)
                            .then((downloadURL) => {
                                updateDoc(doc(db, 'chats', props?.combinedId), {
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
                await updateDoc(doc(db, "chats", props?.combinedId), {
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

            await updateDoc(doc(db, "adminChats", props?.accountAdmin?.idusers.toString()), {
                [props?.combinedId + ".lastMessage"]: {
                    text,
                },
                [props?.combinedId + ".date"]: serverTimestamp(),
                [props?.combinedId + ".flagAdmin"]: true,
            });
            setText('')
            setImg(null)
        }
    }
    return (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: "99999", backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ width: "350px", height: "480px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)", borderRadius: "8px" }}>
                <div style={{ width: "350px", height: "60px", backgroundColor: "#1a94ff", borderRadius: "8px 8px 0 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "0" }}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", paddingLeft: "15px" }}>
                            <img style={{ width: "32px", height: "32px", borderRadius: "50%" }} src={props?.accountAdmin ? props?.accountAdmin?.avtuser : null}></img>
                            <div style={{ color: "#fff" }}>
                                <h4>{props?.accountAdmin?.lastname}</h4>
                            </div>
                        </div>
                        <div style={{ padding: "16px", cursor: "pointer" }} onClick={handleCloseModalChat}>
                            <IoMdClose style={{ color: "#fff", fontSize: "24px" }} />
                        </div>
                    </div>
                    <div ref={messageContainerRef} style={{ overflowY: "scroll", overflowX: "hidden", height: "360px" }} className='custom-scroll'>
                        {
                            messages
                                ? messages?.map((message, index) => (
                                    message?.senderId === user[0]?.idusers
                                        // phải
                                        ? (
                                            <div key={index} style={{ display: "flex", alignItems: "flex-end", padding: "8px", flexDirection: 'column', gap: '5px' }}>
                                                <div style={{ flex: "1" }}></div>
                                                {
                                                    message?.text !== ''
                                                        ? (
                                                            <div style={{ maxWidth: "72%", wordWrap: "break-word", padding: "8px", borderRadius: "12px", backgroundColor: "#1a94ff", color: "white" }}>
                                                                {message?.text}
                                                            </div>
                                                        )
                                                        : null
                                                }
                                                {
                                                    message?.img
                                                        ?
                                                        <Image
                                                            width={200}
                                                            src={message?.img ? message?.img : null}
                                                            style={{ marginTop: '10px' }}
                                                        />
                                                        : null
                                                }
                                            </div>
                                        )
                                        // trái
                                        : (
                                            <div key={index} style={{ display: "flex", alignItems: "flex-end", padding: "8px", alignItems: 'start' }}>
                                                <div>
                                                    <img style={{ width: "32px", height: "32px", borderRadius: "50%" }} src={props?.accountAdmin?.avtuser} alt="" />
                                                </div>
                                                <div style={{ flex: "1", marginLeft: "8px" }}>
                                                    {
                                                        message?.text
                                                            ? <p style={{ backgroundColor: "#F1F4F7", width: 'fit-content', maxWidth: '70%', wordWrap: "break-word", padding: "8px", borderRadius: "12px" }}>
                                                                {message.text}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        message?.img
                                                            ?
                                                            <Image
                                                                width={200}
                                                                src={message?.img ? message?.img : null}
                                                                style={{ marginTop: '10px' }}
                                                            />
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        )
                                ))
                                : null
                        }

                    </div>
                    <form
                        onSubmit={handleSubmitForm}
                        style={{ position: "absolute", bottom: "0", left: "0", width: "100%" }}
                    >
                        <div
                            style={{ display: "flex", alignItems: "center", padding: "8px" }}>
                            <div
                                style={{ background: "#fff", width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #D3D3D3", display: "flex", alignItems: 'center', gap: '7px' }}>
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    style={{ border: "none", outline: "none", flex: "1", marginLeft: "4px" }}
                                    type="text"
                                    placeholder='Enter a message'
                                />

                                <input
                                    className='input-img'
                                    type="file" id='file'
                                    style={{ display: "none" }}
                                    onChange={e => setImg(e.target.files[0])} />

                                <label className='input-message__img' style={{ width: "20px", height: "20px" }} htmlFor="file">
                                    <img style={{ width: "20px", height: "20px" }} src="/uploadimage.png" alt="" />
                                </label>


                                <button
                                    style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                                >
                                    <IoIosSend style={{ fontSize: "24px", color: "#1a94ff" }} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default PopupChat