import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from "react-router-dom"
import axios from 'axios'

const PrivateRouteAdmin = () => {
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true)
    const accessToken = localStorage.getItem("accessToken")

    useEffect(() => {
        axios.get("http://localhost:8000/auth/user/getuser", {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        })
            .then(res => {
                if (res.data[0].role === "admin") {
                    setLogin(true);
                    setLoading(false);
                }
                else {
                    setLogin(false);
                    setLoading(false);
                }
            })
            .catch(() => {
                setLogin(false);
                setLoading(false);
            })
    }, []);

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    return login ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRouteAdmin