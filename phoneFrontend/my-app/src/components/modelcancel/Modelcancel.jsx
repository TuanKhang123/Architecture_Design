import React from 'react'
import "../modelcancel/Modelcancel.css"

const Modelcancel = (props) => {
    return (
        <div className='modelcancel'>
            <div className="modelcancel__overlay">

            </div>
            <div className="modelcancel__content">

                <h1 className='modelcancel__content-title'>
                    {
                        props.text
                            ? props.text
                            : "You want to cancel this order?"
                    }
                </h1>

                <div className='modelcancel__content-body'>

                    <button className="modelcancel__content-body-no" onClick={() => { props.parentCallbackNo() }}>
                        No
                    </button>
                    <button className="modelcancel__content-body-confirm" onClick={() => { props.parentCallbackYes(props.dataFromParent) }}>
                        Confirm
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Modelcancel
