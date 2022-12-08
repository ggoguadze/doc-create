import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Button } from "primereact/button";
import { ICustomer } from "../pages/customer";

interface ICustumerEditProps {
    saveCustomer: (customer: ICustomer) => void;
    toggleItemForm: () => void;
    selectedData?: ICustomer;
}

function CustomerEdit(props: ICustumerEditProps) {
    const [clientName, setClientName] = useState(props.selectedData?.clientName ?? "");
    const [email, setEmail] = useState(props.selectedData?.email ?? "");
    const [legalAdress, setLegalAdress] = useState(props.selectedData?.legalAdress ?? "");
    const [deliveryAdress, setDeliveryAdress] = useState(props.selectedData?.deliveryAdress ?? "");
    const [bankName, setBankName] = useState(props.selectedData?.bankName ?? "");
    const [pvnCode, setPvnCode] = useState(props.selectedData?.pvnCode ?? "");
    const [account, setAccount] = useState(props.selectedData?.account ?? "");

    function onCustomerSave() {
        props.saveCustomer({
            clientName,
            email,
            legalAdress,
            deliveryAdress,
            bankName,
            pvnCode,
            account
        });
        props.toggleItemForm();
    }

    return (
        <>
            <div className="form-content">
                <span className="p-float-label">
                    <InputText id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    <label htmlFor="clientName">Nosaukums</label>
                </span>

                <span className="p-float-label">
                    <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">E-pasts</label>
                </span>

                <span className="p-float-label">
                    <InputText id="legalAdress" value={legalAdress} onChange={(e) => setLegalAdress(e.target.value)} />
                    <label htmlFor="legalAdress">Adrese</label>
                </span>

                <span className="p-float-label">
                    <InputText
                        id="deliveryAdress"
                        value={deliveryAdress}
                        onChange={(e) => setDeliveryAdress(e.target.value)}
                    />
                    <label htmlFor="deliveryAdress">Piegādes adrese</label>
                </span>

                <span className="p-float-label">
                    <InputText id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                    <label htmlFor="bankName">Banka</label>
                </span>

                <span className="p-float-label">
                    <InputText id="pvnCode" value={pvnCode} onChange={(e) => setPvnCode(e.target.value)} />
                    <label htmlFor="pvnCode">PVN kods</label>
                </span>

                <span className="p-float-label">
                    <InputText id="account" value={account} onChange={(e) => setAccount(e.target.value)} />
                    <label htmlFor="account">Bankas Kods</label>
                </span>
            </div>

            <div className="form-footer">
                <Button onClick={onCustomerSave} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </>
    );
}

export default CustomerEdit;
