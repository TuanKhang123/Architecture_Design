import React, { useEffect, useState } from 'react'
import "../modalreview/ModalReview.css"
import { AiOutlineClose, AiFillCamera, AiOutlineCloseCircle } from "react-icons/ai"
import { FaStar } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

const ratingLabels = [
    { number: 1, value: "Very bad" },
    { number: 2, value: "Bad" },
    { number: 3, value: "Normal" },
    { number: 4, value: "Good" },
    { number: 5, value: "Great" }
]
const perfomanceLabels = [
    { number: 1, value: "Lag" },
    { number: 2, value: "Unstable" },
    { number: 3, value: "Stable" },
    { number: 4, value: "Strong" },
    { number: 5, value: "Super strong" }
];
const batteryLifeLabels = [
    { number: 1, value: "Very weak" },
    { number: 2, value: "Weak" },
    { number: 3, value: "Enough to use" },
    { number: 4, value: "Terrible" },
    { number: 5, value: "Extremely terrible" }
]
const cameraQuantityLabels =
    [
        { number: 1, value: "Not taken well" },
        { number: 2, value: "Not taken well" },
        { number: 3, value: "Fine" },
        { number: 4, value: "Beautiful capture" },
        { number: 5, value: "Beautiful, professional photography" }
    ]

const ModalReview = (props) => {
    const { getListEvaluate, productsById, isModal, setIsModal } = props
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedRating, setSelectedRating] = useState(ratingLabels[4])
    const [selectedPerformance, setSelectedPerformance] = useState(perfomanceLabels[4])
    const [selectedBatteryLife, setSelectedBatteryLife] = useState(batteryLifeLabels[4])
    const [selectedCameraQuanlity, setSelectedCameraQuanlity] = useState(cameraQuantityLabels[4])
    const [hoverRating, setHoverRating] = useState(0);
    const [hoverPerformance, setHoverPerformance] = useState("");
    const [hoverBatteryLife, setHoverBatteryLife] = useState("");
    const [hoverCameraQuantity, setHoverCameraQuantity] = useState("");
    const [text, setText] = useState("")
    const accessToken = localStorage.getItem("accessToken")
    const [preview, setPreview] = useState([])

    const handleCloseModal = () => {
        setIsModal(false)
    }

    const handleRatingMouseLeave = () => {
        setHoverRating(0);
    };

    const handleRatingMouseEnter = (star) => {
        setHoverRating(star);
    };

    const handlePerformanceMouseLeave = () => {
        setHoverPerformance("");
    };

    const handlePerformanceMouseEnter = (star) => {
        setHoverPerformance(star);
    };

    const handleBatteryLifeMouseLeave = () => {
        setHoverBatteryLife("");
    };

    const handleBatteryLifeMouseEnter = (star) => {
        setHoverBatteryLife(star);
    };

    const handleCameraQuantityMouseLeave = () => {
        setHoverCameraQuantity("");
    };

    const handleCameraQuantityMouseEnter = (star) => {
        setHoverCameraQuantity(star);
    };

    const handleRatingClick = (selectedRating) => {
        setSelectedRating(selectedRating)
    }

    const handlePerformanceClick = (star) => {
        setSelectedPerformance(star);
    };

    const handleBatteryLifeClick = (selectedBatteryLife) => {
        setSelectedBatteryLife(selectedBatteryLife);
    };

    const handleCameraQuantityClick = (selectedCameraQuanlity) => {
        setSelectedCameraQuanlity(selectedCameraQuanlity);
    };

    const handleChangeText = (e) => {
        e.preventDefault()
        setText(e.target.value)
    }

    const handleImageChange = (e) => {
        const fileObj = []
        let files = e.target.files
        fileObj.push(files)
        let reader;
        for (var i = 0; i < fileObj[0].length; i++) {
            reader = new FileReader()
            reader.readAsDataURL(fileObj[0][i])
            reader.onload = event => {
                preview.push(event.target.result)
                setPreview([... new Set(preview)])
            }
        }

        if (selectedImages.length + preview.length <= 3) {
            setSelectedImages(prevSelectedImages => [...prevSelectedImages, ...preview]);
        }
    };

    const handleDeleteImage = (indexToRemove) => {
        setSelectedImages(prevSelectedImages => {
            const newSelectedImages = [...prevSelectedImages];
            newSelectedImages.splice(indexToRemove, 1);
            return newSelectedImages;
        });
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const data = {
            idproducts: productsById.data.idproducts,
            starnumber: selectedRating,
            review: text,
            images: preview,
            performance: selectedPerformance,
            batterylife: selectedBatteryLife,
            cameraquantity: selectedCameraQuanlity
        }
        axios.post("http://localhost:8000/evaluate/addEvaluate", data, {
            headers: {
                "Authorization": "Bearer " + accessToken
            },
        })
            .then(response => {
                setIsModal(false)
                getListEvaluate();
            })
            .catch(error => {
                console.log(error);
                if (error?.response?.data?.error === "Người dùng chưa mua sản phẩm.") {
                    toast.error('Need to purchase the product before rating', {
                        position: 'top-right',
                        autoClose: 3000,
                        style: { color: '#bf0d0d', backgroundColor: '#D7F1FD' },
                    });
                }
            });
    }


    return (
        <div className='wrapper-modalreview'>
            <div className='modal-review is-active'>
                <div
                    style={{
                        backgroundColor: "#f4f6f8",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                    <p
                        style={{
                            fontSize: "20px",
                            padding: "15px",
                            fontWeight: "bold"
                        }}>
                        Reviews & comments
                    </p>
                    <button onClick={handleCloseModal} style={{ border: "none", backgroundColor: "transparent", padding: "15px", fontSize: "20px", cursor: "pointer" }}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div className='scroll' style={{ overflowY: "scroll", maxHeight: "88vh" }}>
                    <div>
                        <h3 style={{ padding: "15px" }}>{productsById.data?.nameproducts}
                            {
                                productsById?.data?.size.map((size, index) => (
                                    <span key={index}> {size.namesize}</span>
                                ))
                            }
                        </h3>
                    </div>
                    <form action="" onSubmit={handleSubmitForm}>
                        <div style={{ color: "#111", fontSize: "16px", fontWeight: "bold", padding: "15px", }}>General Assessment</div>
                        <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%", borderBottom: "1px solid rgba(145,158,171,.239)", padding: "10px 0" }}>
                            {
                                ratingLabels.map((star, index) => (
                                    <div
                                        key={index}
                                        style={{ textAlign: "center", lineHeight: "1.5", cursor: "pointer" }}
                                        onMouseEnter={() => handleRatingMouseEnter(star)}
                                        onMouseLeave={handleRatingMouseLeave}
                                        onClick={() => handleRatingClick(star)}
                                    >
                                        <FaStar
                                            style={{ color: index <= ratingLabels.indexOf(hoverRating || selectedRating) ? "#ffbf00" : "#ccc", fontSize: "24px" }}
                                        />
                                        <p style={{ fontSize: "12px" }}>{star.value}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div>
                            <div style={{ color: "#111", fontSize: "16px", fontWeight: "bold", padding: "15px", }}>
                                According to experience
                            </div>
                            <div style={{ display: "flex", padding: "15px", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{ fontSize: "13px", width: "50%" }}>Performance</p>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {
                                        perfomanceLabels.map((star, index) => (
                                            <FaStar
                                                key={index}
                                                style={{ color: index <= perfomanceLabels.indexOf(hoverPerformance || selectedPerformance) ? "#ffbf00" : "#ccc", fontSize: "16px", cursor: "pointer" }}
                                                onMouseEnter={() => handlePerformanceMouseEnter(star)}
                                                onMouseLeave={handlePerformanceMouseLeave}
                                                onClick={() => handlePerformanceClick(star)}
                                            />
                                        ))
                                    }
                                </div>
                                <div style={{ fontSize: "13px", width: "110px", textAlign: "left" }}>
                                    {selectedPerformance.value}
                                </div>
                            </div>
                            <div style={{ display: "flex", padding: "15px", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{ fontSize: "13px", width: "50%" }}>Battery life</p>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {batteryLifeLabels.map((star, index) => (
                                        <FaStar
                                            key={index}
                                            style={{ color: index <= batteryLifeLabels.indexOf(hoverBatteryLife || selectedBatteryLife) ? "#ffbf00" : "#ccc", fontSize: "16px", cursor: "pointer" }}
                                            onMouseEnter={() => handleBatteryLifeMouseEnter(star)}
                                            onMouseLeave={handleBatteryLifeMouseLeave}
                                            onClick={() => handleBatteryLifeClick(star)}
                                        />
                                    ))}
                                </div>
                                <div style={{ fontSize: "13px", width: "110px", textAlign: "left" }}>
                                    {selectedBatteryLife.value}
                                </div>
                            </div>
                            <div style={{ display: "flex", padding: "15px", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{ fontSize: "13px", width: "50%" }}>Camera quality</p>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {cameraQuantityLabels.map((star, index) => (
                                        <FaStar
                                            key={index}
                                            style={{ color: index <= cameraQuantityLabels.indexOf(hoverCameraQuantity || selectedCameraQuanlity) ? "#ffbf00" : "#ccc", fontSize: "16px", cursor: "pointer" }}
                                            onMouseEnter={() => handleCameraQuantityMouseEnter(star)}
                                            onMouseLeave={handleCameraQuantityMouseLeave}
                                            onClick={() => handleCameraQuantityClick(star)}
                                        />
                                    ))}
                                </div>
                                <div style={{ fontSize: "13px", width: "110px", textAlign: "left" }}>
                                    {selectedCameraQuanlity.value}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: "13px" }}>
                            <textarea value={text} name='review' onChange={handleChangeText} style={{ maxHeight: "40vh", margin: "10px 0", borderRadius: "8px", resize: "vertical", display: "block", maxWidth: "100%", minWidth: "100%", padding: "13px", minHeight: "8em" }} placeholder='Please share some thoughts about the product' required></textarea>
                        </div>
                        <div style={{ display: "flex", padding: "13px" }}>
                            {preview.length > 0 && (
                                <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                                    {(preview || []).map((imageUrl, index) => (
                                        <div key={index} style={{ position: "relative" }}>
                                            <img style={{ maxWidth: "100px", maxHeight: "70px", borderRadius: "5px" }} src={imageUrl} alt={`Selected Image ${index}`} />
                                            <div style={{ cursor: "pointer", position: "absolute", top: "0", left: "100%" }} onClick={() => handleDeleteImage(index)}>
                                                <AiOutlineCloseCircle fontSize={20} />
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            )}
                            {selectedImages.length < 3 && (
                                <div>
                                    <input style={{ display: "none" }} name="file" type="file" id='image' multiple="multiple" onChange={handleImageChange} required />
                                    <label htmlFor="image" style={{ border: "1px dashed rgba(145,158,171,.239)", borderRadius: "8px", color: "#637381", cursor: "pointer", fontSize: "13px", fontWeight: "bold", gap: "10px", padding: "7px 11px", whiteSpace: "nowrap", margin: "0 0.5rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <AiFillCamera fontSize={24} />
                                        <div style={{ height: "24px", marginTop: "3px", lineHeight: "1.5" }}>
                                            Add Image
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                        <div style={{ position: "sticky", bottom: "0", width: "100%", zIndex: "400", backgroundColor: "white" }}>
                            <button
                                type='submit'
                                style={{
                                    border: "none",
                                    backgroundColor: "#1a94ff",
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    margin: "10px auto",
                                    padding: "10px 30px",
                                    borderRadius: "5px",
                                    width: "95%",
                                    cursor: "pointer"
                                }}>SUBMIT REVIEW</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ModalReview