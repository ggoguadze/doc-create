import { Button } from "primereact/button";
import { IBill, IFullBill } from "../pages/createBill";
import { Customer, Products } from "@prisma/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Calendar } from "primereact/calendar";
import { DataTable, DataTableRowEditCompleteParams } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

interface ICreateBillProps {
    saveBill: (bill: IFullBill) => void;
    toggleItemForm: () => void;
    customers: Customer[];
    products: Products[];
}

function CreateBill(props: ICreateBillProps) {
    const { user } = useUser();

    const formik = useFormik<IBill>({
        initialValues: {
            datePaymentDue: "",
            customerId: 0,
            products: []
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.datePaymentDue) {
                errors.datePaymentDue = "Izvēlieties maksājuma termiņu.";
            }
            if (!data.customerId) {
                errors.customerId = "Izvēlieties klientu.";
            }
            if (!data.products.length) {
                errors.products = "Izvēlieties produktus.";
            }

            return errors;
        },
        onSubmit: (data) => {
            onBillSave(data);
        }
    });

    const isFormFieldValid = (name: keyof typeof formik.touched) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: keyof typeof formik.touched) => {
        //@ts-expect-error
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

    function onBillSave(data: IBill) {
        props.saveBill({
            dateCreated: new Date().toISOString(),
            datePaymentDue: data.datePaymentDue,
            status: "UNSIGNED",
            customerId: data.customerId,
            createdBy: user?.name as string,
            products: data.products
        });
        props.toggleItemForm();
    }

    const quantityEditor = (options: ColumnEditorOptions) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback && options.editorCallback(e.value)}
            />
        );
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteParams) => {
        let products = [...formik.values.products];
        let { newData, index } = e;

        newData = {
            ...newData,
            price: props.products.find((p) => p.name === newData.productName)?.price,
            unit: props.products.find((p) => p.name === newData.productName)?.unit
        };

        products[index] = newData;

        formik.setFieldValue("products", products);
    };

    const productsEditor = (options: ColumnEditorOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={props.products}
                optionLabel="name"
                filter
                showClear
                filterBy="name"
                optionValue="name"
                onChange={(e) => {
                    options.editorCallback && options.editorCallback(e.value);
                }}
                placeholder="Izvēlaties produktu"
                itemTemplate={(option) => {
                    return <span>{option.name}</span>;
                }}
            />
        );
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="create-bill-container">
                    <div className="form-content">
                        <div className="form-item customer-select">
                            <Dropdown
                                id="customerId"
                                value={formik.values.customerId}
                                options={props.customers.map((c) => {
                                    return { label: c.clientName, value: c.id };
                                })}
                                onChange={formik.handleChange}
                                optionLabel="label"
                                filter
                                showClear
                                filterBy="label"
                                placeholder="Izvēlaties klientu"
                                style={{ width: "18rem" }}
                            />
                            <label
                                htmlFor="clientName"
                                className={classNames({ "p-error": isFormFieldValid("customerId") })}
                            ></label>
                            {getFormErrorMessage("customerId")}
                        </div>
                        <div className="form-item payment-due-date">
                            <span className="p-float-label">
                                <Calendar
                                    dateFormat="dd/mm/yy"
                                    id="datePaymentDue"
                                    value={formik.values.datePaymentDue}
                                    onChange={formik.handleChange}
                                    style={{ width: "18rem" }}
                                />
                                <label
                                    htmlFor="datePaymentDue"
                                    className={classNames({ "p-error": isFormFieldValid("datePaymentDue") })}
                                >
                                    Maksājuma termiņš
                                </label>
                            </span>
                            {getFormErrorMessage("datePaymentDue")}
                        </div>
                        <DataTable
                            id="products"
                            className="editable-cells-table"
                            editMode="row"
                            value={[...formik.values.products, { productName: "", quantity: 0, price: 0, unit: "" }]}
                            onRowEditComplete={onRowEditComplete}
                            style={{ width: "90%" }}
                        >
                            <Column
                                editor={(options) => productsEditor(options)}
                                field="productName"
                                header="Produkta nosaukums"
                            />
                            <Column editor={(options) => quantityEditor(options)} field="quantity" header="Skaits" />
                            <Column
                                rowEditor
                                headerStyle={{ width: "10%", minWidth: "8rem" }}
                                bodyStyle={{ textAlign: "center" }}
                            ></Column>
                        </DataTable>
                        {getFormErrorMessage("products")}
                    </div>
                    <div className="form-footer">
                        <span className="p-buttonset">
                            <Button type="submit" label="Saglabāt" icon="pi pi-save" />
                            <Button type="button" onClick={confirm} label="Atcelt" icon="pi pi-times" />
                        </span>
                    </div>
                </div>
            </form>
        </>
    );
}

export default CreateBill;
