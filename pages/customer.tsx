import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { prisma } from "../prisma";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
import CustomerEdit from "../components/CustomerEdit";
import { GetServerSideProps } from "next";
import { Customer } from "@prisma/client";

export interface ICustomer {
    clientName: string;
    email: string;
    legalAdress: string;
    deliveryAdress: string;
    bankName: string;
    pvnCode: string;
    account: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const customers = await prisma.customer.findMany();
    return { props: { customers } };
};

function clients({ customers }: { customers: Customer[] }) {
    const [displayModal, setDisplayModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(0);
    const [customerEdit, setCustomerEdit] = useState<ICustomer | undefined>(undefined);

    function toggleItemForm() {
        setDisplayModal(!displayModal);
    }

    function onEditCustomer() {
        const customer = customers.find((customer) => customer.id === selectedCustomer) as ICustomer;
        setCustomerEdit(customer);
        toggleItemForm();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveCustomer(customer: ICustomer) {
        const response = await fetch("/api/customers", {
            method: "POST",
            body: JSON.stringify(customer)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteCustomer(id: number) {
        console.log(JSON.stringify(id));
        const response = await fetch("/api/customers", {
            method: "DELETE",
            body: JSON.stringify(id)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    return (
        <div>
            <span className="p-buttonset">
                <Button onClick={toggleItemForm} label="Jauns" icon="pi pi-file" />
                <Button onClick={onEditCustomer} label="Labot" icon="pi pi-pencil" />
                <Button onClick={() => deleteCustomer(selectedCustomer)} label="Dzēst" icon="pi pi-trash" />
            </span>

            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={selectedCustomer}
                onSelectionChange={(e) => setSelectedCustomer(e.value.id)}
                value={customers}
            >
                <Column field="clientName" header="Nosaukums"></Column>
                <Column field="email" header="E-pasts"></Column>
                <Column field="legalAdress" header="Adrese"></Column>
                <Column field="deliveryAdress" header="Piegādes adrese"></Column>
                <Column field="bankName" header="Banka"></Column>
                <Column field="pvnCode" header="PVN kods"></Column>
                <Column field="account" header="Konta numurs"></Column>
            </DataTable>
            <Dialog visible={displayModal} onHide={toggleItemForm}>
                <CustomerEdit selectedData={customerEdit} toggleItemForm={toggleItemForm} saveCustomer={saveCustomer} />
            </Dialog>
        </div>
    );
}

export default clients;
