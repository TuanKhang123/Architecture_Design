import React, { useEffect, useState } from 'react'
import "./DashBoard.css"
import HeaderManager from '../../components/headermanager/HeaderManager';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { Select } from 'antd';
import { Column } from '@ant-design/plots';
import { useDispatch, useSelector } from 'react-redux';
import { getCateRevenue, getMonthlyRevenue, getTopBestSelling, resetAll, resetRemaining } from '../../components/feature/statistic/statisticSlice';
import { Empty } from 'antd';

const DashBoard = () => {

    const [listMonth, setListMonth] = useState([])
    const [listYear, setListYear] = useState([])
    const [chooseMonth, setChooseMonth] = useState()
    const [chooseYear, setChooseYear] = useState()

    const dispatch = useDispatch()
    const { monthlyRevenue, cateRenevue, topBestSelling } = useSelector(state => state.statistic)
    const configCate = {
        appendPadding: 10,
        data: cateRenevue,
        angleField: 'monthly_sales',
        colorField: 'brand',
        radius: 0.9,
        label: {
            brand: 'inner',
            offset: '-30%',
            content: ({ percent, data }) => {
                return `${(percent * 100).toFixed(0)}%`
            },
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        tooltip: {
            formatter: (datum) => {
                const formattedValue = datum.monthly_sales.toLocaleString('en-US').replace(/,/g, '.') + '$';
                return { name: datum?.brand, value: formattedValue };
            }
        },
        interactions: [
            {
                brand: 'element-active',
            },
        ],
    };

    const configMonth = {
        data: monthlyRevenue,
        xField: 'month',
        yField: 'monthly_revenue',
        columnWidthRatio: 0.4,
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        tooltip: {
            formatter: (data) => {
                const formattedValue = data?.monthly_revenue.toLocaleString('en-US').replace(/,/g, '.') + '$';
                return { name: 'Monthly revenue ' + data?.month, value: formattedValue };
            }
        },
    };

    const { Option } = Select;

    const handleMonth = (value, option) => {
        setChooseMonth(option?.children);
    }

    const handleYear = (value, option) => {
        setChooseYear(option?.children);
    }

    const getYear = () => {
        const temp = new Date();
        const yearcurr = temp.getFullYear();
        var tempYear = []
        for (var i = yearcurr; i >= 2000; i--) {
            tempYear.push(i);
        }
        setListYear(tempYear)
    }

    const getMonth = () => {
        var tempmonth = []
        for (var i = 1; i <= 12; i++) {
            tempmonth.push(i);
        }
        setListMonth(tempmonth)
    }

    useEffect(() => {
        const temp = new Date();
        setChooseMonth(temp.getMonth() + 1)
        setChooseYear(temp.getFullYear())
        getYear()
        getMonth()
    }, [])


    useEffect(() => {
        if (chooseYear !== undefined) {
            dispatch(getMonthlyRevenue({ data: chooseYear }))
            if (chooseMonth !== undefined) {
                const data = {
                    chooseMonth: chooseMonth,
                    chooseYear: chooseYear
                }
                dispatch(getCateRevenue({ data }))
                dispatch(getTopBestSelling({ data }))
            }
            else {
                dispatch(resetRemaining())
            }
        }
        else {
            dispatch(resetAll())
        }
    }, [chooseMonth, chooseYear])


    return (
        <>
            <HeaderManager />
            <div className="dashboard">
                <h1 className='dashboard__title'>DASHBOARD</h1>


                <div className="dashboard__body">
                    <div className="body__row1">

                        <div className="row1__revenuestatistic">

                            <div className="revenuestatistic__head">

                                <div className="head-title">
                                    Monthly revenue statistics
                                </div>

                                <div className="head-control">
                                    <Select
                                        placeholder="Month"
                                        onChange={(value, option) => handleMonth(value, option)}
                                        allowClear
                                        className='control-month'
                                        value={chooseMonth}
                                    >
                                        {listMonth
                                            ? listMonth.map((item, i) => {
                                                return (
                                                    <Option
                                                        key={i}
                                                    >
                                                        {item}
                                                    </Option>
                                                )
                                            })
                                            : null}

                                    </Select>

                                    <Select
                                        placeholder="Year"
                                        onChange={(value, option) => handleYear(value, option)}
                                        allowClear
                                        className='control-year'
                                        value={chooseYear}
                                    >
                                        {listYear
                                            ? listYear.map((item, i) => {
                                                return (
                                                    <Option
                                                        key={i}
                                                    >
                                                        {item}
                                                    </Option>
                                                )
                                            })
                                            : null}

                                    </Select>
                                </div>

                            </div>

                            <div className="revenuestatistic-graph">
                                {
                                    monthlyRevenue.length >= 1
                                        ? <Column {...configMonth} />
                                        : <Empty className='empty-month'/>
                                }
                            </div>
                        </div>

                    </div>

                    <div className="body__row2">

                        <div className="row2__cate">

                            <div className="cate-title">Product category revenue</div>
                            <div className='cate-pie'>
                                {
                                    cateRenevue?.length  >=1 
                                    ? <Pie {...configCate} />
                                    : <Empty className='empty-month'/>
                                }
                                
                            </div>

                        </div>

                        <div className="row2__topsales">
                            <div className="topsales-title">Top 5 best-selling of month</div>


                            <div className="topsales-list">
                                {
                                    topBestSelling?.length >= 1
                                        ?
                                        <>
                                            <div className="list-title">
                                                <div className='first-num'>
                                                    Num
                                                </div>
                                                <div className='first-pro'>
                                                    Product
                                                </div>
                                                <div className='first-quantity'>
                                                    Quantity
                                                </div>
                                            </div>

                                            <div className="list-body">
                                                {
                                                    topBestSelling.map((item, index) => (
                                                        <div className="list-item" key={index}>
                                                            <div className='item-num'>
                                                                {index + 1}
                                                            </div>
                                                            <div className='item-img'>
                                                                <img src={item?.avt} alt="" />
                                                            </div>
                                                            <div className='item-pro'>
                                                                {item?.product_name}
                                                            </div>
                                                            <div className='item-quantity'>
                                                                {item?.total_quantity}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                        :
                                        <div className='list-item-empty'>
                                            <Empty />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoard;