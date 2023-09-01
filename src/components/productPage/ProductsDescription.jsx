import React from 'react';
import "../../components-css/productPage/ProductsDescription.css";

export default function ProductsDescription({description}) {
    return(
        <div className='description-preview'>
            <p className='description-title'>Description</p>
            <p className='description'>{description}</p>
        </div>
    )
}