import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { prisma } from '../prisma';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CustomerEdit from '../components/CustomerEdit';

export const getServerSideProps = async ({ req }) => {
    const customers = await prisma.customer.findMany()
    return { props: { customers } }
}




function clients({ customers }) {

    const [displayModal, setDisplayModal] = useState(false)
    function toggleItemForm() {
        setDisplayModal(!displayModal)
    }
    const footer =
        (<div>
            <Button  label="Saglabāt" icon="pi pi-save" />
            <Button onClick={()=>setDisplayModal(false)} label="Atcelt" icon="pi pi-times" />
        </div>
        )

    return (
        <div>
            <span className='p-buttonset'>
                <Button onClick={toggleItemForm} label='Jauns' icon="pi pi-file" />
                <Button onClick={toggleItemForm} label="Labot" icon="pi pi-pencil" />
                <Button  label="Dzēst" icon="pi pi-trash" />
            </span>

            <DataTable value={customers}>
                <Column field="name" header="Nosaukums"></Column>
                <Column field="email" header="E-pasts"></Column>
                <Column field="legalAdress" header="Adrese"></Column>
                <Column field="deliveryAdress" header="Piegādes adrese"></Column>
                <Column field="bankName" header="Banka"></Column>
                <Column field="pvnCode" header="PVN kods"></Column>
                <Column field="account" header="Konta numurs"></Column>
            </DataTable>
            <Dialog footer={footer} visible={displayModal} onHide={toggleItemForm}><CustomerEdit/></Dialog>
        </div>
    )
}

export default clients
