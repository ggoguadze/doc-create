import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IOrder } from "../pages/createDocument";

interface ICreateInvoiceProps {
    saveInvoice: (invoice: IOrder) => void;
    toggleItemForm: () => void;
}

function CreateInvoice(props: ICreateInvoiceProps) {
    return (
        <>
            <div className="form-content">
                <span className="p-float-label">
                    <InputText id="invoiceName" />
                    <label htmlFor="invoiceName">Nosaukums</label>
                </span>
            </div>
            <div className="form-footer">
                <Button onClick={props.toggleItemForm} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </>
    );
}

export default CreateInvoice;
