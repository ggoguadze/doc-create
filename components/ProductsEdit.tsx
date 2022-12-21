import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IProduct } from "../pages/products";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

interface IProductsEditProps {
    saveProduct: (product: IProduct) => void;
    toggleItemForm: () => void;
    selectedData?: IProduct;
}

function ProductsEdit(props: IProductsEditProps) {
    const formik = useFormik({
        initialValues: {
            name: props.selectedData?.name ?? "",
            price: props.selectedData?.price ?? null,
            unit: props.selectedData?.unit ?? ""
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.name) {
                errors.name = "Nosaukums ir obligāts.";
            } else if (data.name.length > 20) {
                errors.name = "Nosaukums nedrīkst būt garāks par 20 rakstzīmēm.";
            }
            if (!data.price) {
                errors.price = "Cena ir obligāta.";
            } else if (data.price < 0) {
                errors.price = "Cena nedrīkst būt mazāka par 0.";
            }
            if (!data.unit) {
                errors.unit = "Mērvienība ir obligāta.";
            }

            return errors;
        },
        onSubmit: (data) => {
            onProductSave(data);
        }
    });

    const isFormFieldValid = (name: keyof typeof formik.touched) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: keyof typeof formik.touched) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const confirm = () => {
        confirmDialog({
            message: "Vai tiešām vēlaties atcelt?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Jā",
            rejectLabel: "Nē",
            accept: props.toggleItemForm
        });
    };

    function onProductSave(data: IProduct) {
        props.saveProduct({
            name: data.name,
            price: data.price ?? 0,
            unit: data.unit
        });
        props.toggleItemForm();
    }

    const options = [
        { label: "Gabali", value: "gab" },
        { label: "Kilogrami", value: "kg" },
        { label: "Litri", value: "l" }
    ];

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="form-content">
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>
                                Nosaukums
                            </label>
                        </span>
                        {getFormErrorMessage("name")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputNumber
                                style={{ width: "18rem" }}
                                currencyDisplay="code"
                                inputId="currency-latvia"
                                mode="currency"
                                currency="EUR"
                                locale="lv-LV"
                                id="price"
                                value={formik.values.price}
                                onChange={(e) => {
                                    formik.setFieldValue("price", e.value);
                                }}
                            />
                            <label htmlFor="price" className={classNames({ "p-error": isFormFieldValid("price") })}>
                                Cena
                            </label>
                        </span>
                        {getFormErrorMessage("price")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <Dropdown
                                id="unit"
                                style={{ width: "18rem" }}
                                value={formik.values.unit}
                                options={options}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="unit" className={classNames({ "p-error": isFormFieldValid("unit") })}>
                                Mērvienība{" "}
                            </label>
                        </span>
                        {getFormErrorMessage("unit")}
                    </div>
                </div>
                <div className="form-footer">
                    <span className="p-buttonset">
                        <Button type="submit" label="Saglabāt" icon="pi pi-save" />
                        <Button type="button" onClick={confirm} label="Atcelt" icon="pi pi-times" />
                    </span>
                </div>
            </form>
        </>
    );
}

export default ProductsEdit;
