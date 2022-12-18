import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IInvoice } from "../pages/createInvoice";
import { Dropdown } from "primereact/dropdown";
import { Driver, Transport, Customer, Products, InvoiceProduct } from "@prisma/client";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";

interface ICreateInvoiceProps {
    saveInvoice: (invoice: IInvoice) => void;
    toggleItemForm: () => void;
    customers: Customer[];
    drivers: Driver[];
    transports: Transport[];
    products: Products[];
}

function CreateInvoice(props: ICreateInvoiceProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [selectedTransport, setSelectedTransport] = useState<any>(null);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [deliveryDate, setDeliveryDate] = useState<Date | Date[] | undefined | null | string>(undefined);
    const [paymentDueDate, setPaymentDueDate] = useState<Date | Date[] | undefined | null | string>(undefined);
    const [selectedProducts, setSelectedProducts] = useState<InvoiceProduct[]>([
        { id: 1, productName: "Produkts 1", quantity: 1, price: 2, unit: "kg", invoiceId: 1 }
    ]);

    const onCustomerChange = (e: { value: any }) => {
        setSelectedCustomer(e.value);
    };

    const onTransportChange = (e: { value: any }) => {
        setSelectedTransport(e.value);
    };

    const onDriverChange = (e: { value: any }) => {
        setSelectedDriver(e.value);
    };

    const isPositiveInteger = (val: any) => {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, "") || "0";
        let n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (e: any) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case "quantity":
                if (isPositiveInteger(newValue)) rowData[field] = newValue;
                else event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0) rowData[field] = newValue;
                else event.preventDefault();
                break;
        }
    };

    const cellEditor = (options: ColumnEditorOptions) => {
        if (options.field === "quantity") return quantityEditor(options);
        else return textEditor(options);
    };

    const textEditor = (options: ColumnEditorOptions) => {
        //return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback && options.editorCallback(e.target.value)} />;
        return (
            <Dropdown
                value={options.value}
                options={props.products}
                onChange={(e) => options.editorCallback && options.editorCallback(e.value)}
                optionLabel="name"
                filter
                showClear
                filterBy="name"
                placeholder="Izvēlaties produktu"
            />
        );
    };

    const quantityEditor = (options: ColumnEditorOptions) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback && options.editorCallback(e.value)}
                mode="decimal"
            />
        );
    };

    const onRowEditComplete = (e: any) => {
        let _products = [...selectedProducts];
        let { newData, index } = e;

        _products[index] = newData;

        setSelectedProducts(_products);
    };

    const productsBodyTemplate = (rowData: any) => {
        return rowData.productName;
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
    console.log(selectedProducts, " selectedProducts");

    return (
        <div className="create-invoice-container">
            <div className="form-content">
                <div className="form-item customer-select">
                    <Dropdown
                        value={selectedCustomer}
                        options={props.customers}
                        onChange={onCustomerChange}
                        optionLabel="clientName"
                        filter
                        showClear
                        filterBy="clientName"
                        placeholder="Izvēlaties klientu"
                    />
                </div>
                <div className="form-item transport-select">
                    <Dropdown
                        value={selectedTransport}
                        options={props.transports}
                        onChange={onTransportChange}
                        optionLabel="name"
                        filter
                        showClear
                        filterBy="name"
                        placeholder="Izvēlaties transportu"
                    />
                </div>
                <div className="form-item driver-select">
                    <Dropdown
                        value={selectedDriver}
                        options={props.drivers}
                        onChange={onDriverChange}
                        optionLabel="name"
                        filter
                        showClear
                        filterBy="name"
                        placeholder="Izvēlaties vadītāju"
                    />
                </div>
            </div>
            <div className="form-item delivery-date">
                <h6>Piegādes datums:</h6>
                <Calendar
                    required
                    dateFormat="dd/mm/yy"
                    id="basic"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.value)}
                />
            </div>
            <div className="form-item payment-due-date">
                <h6>Samaksāt līdz:</h6>
                <Calendar
                    required
                    dateFormat="dd/mm/yy"
                    id="basic"
                    value={paymentDueDate}
                    onChange={(e) => setPaymentDueDate(e.value)}
                />
            </div>
            <DataTable
                className="editable-cells-table"
                editMode="row"
                value={[...selectedProducts, { id: 0, productName: "", quantity: 0, price: 0, unit: "", invoiceId: 0 }]}
                onRowEditComplete={onRowEditComplete}
            >
                <Column editor={(options) => productsEditor(options)} field="productName" header="Produkta nosaukums" />
                <Column editor={(options) => quantityEditor(options)} field="quantity" header="Skaits" />
                <Column
                    rowEditor
                    headerStyle={{ width: "10%", minWidth: "8rem" }}
                    bodyStyle={{ textAlign: "center" }}
                ></Column>
            </DataTable>
            <div className="form-footer">
                <span className="p-buttonset">
                    <Button onClick={props.toggleItemForm} label="Saglabāt" icon="pi pi-save" />
                    <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
                </span>
            </div>
        </div>
    );
}

export default CreateInvoice;
