import React from 'react'
import "../purchase/Purchase.css"
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { GrFormClose } from "react-icons/gr";
import Orderdetail from '../orderdetail/Orderdetail';
import Modelcancel from '../modelcancel/Modelcancel';
import {toast } from "react-toastify"
import axios from 'axios';

const Purchase = () => {

    const [datas, Setdatas] = useState([])
    const [ivseedetail, setIvSeeDetail] = useState([])
    const [cancel, setCancel] = useState(-1);
    const [statusSee, setStatusSee] = useState(-1);
    const [statuscrr, setStatuscrr] = useState(1);
    const [dataapi, setDataApi] = useState(datas);
    const [currentPage, setCurrentPage] = useState(0);
    const setStatus = (index) => {
        setStatuscrr(index);
    }
    const accessToken = localStorage.getItem("accessToken")
    const getCheckout = async () => {
        const response = await axios.get("http://localhost:8000/invoice/getcheckout", {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        })
            .then((data) => {
                Setdatas(data?.data?.result)
            })
            .catch((error) => {
                console.log(error);
            })
        return response;
    }
    console.log(datas);

    const deleteInvoice = async (idiv) => {
        const response = await axios.post('http://localhost:8000/invoice/detelecheckout', { idiv },
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        )
            .then((result) => {
                toast(result.data.message)
                getCheckout();
            })
            .catch((error) => {
                console.log(error);
            })
    }
    useEffect(() => {
        getCheckout()
    }, [])

    useEffect(() => {
        setDataApi(datas)
    }, [datas])

    const [currentItems, setcurrentItems] = useState([]) // list item in current page
    const [pageCount, setpageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0); // the index of the first item in current page
    const itemsPerPage = 3;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setcurrentItems(dataapi.slice(itemOffset, endOffset))
        setpageCount(Math.ceil(dataapi.length / itemsPerPage))
    }, [dataapi, itemOffset, itemsPerPage])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % datas.length;
        setItemOffset(newOffset);
        setCurrentPage(event.selected)
    };

    const handleData = (str) => {
        if (str === '')
            setDataApi(datas);
        else
            setDataApi(datas.filter((data) => data[0].statusiv === str))
        setItemOffset(0)
        setCurrentPage(0)
    }

    const getStatusSee = (index, data) => {
        setStatusSee(index);
        if (data) {
            setIvSeeDetail(data)
        }
    }
    const handleNo = () => {
        setCancel(-1)
    }

    const handleYes = (data) => {
        if (data)
            deleteInvoice(data[0].idiv)
        setStatus(1);
        setItemOffset(0)
        setCurrentPage(0)
        setCancel(!cancel)
    }

    return (
        <>
        {/* <div>dasdsa</div> */}
            {
                (statusSee === -1 ?
                    (<div className='purchase'>
                        <p className='purchase__name'>ORDER MANAGEMENT</p>

                        <div className="purchase__status">
                            <button
                                onClick={() => {
                                    setStatus(1);
                                    handleData('');
                                }}
                                className={statuscrr === 1 ? "purchase__status-common purchase__status-common-active" : "purchase__status-common"}>
                                All invoice
                            </button>

                            <button
                                onClick={() => {
                                    setStatus(2);
                                    handleData('Paid');
                                }}
                                className={statuscrr === 2 ? "purchase__status-common purchase__status-common-active" : "purchase__status-common"}>
                                Paid
                            </button>

                            <button
                                onClick={() => {
                                    setStatus(3);
                                    handleData('UnPaid');
                                }}
                                className={statuscrr === 3 ? "purchase__status-common purchase__status-common-active" : "purchase__status-common"}>
                                UnPaid
                            </button>

                        </div>

                        <div className="purchase__title">
                            <div className="purchase__title-des purchase-title-pro">ID</div>
                            <div className="purchase__title-des purchase-title-date">DATE TIME</div>
                            <div className="purchase__title-des purchase-title-price">TOTAL PRICE</div>
                            <div className="purchase__title-des purchase-title-status">STATUS</div>
                            <div className="purchase__title-des purchase-title-action">ACTION</div>
                        </div>

                        <div className="purchase__list">
                            {
                                currentItems.length >= 1 ?
                                    currentItems.map((data, i) => (
                                        <div className='purchase__list-item' key={i}>
                                            <p className="purchase__list-item-id">{data[0]?.idiv}</p>

                                            <div className="purchase__list-item-time">
                                                {(new Date(data[0]?.ivday).getFullYear() + '-' + (new Date(data[0]?.ivday).getMonth() + 1) + '-' + new Date(data[0]?.ivday).getDate())}
                                                
                                                <br /> 
                                                
                                                {(new Date(data[0]?.ivday).getHours() + ":" + new Date(data[0]?.ivday).getMinutes() + ":" + new Date(data[0]?.ivday).getSeconds())}
                                            </div>

                                            <div className="purchase__list-data-price">{(data[0]?.totalprice).toLocaleString('en-US').replace(/,/g, '.') + '$'}</div>
                                            <div className={`purchase__list-item-status purchase__list-item-status-${data[0]?.statusiv}`}>{data[0]?.statusiv}</div>
                                            <div className="purchase__list-item-btn">
                                                <button
                                                    onClick={() => getStatusSee(i, data)}
                                                    className='purchase__list-item-btn-detail'>See detail</button>
                                            </div>

                                            {data[0].statusiv === 'UnPaid' ? <GrFormClose className='purchase__list-item-icon' onClick={() => setCancel(i)} /> : null}
                                            {cancel === i ? <Modelcancel parentCallbackNo={handleNo} parentCallbackYes={handleYes} dataFromParent={data} /> : null}
                                        </div>
                                    ))
                                    :
                                    (<div className="purchase__list-empty">
                                        <img src="https://media.itsnicethat.com/original_images/giphy-2021-gifs-and-clips-animation-itsnicethat-02.gif" alt="" className='purchase__list-empty-image' />
                                        <p className='purchase__list-empty-text'>Empty</p>
                                    </div>)
                            }
                        </div>
                        <ReactPaginate
                            forcePage={currentPage}

                            breakLabel="..."
                            nextLabel="→"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            pageCount={pageCount}
                            previousLabel="←"
                            renderOnZeroPageCount={null}


                            containerClassName='pagination'
                            pageLinkClassName='page-num'

                            previousLinkClassName='arrow-prev'
                            nextLinkClassName='arrow-next'

                            activeLinkClassName='active'

                            nextClassName='purchase__next'
                            previousClassName='purchase__prev'
                        />
                    </div>) : <Orderdetail dataFromParent={ivseedetail} parentCallback={getStatusSee} />)
            }
        </>
    )
}
export default Purchase