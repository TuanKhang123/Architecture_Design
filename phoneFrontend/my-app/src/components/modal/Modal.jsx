import React, { useEffect, useState } from 'react'
import "../modal/Modal.css"
import { FaPlus, FaTrash } from "react-icons/fa"
import { useReducer } from 'react'

// ACTION
const NEW_ITEM = "new_item"
const DELETE_ITEM = "delete_item"
const CHANGE_NAME_COLOR = "change_name_color"
const CHANGE_QUANTITY_COLOR = "change_quantity_color"

// Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case NEW_ITEM:
            return {
                ...state, [Date.now().toString()]: {
                    namecolor: "",
                    quantity: ""
                }
            }
        case CHANGE_NAME_COLOR:
            return {
                ...state, [action.payload.key]: {
                    namecolor: action.payload.data,
                    quantity: state[action.payload.key]["quantity"]
                }
            }
        case CHANGE_QUANTITY_COLOR:
            return {
                ...state, [action.payload.key]: {
                    quantity: action.payload.data,
                    namecolor: state[action.payload.key]["namecolor"]
                }
            }
        case DELETE_ITEM:
            delete state[action.payload.key]
            return { ...state }

        default:
            return state
    }
}

// map ooj to arr
const objToArray = (obj, fn) => {
    const res = [];
    for (const key in obj) {
        res.push(fn(obj[key], key));
    }
    return res;
}

const Modal = ({ size, setOpenModal, onSubmit }) => {
    // dispatch
    // Object.assign({}, [] => Initial State.
    const [array, dispatch] = useReducer(reducer, Object.assign({}, size ? size.color : []))
    const [data, setData] = useState({
        idsize: size ? size.idsize : "",
        namesize: size ? size.namesize : "",
        pricesize: size ? size.pricesize : ""
    })
    const { namesize, pricesize } = data

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleUnit = (e) => {
        e.preventDefault()
        // Map obj to array
        const res = objToArray(array, (value, key) => value)
        onSubmit({
            ...data,
            color: res
        })
        setOpenModal(false)
    }

    return (
        <div className='modal'>
            <div className='modal-container'>

                <div>
                    <p>Form Adding</p>
                    <form action="" onSubmit={handleUnit}>
                        <div className='name-size'>
                            <label htmlFor="">Name Size:</label>
                            <input type="text" value={namesize} name='namesize' onChange={handleOnChange} required />
                        </div>
                        <div className='price-size'>
                            <label htmlFor="">Price Size:</label>
                            <input type="text" value={pricesize} name='pricesize' onChange={handleOnChange} required />
                        </div>
                        <div className='plus'>
                            <label htmlFor="">Color:</label>
                            <button onClick={(e) => {
                                e.preventDefault()
                                dispatch({
                                    type: NEW_ITEM
                                })
                            }}>
                                <FaPlus />
                            </button>
                        </div>

                        {
                            objToArray(array, (value, key) => (
                                <div key={key}>
                                    <div className='name-color'>
                                        <label htmlFor="">Name Color:</label>
                                        <input type="text" name='namecolor' value={value.namecolor} onChange={(e) => dispatch({
                                            type: CHANGE_NAME_COLOR,
                                            payload: {
                                                key: key,
                                                data: e.target.value,
                                                idcolor: key
                                            }
                                        })} required />
                                    </div>
                                    <div className='quantity'>
                                        <label htmlFor="">Quantity:</label>
                                        <input type="number" name='quantity' value={value.quantity} onChange={(e) => dispatch({
                                            type: CHANGE_QUANTITY_COLOR,
                                            payload: {
                                                key: key,
                                                data: e.target.value
                                            }
                                        })} required min={0} max={10} />
                                    </div>
                                    <div className='action'>
                                        <label htmlFor="">Action:</label>
                                        <button onClick={() => dispatch({
                                            type: DELETE_ITEM,
                                            payload: {
                                                key: key
                                            }
                                        })}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='btn'>
                            <button className='cancel' onClick={setOpenModal}>Cancel</button>
                            <button className='ok'>OK</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Modal