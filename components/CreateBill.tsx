import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IBill } from "../pages/createBill";
import { Customer, Products, BillProduct } from "@prisma/client";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

interface ICreateBillProps {
    saveBill: (bill: IBill) => void;
    toggleItemForm: () => void;
    customers: Customer[];
    products: Products[];
}

function CreateBill(props: ICreateBillProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [paymentDueDate, setPaymentDueDate] = useState<Date | Date[] | undefined | null | string>(undefined);
    const [selectedProducts, setSelectedProducts] = useState<BillProduct[]>([
        { id: 1, productName: "Produkts 1", quantity: 1, price: 2, unit: "kg", billId: 1 }
    ]);
    const { user } = useUser();

    function onBillSave() {
        props.saveBill({
            dateCreated: new Date().toISOString(),
            datePaymentDue: paymentDueDate as string,
            status: "UNSIGNED",
            customerId: selectedCustomer.id,
            createdBy: user?.name as string,
            products: selectedProducts
        });
        props.toggleItemForm();
    }

    const onCustomerChange = (e: { value: any }) => {
        setSelectedCustomer(e.value);
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
        <div className="create-bill-container">
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
                <div className="form-item payment-due-date">
                    <span className="p-float-label">
                        <Calendar
                            required
                            dateFormat="dd/mm/yy"
                            id="basic"
                            value={paymentDueDate}
                            onChange={(e) => setPaymentDueDate(e.value)}
                        />
                        <label htmlFor="calendar">Maksājuma termiņš</label>
                    </span>
                </div>
                <DataTable
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
                    <Button onClick={onBillSave} label="Saglabāt" icon="pi pi-save" />
                    <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
                </span>
            </div>
        </div>
    );
}

export default CreateBill;
