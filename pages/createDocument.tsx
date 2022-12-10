import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { prisma } from "../prisma";
import { Driver, Transport, Customer, Products } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface IOrder {
    invoiceNumber: string;
    date: string;
    driver: string;
    transportName: string;
    transportNumber: string;
    items: {
        name: string;
        quantity: string;
        price: string;
        total: string;
    }[];
}

export const getServerSideProps: GetServerSideProps = async () => {
    const customers = await prisma.customer.findMany();
    const products = await prisma.products.findMany();
    const drivers = await prisma.driver.findMany();
    const transports = await prisma.transport.findMany();
    const orders = await prisma.order.findMany();
    return { props: { customers, products, drivers, transports, orders } };
};

function createDocument({ customers, products, drivers, transports, orders }: { customers: Customer[]; products: Products[]; drivers: Driver[]; transports: Transport[], orders: any }) {
    const [displayModal, setDisplayModal] = useState(false);

    function toggleItemForm() {
        setDisplayModal(!displayModal);
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveOrder(order: IOrder) {
        const response = await fetch("/api/order", {
            method: "POST",
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteOrder(id: number) {
        const response = await fetch("/api/order", {
            method: "DELETE",
            body: JSON.stringify(id)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    return (
        <>
            <span className="p-buttonset">
                <Button label="Jauns rēķins" icon="pi pi-file" />
                <Button label="Jauna pavadzīme" icon="pi pi-file" />
                <Button disabled={orders.length === 0} label="Parakstīt" icon="pi pi-print" />
            </span>

            <Dialog visible={displayModal} onHide={toggleItemForm}>
                {/* Komponente InvoiceEdit */}
                {/* Komponente BillEdit */}
            </Dialog>
        </>
    );
}

export default createDocument;
