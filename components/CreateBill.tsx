import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IBill } from "../pages/createBill";


interface ICreateBillProps {
    saveBill: (bill: IBill) => void;
    toggleItemForm: () => void;
}

function CreateBill(props: ICreateBillProps) {
    return (
        <div className="create-bill-container">
            <div className="form-content">
                <span className="p-float-label">
                    <InputText id="billName" />
                    <label htmlFor="billName">Nosaukums</label>
                </span>
            </div>
            <div className="form-footer">
                <Button onClick={props.toggleItemForm} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </div>
    );
}

export default CreateBill;
