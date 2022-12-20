import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IProduct } from "../pages/products";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface IProductsEditProps {
    saveProduct: (product: IProduct) => void;
    toggleItemForm: () => void;
    selectedData?: IProduct;
}

function ProductsEdit(props: IProductsEditProps) {
    const [productName, setProductName] = React.useState(props.selectedData?.name ?? "");
    const [price, setPrice] = React.useState(props.selectedData?.price ?? null);
    const [unit, setUnit] = React.useState(props.selectedData?.unit ?? "");

    const confirm = () => {
        confirmDialog({
            message: 'Vai tiešām vēlaties atcelt?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Jā',
            rejectLabel: 'Nē',
            accept: props.toggleItemForm
        });
    };

    function onCustomerSave() {
        props.saveProduct({
            name: productName,
            price: price ?? 0,
            unit
        });
        props.toggleItemForm();
    }

    const onUnitChange = (e: { value: any }) => {
        setUnit(e.value);
    };

    const options = [
        { label: "Gabali", value: "gab" },
        { label: "Kilogrami", value: "kg" },
        { label: "Litri", value: "l" }
    ];

    return (
        <>
            <ConfirmDialog />
            <div className="form-content">
                <span className="p-float-label">
                    <InputText style={{ width: "18rem" }} id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <label htmlFor="productName">Nosaukums</label>
                </span>

                <span className="p-float-label">
                    <InputNumber
                        style={{ width: "18rem" }}
                        inputId="currency-latvia"
                        mode="currency"
                        currency="EUR"
                        locale="lv-LV"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.value ? e.value : 0)}
                    />
                    <label htmlFor="price">Cena</label>
                </span>

                <span className="p-float-label">
                    <Dropdown
                        style={{ width: "18rem" }}
                        value={unit}
                        options={options}
                        onChange={onUnitChange}
                        placeholder="Izvēlaties mērvienību"
                    />
                    <label htmlFor="unit">Mērvienība </label>
                </span>
            </div>
            <div className="form-footer">
                <span className="p-buttonset">
                    <Button onClick={onCustomerSave} label="Saglabāt" icon="pi pi-save" />
                    <Button onClick={confirm} label="Atcelt" icon="pi pi-times" />
                </span>
            </div>
        </>
    );
}

export default ProductsEdit;
