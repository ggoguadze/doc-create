import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IProduct } from "../pages/products";
import { InputNumber } from "primereact/inputnumber";

interface IProductsEditProps {
    saveProduct: (product: IProduct) => void;
    toggleItemForm: () => void;
    selectedData?: IProduct;
}

function ProductsEdit(props: IProductsEditProps) {
    const [productName, setProductName] = React.useState(props.selectedData?.name ?? "");
    const [price, setPrice] = React.useState(props.selectedData?.price ?? 0);
    const [unit, setUnit] = React.useState(props.selectedData?.unit ?? "");

    function onCustomerSave() {
        props.saveProduct({
            name: productName,
            price,
            unit
        });
        props.toggleItemForm();
    }

    return (
        <>
            <div className="form-content">
                <span className="p-float-label">
                    <InputText id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <label htmlFor="productName">Nosaukums</label>
                </span>

                <span className="p-float-label">
                    <InputNumber id="price" value={price} onChange={(e) => setPrice(e.value ? e.value : 0)} />
                    <label htmlFor="price">Cena</label>
                </span>

                <span className="p-float-label">
                    <InputText id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
                    <label htmlFor="unit">Mērvienība	</label>
                </span>
            </div>
            <div className="form-footer">
                <Button onClick={onCustomerSave} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </>
    );
}

export default ProductsEdit;
