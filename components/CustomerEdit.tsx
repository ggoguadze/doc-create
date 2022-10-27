import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from "primereact/button";
import { ICustomer } from '../pages/customer';

interface ICustumerEditProps {
    saveCustomer: (customer: ICustomer) => void;
    toggleItemForm: () => void;
}

function CustomerEdit(props: ICustumerEditProps) {
    const [clientName, setClientName] = useState("")
    const [email, setEmail] = useState("")
    const [legalAdress, setLegalAdress] = useState("")
    const [deliveryAdress, setDeliveryAdress] = useState("")
    const [bankName, setBankName] = useState("")
    const [pvnCode, setPvnCode] = useState("")
    const [account, setAccount] = useState("")
    
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
        <div className = "form-content">
            <span className="p-float-label">
                <InputText id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                <label htmlFor="clientName">Nosaukums</label>
            </span>

            <span className="p-float-label">
                <           InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">E-pasts</label>
            </span>

            <span className="p-float-label">
                <InputText id="legalAdress" value={legalAdress} onChange={(e) => setLegalAdress(e.target.value)} />
                <label htmlFor="legalAdress">Adrese</label>
            </span>

            <span className="p-float-label">
                <InputText id="deliveryAdress" value={deliveryAdress} onChange={(e) => setDeliveryAdress(e.target.value)} />
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

        <div className='form-footer'>
            <Button onClick = {onCustomerSave} label="Saglabāt" icon="pi pi-save" />
            <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
         </div>   
        </>
    )
}

export default CustomerEdit
