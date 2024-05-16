import React from 'react'
import "../modalproductlist/ModalProductList.css"


const ModalProductList = (props) => {
    return (
        <div className='modelproductlist'>
            <div className="modelproductlist__overlay">
            </div>

            <div className="modelproductlist__content">

                <h1 className='modelproductlist__content-title'>Update Product</h1>

                <form className='modelproductlist__content-body'>
                        <input className='modelproductlist__content-body-common' placeholder='Product name' type="text" />
                        <input  className='modelproductlist__content-body-common' placeholder='Discount'  type="text" />
                    
                        <div>
                            <div className='modelproductlist__content-body-size'>
                                <input type="text" placeholder='Name size'/>
                                <input type="text" placeholder='Price name'/>
                                <div>
                                    <input type="text" placeholder='Name color'/>
                                    <input type="text" placeholder='Name color'/>
                                </div>
                                <div>
                                    <input type="text" placeholder='Quantity'/>
                                    <input type="text" placeholder='Quantity'/>
                                </div>
                            </div>
                        </div>
                    
                </form>
               
                <div className='modelproductlist__content-button'>
                        <button className="modelproductlist__content-body-no" onClick={() => { props.callbackparent() }}>
                            No
                        </button>
                        <button className="modelproductlist__content-body-confirm" onClick={() => { }}>
                            Confirm
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default ModalProductList