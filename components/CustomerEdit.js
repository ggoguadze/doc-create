import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

function CustomerEdit() {
    const [clientName, setClientName] = useState("")
    const [email, setEmail] = useState("")
    const [legalAdress, setLegalAdress] = useState("")
    const [deliveryAdress, setDeliveryAdress] = useState("")
    const [bankName, setBankName] = useState("")
    const [pvnCode, setPvnCode] = useState("")
    const [account, setAccount] = useState("")

    return (
        <>
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
                <InputNumber id="pvnCode" value={pvnCode} onChange={(e) => setPvnCode(e.target.value)} />
                <label htmlFor="pvnCode">PVN kods</label>
            </span>

            <span className="p-float-label">
                <InputText id="account" value={account} onChange={(e) => setAccount(e.target.value)} />
                <label htmlFor="account">Bankas Kods</label>
            </span>
        </>
    )
}

export default CustomerEdit
