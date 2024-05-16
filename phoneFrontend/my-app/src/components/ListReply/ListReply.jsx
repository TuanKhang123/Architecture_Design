import React from 'react'
import { AiOutlineClockCircle } from "react-icons/ai";
import dayjs from 'dayjs';

const ListReply = (props) => {
    const { index, value } = props
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "auto",
                width: "calc(100% - 25px)"
            }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <img className='img-user' src={value.avtuser} alt="" />
                    <h4>{value.firstname + ' ' + value.lastname}</h4>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                    <AiOutlineClockCircle />
                    <h5>{dayjs(value.commentday).from()}</h5>
                </div>
            </div>
            <div key={index} style={{
                backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15)", padding: "10px", margin: "12px 0", lineHeight: "1.5", width: "calc(100% - 40px)", marginLeft: "auto"
            }}>
                <p style={{ fontSize: "12px" }}>{value.comment}</p>
            </div>
        </>
    )
}

export default ListReply