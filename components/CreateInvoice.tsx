import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IInvoice } from "../pages/createInvoice";
import { Dropdown } from 'primereact/dropdown';
import { Driver, Transport, Customer, Products } from "@prisma/client";
import { useState } from "react";
import { Calendar } from 'primereact/calendar';


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
    console.log(deliveryDate)
    console.log(paymentDueDate)

    const onCustomerChange = (e: { value: any }) => {
        setSelectedCustomer(e.value);
    }

    const onTransportChange = (e: { value: any }) => {
        setSelectedTransport(e.value);
    }

    const onDriverChange = (e: { value: any }) => {
        setSelectedDriver(e.value);
    }


    return (
        <div className="create-invoice-container">
            <div className="form-content">
                <div className="form-item customer-select">
                    <Dropdown value={selectedCustomer} options={props.customers} onChange={onCustomerChange} optionLabel="clientName" filter showClear filterBy="clientName" placeholder="Izvēlaties klientu" />
                </div>
                <div className="form-item transport-select">
                    <Dropdown value={selectedTransport} options={props.transports} onChange={onTransportChange} optionLabel="name" filter showClear filterBy="name" placeholder="Izvēlaties transportu" />
                </div>
                <div className="form-item driver-select">
                    <Dropdown value={selectedDriver} options={props.drivers} onChange={onDriverChange} optionLabel="name" filter showClear filterBy="name" placeholder="Izvēlaties vadītāju" />
                </div>
            </div>
            <div className="form-item delivery-date">
                <Calendar id="basic" value={deliveryDate} onChange={(e) => setDeliveryDate(e.value)} />
            </div>
            <div className="form-item payment-due-date">
                <Calendar id="basic" value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.value)} />
            </div>
            <div className="form-footer">
                <Button onClick={props.toggleItemForm} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </div>
    );
}

export default CreateInvoice;
