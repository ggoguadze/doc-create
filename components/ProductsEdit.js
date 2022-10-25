import { InputText } from 'primereact/inputtext';
import * as React from "react";

function ProductsEdit() {
    const [productName, setProductName] = React.useState("")
    const [price, setPrice] = React.useState("")

    
    return (
        <div>
            <span className="p-float-label">
                <InputText id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
                <label htmlFor="productName">Nosaukums</label>
            </span>

            <span className="p-float-label">
                <InputText id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <label htmlFor="price">Cena</label>
            </span>
        </div>
    )
}

export default ProductsEdit
