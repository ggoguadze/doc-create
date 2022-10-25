import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { prisma } from '../prisma';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import ProductsEdit from '../components/productsEdit';

export const getServerSideProps = async ({ req }) => {
    const product = await prisma.products.findMany()
    return { props: { product } }
}

function products({ product }) {
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
                <Button label="Dzēst" icon="pi pi-trash" />
            </span>
            <DataTable value={product}>
                <Column field="name" header="Nosaukums"></Column>
                <Column field="price" header="Cena"></Column>
            </DataTable>
            <Dialog footer={footer} visible={displayModal} onHide={toggleItemForm}><ProductsEdit/></Dialog>
        </div>
    )
}

export default products
