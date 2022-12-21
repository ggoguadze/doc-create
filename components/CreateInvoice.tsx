import { Button } from "primereact/button";
import { IFullInvoice, IInvoice } from "../pages/createInvoice";
import { Dropdown } from "primereact/dropdown";
import { Driver, Transport, Customer, Products } from "@prisma/client";
import { Calendar } from "primereact/calendar";
import { DataTable, DataTableRowEditCompleteParams } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { useUser } from "@auth0/nextjs-auth0/client";
import { confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

interface ICreateInvoiceProps {
    saveInvoice: (invoice: IFullInvoice) => void;
    toggleItemForm: () => void;
    customers: Customer[];
    drivers: Driver[];
    transports: Transport[];
    products: Products[];
}

function CreateInvoice(props: ICreateInvoiceProps) {
    const { user } = useUser();

    const formik = useFormik<IInvoice>({
        initialValues: {
            dateDelivered: "",
            datePaymentDue: "",
            customerId: 0,
            driverId: 0,
            transportId: 0,
            products: []
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.dateDelivered) {
                errors.dateDelivered = "Izvēlieties piegādes datumu.";
            }
            if (!data.datePaymentDue) {
                errors.datePaymentDue = "Izvēlieties maksājuma termiņu.";
            }
            if (!data.customerId) {
                errors.customerId = "Izvēlieties klientu.";
            }
            if (!data.driverId) {
                errors.driverId = "Izvēlieties vadītāju.";
            }
            if (!data.transportId) {
                errors.transportId = "Izvēlieties transportu.";
            }
            if (!data.products.length) {
                errors.products = "Izvēlieties produktus.";
            }

            return errors;
        },
        onSubmit: (data) => {
            onInvoiceSave(data);
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

    function onInvoiceSave(data: IInvoice) {
        props.saveInvoice({
            dateCreated: new Date().toISOString(),
            dateDelivered: data.dateDelivered,
            datePaymentDue: data.datePaymentDue,
            status: "UNSIGNED",
            customerId: data.customerId,
            driverId: data.driverId,
            transportId: data.transportId,
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
                <div className="create-invoice-container">
                    <div className="form-content">
                        <div className="form-selector-container">
                            <div className="form-dropdown-selectors">
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
                                <div className="form-item transport-select">
                                    <Dropdown
                                        id="transportId"
                                        value={formik.values.transportId}
                                        options={props.transports.map((c) => {
                                            return { label: c.name, value: c.id };
                                        })}
                                        onChange={formik.handleChange}
                                        optionLabel="label"
                                        filter
                                        showClear
                                        filterBy="label"
                                        placeholder="Izvēlaties transportu"
                                        style={{ width: "18rem" }}
                                    />
                                    <label
                                        htmlFor="transportId"
                                        className={classNames({ "p-error": isFormFieldValid("transportId") })}
                                    ></label>
                                    {getFormErrorMessage("transportId")}
                                </div>
                                <div className="form-item driver-select">
                                    <Dropdown
                                        id="driverId"
                                        value={formik.values.driverId}
                                        options={props.drivers.map((c) => {
                                            return { label: c.name, value: c.id };
                                        })}
                                        onChange={formik.handleChange}
                                        optionLabel="label"
                                        filter
                                        showClear
                                        filterBy="label"
                                        placeholder="Izvēlaties vadītāju"
                                        style={{ width: "18rem" }}
                                    />
                                    <label
                                        htmlFor="driverId"
                                        className={classNames({ "p-error": isFormFieldValid("driverId") })}
                                    ></label>
                                    {getFormErrorMessage("driverId")}
                                </div>
                            </div>
                            <div className="form-calendar-selectors">
                                <div className="form-item delivery-date">
                                    <span className="p-float-label">
                                        <Calendar
                                            style={{ width: "18rem" }}
                                            dateFormat="dd/mm/yy"
                                            id="dateDelivered"
                                            value={formik.values.dateDelivered}
                                            onChange={formik.handleChange}
                                        />
                                        <label
                                            htmlFor="dateDelivered"
                                            className={classNames({ "p-error": isFormFieldValid("dateDelivered") })}
                                        >
                                            Piegādes datums
                                        </label>
                                        {getFormErrorMessage("dateDelivered")}
                                    </span>
                                </div>
                                <div className="form-item payment-due-date">
                                    <span className="p-float-label">
                                        <Calendar
                                            style={{ width: "18rem" }}
                                            dateFormat="dd/mm/yy"
                                            id="datePaymentDue"
                                            value={formik.values.datePaymentDue}
                                            onChange={formik.handleChange}
                                        />
                                        <label
                                            htmlFor="datePaymentDue"
                                            className={classNames({ "p-error": isFormFieldValid("datePaymentDue") })}
                                        >
                                            Maksājuma termiņš
                                        </label>
                                        {getFormErrorMessage("datePaymentDue")}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <DataTable
                            id="products"
                            style={{ width: "90%" }}
                            className="editable-cells-table"
                            editMode="row"
                            value={[
                                ...formik.values.products,
                                { id: 0, productName: "", quantity: 0, price: 0, unit: "", invoiceId: 0 }
                            ]}
                            onRowEditComplete={onRowEditComplete}
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

export default CreateInvoice;
