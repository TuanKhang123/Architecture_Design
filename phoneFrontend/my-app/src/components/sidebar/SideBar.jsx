import React, { useEffect, useState } from 'react'
import "../sidebar/SideBar.css"
import { collection, query, where, getDoc, getDocs, doc, setDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getUsers } from '../feature/user/userSlice';
import { element } from 'prop-types';
import { changeUserChat } from '../feature/chat/chatSlice';


const SideBar = () => {

    const { user, listUser } = useSelector((state) => state.user)
    const { chatId } = useSelector(state => state.chat)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [chats, setChats] = useState([])


    const accessToken = localStorage.getItem('accessToken')

    const searchUsers = (e) => {
        setUserName(e?.target?.value)
    }

    const handleSearch = async () => {
        const q = query(collection(db, "adminChats"), where("displayName", "==", "Nguyen Admin"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }

    const handleKey = (e) => {
        (e.code === "Enter" || e.code === "NumpadEnter") && handleSearch()
    }

    // Giải thích: admiChats là toàn bộ những cái user đã chat với thằng đó
    // chats: sẽ tập hợp nhiều đoạn chat của từng cặp.

    const handleSelect = async (userChoose) => {
        console.log('?');
        // Check whether the group (chats in firestore) exist or not, if not create
        if (user && userChoose) {
            const combinedId =
                user[0]?.idusers > userChoose?.idusers
                    ? user[0]?.idusers.toString() + userChoose?.idusers.toString()
                    : userChoose?.idusers.toString() + user[0]?.idusers.toString()

            dispatch(changeUserChat({ combinedId, userChat: userChoose }))
            try {
                const res = await getDoc(doc(db, "chats", combinedId))

                if (!res.exists()) {
                    // create a chat in chats collection
                    await setDoc(doc(db, 'chats', combinedId), { messages: [] })

                    // create user chats
                    await updateDoc(doc(db, 'adminChats', user[0]?.idusers.toString()), {
                        [combinedId + ".userInfo"]: {
                            idusers: userChoose?.idusers.toString(),
                            displayName: userChoose?.lastname,
                            photoURL: userChoose?.avtuser
                        },
                        [combinedId + ".date"]: serverTimestamp(),
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }

        // create user chats
    }

    const handleClass = (combinedId, itemUser) => {

        let className = 'item__chat '

        if (combinedId === chatId)
            className += "item__chat-active";
        else if (itemUser[1]?.flagAdmin)
            className += "item__chat-new"

        return className;
    }
    useEffect(() => {
        if (user) {
            const getChats = () => {
                const unsub = onSnapshot(doc(db, "adminChats", user[0]?.idusers.toString()), (doc) => {
                    setChats(doc.data())
                });

                return () => {
                    unsub();
                }
            }
            user[0]?.idusers && getChats()
        }
    }, [user ? user[0]?.idusers : null])

    useEffect(() => {
        const checkNew = async () => {
            try {
                console.log(chatId);
                await updateDoc(doc(db, "adminChats", user[0]?.idusers.toString()), {
                    [chatId + ".flagAdmin"]: false
                });
            } catch (error) {
                console.log(error);
            }
        }
        checkNew()
    }, [chatId, chats])

    useEffect(() => {
        if (accessToken) {
            dispatch(getUser(accessToken))
            dispatch(getUsers(accessToken))

        }
    }, [])

    useEffect(() => {
        if (listUser) {
            handleSelect(listUser?.find(user => user?.role === 'user'))
        }
    }, [listUser])

    return (
        <div className='sidebar'>
            {/* <div className='sidebar__info'>
                <p >ChatBox</p>
                <div className="sidebar__info-user">
                    <img src={user ? user[0]?.avtuser : ''} alt="" />
                    <p>{user ? user[0]?.lastname : ''}</p>
                </div>
            </div> */}

            <div className='sidebar__search'>
                <input className='search-name' type="text" placeholder='Find a user' onKeyDown={handleKey} onChange={(e) => searchUsers(e)} />
            </div>
            {/* item.lastname?.toLowerCase().includes(userName.toLowerCase()) */}
            <div className='list__chat'>
                {

                    chats
                        ? (Object.entries(chats)
                            ?.filter(item => userName === "" ? true : (item[1]?.userInfo?.displayName?.toLowerCase().includes(userName.toLowerCase())))
                            ?.sort((a, b) => b[1]?.date - a[1]?.date)
                            ?.map((itemUser, index) => {
                                const combinedId =
                                    user[0]?.idusers > itemUser[1]?.userInfo?.idusers
                                        ? user[0]?.idusers.toString() + itemUser[1]?.userInfo?.idusers.toString()
                                        : itemUser[1]?.userInfo?.idusers.toString() + user[0]?.idusers.toString()
                                // const chat = Object.entries(chats)?.find(chat => chat[0] === combinedId)
                                const chat = listUser?.find(u => u?.idusers.toString() === itemUser[1]?.userInfo?.idusers.toString())
                                return (
                                    <div
                                        key={index}
                                        className={handleClass(combinedId, itemUser)}
                                        onClick={() => handleSelect(chat)}
                                    >
                                        <img src={chat ? chat?.avtuser : null} alt="" />

                                        <div className="info__friend">
                                            <p
                                                style={{ fontWeight: 600 }}
                                                className='name-friend'>
                                                {chat?.lastname}
                                            </p>

                                            <p
                                                style={{ fontSize: 14 }}
                                                className='last-message'>
                                                {itemUser[1]?.userInfo ? itemUser[1]?.lastMessage?.text : null}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }))
                        : null

                }

                {/* {
                    Object.entries(chats).map(item => console.log(item[1]?.userInfo?.displayName))

                } */}
            </div>
        </div >
    )
}

export default SideBar

// className={combinedId === chatId
//     ? Object.entries(chats)?.find(chat => chat[0] === chatId)
//         ? Object.entries(chats)?.find(chat => chat[0] === chatId)[1]?.flagAdmin
//             ? "item__chat item__chat-active item__chat-new"
//             : "item__chat item__chat-active"
//         : "item__chat item__chat-active"
//     : "item__chat"
// }