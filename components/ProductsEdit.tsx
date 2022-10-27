import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IProduct } from "../pages/products";

interface IProductsEditProps {
    saveProduct: (product: IProduct) => void;
    toggleItemForm: () => void;
}

function ProductsEdit(props: IProductsEditProps) {
    const [productName, setProductName] = React.useState("");
    const [price, setPrice] = React.useState("");

    return (
        <>
            <div className="form-content">
                <span className="p-float-label">
                    <InputText id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <label htmlFor="productName">Nosaukums</label>
                </span>

                <span className="p-float-label">
                    <InputText id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <label htmlFor="price">Cena</label>
                </span>
            </div>
            <div className="form-footer">
                <Button label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </>
    );
}

export default ProductsEdit;
