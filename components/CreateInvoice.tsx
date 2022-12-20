import { Button } from "primereact/button";
import { IInvoice } from "../pages/createInvoice";
import { Dropdown } from "primereact/dropdown";
import { Driver, Transport, Customer, Products, InvoiceProduct } from "@prisma/client";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

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
    const { user } = useUser();

    const confirm = () => {
        confirmDialog({
            message: 'Vai tiešām vēlaties atcelt?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Jā',
            rejectLabel: 'Nē',
            accept: props.toggleItemForm
        });
    };

    function onInvoiceSave() {
        props.saveInvoice({
            dateCreated: new Date().toISOString(),
            dateDelivered: deliveryDate as string,
            datePaymentDue: paymentDueDate as string,
            status: "UNSIGNED",
            customerId: selectedCustomer.id,
            driverId: selectedDriver.id,
            transportId: selectedTransport.id,
            createdBy: user?.name as string,
            products: selectedProducts
        });
        props.toggleItemForm();
    }

    const onCustomerChange = (e: { value: any }) => {
        setSelectedCustomer(e.value);
    };

    const onTransportChange = (e: { value: any }) => {
        setSelectedTransport(e.value);
    };

    const onDriverChange = (e: { value: any }) => {
        setSelectedDriver(e.value);
    };

    const quantityEditor = (options: ColumnEditorOptions) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback && options.editorCallback(e.value)}
            />
        );
    };

    const onRowEditComplete = (e: any) => {
        let _products = [...selectedProducts];
        let { newData, index } = e;

        _products[index] = newData;

        setSelectedProducts(_products);
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
            <ConfirmDialog />
            <div className="create-invoice-container">
                <div className="form-content">
                    <div className="form-selector-container">
                        <div className="form-dropdown-selectors">
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
                                    style={{ width: "18rem" }}
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
                                    style={{ width: "18rem" }}
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
                                    style={{ width: "18rem" }}
                                />
                            </div>
                        </div>
                        <div className="form-calendar-selectors">
                            <div className="form-item delivery-date">
                                <span className="p-float-label">
                                    <Calendar
                                        style={{ width: "18rem" }}
                                        required
                                        dateFormat="dd/mm/yy"
                                        id="basic"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.value)}
                                    />
                                    <label htmlFor="calendar">Piegādes datums</label>
                                </span>
                            </div>
                            <div className="form-item payment-due-date">
                                <span className="p-float-label">
                                    <Calendar
                                        style={{ width: "18rem" }}
                                        required
                                        dateFormat="dd/mm/yy"
                                        id="basic"
                                        value={paymentDueDate}
                                        onChange={(e) => setPaymentDueDate(e.value)}
                                    />
                                    <label htmlFor="calendar">Maksājuma termiņš</label>
                                </span>
                            </div>
                        </div>
                    </div>
                    <DataTable
                        style={{ width: "90%" }}
                        className="editable-cells-table"
                        editMode="row"
                        value={[
                            ...selectedProducts,
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
                </div>
                <div className="form-footer">
                    <span className="p-buttonset">
                        <Button onClick={onInvoiceSave} label="Saglabāt" icon="pi pi-save" />
                        <Button onClick={confirm} label="Atcelt" icon="pi pi-times" />
                    </span>
                </div>
            </div>
        </>
    );
}

export default CreateInvoice;
