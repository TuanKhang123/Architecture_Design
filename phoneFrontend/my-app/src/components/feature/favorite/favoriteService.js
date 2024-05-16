import axios from "axios";

const addFavorite = async ({ accessToken, idproducts, idimage }) => {
    const response = await axios.post(
        "http://localhost:8000/favorite/addFavorite",
        {
            idproducts,
            idimage
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            },
        }
    );
    return response.data;
}

const deleteFavorite = async ({ accessToken, idproducts }) => {
    const response = await axios.delete(
        `http://localhost:8000/favorite/deleteFavorite/${idproducts}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            },
        }
    );
    return response.data;
}

const getListFavorite = async ({ accessToken }) => {
    const response = await axios.get(
        "http://localhost:8000/favorite/getFavorite",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            },
        }
    );
    return response.data;
}


const favoriteService = {
    addFavorite,
    deleteFavorite,
    getListFavorite
};

export default favoriteService;