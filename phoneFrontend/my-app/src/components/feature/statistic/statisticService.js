import axios from "axios";


const getMonthlyRevenue = async ({data}) => {
    const response = await axios.get(
        `http://localhost:8000/statistic/getmonthsrevenue?year=${data}`
    )
    return response.data;
}

const getCateRevenue = async ({data}) => {
    const response = await axios.get(
        `http://localhost:8000/statistic/getcaterevenue?month=${data?.chooseMonth}&year=${data?.chooseYear}`
    )
    return response.data;
}

const getTopBestSelling = async ({data}) => {
    const response = await axios.get(
        `http://localhost:8000/statistic/gettopsales?month=${data?.chooseMonth}&year=${data?.chooseYear}`
    )
    return response.data;
}





const statisticService = {
    getMonthlyRevenue,
    getCateRevenue,
    getTopBestSelling
}

export default statisticService