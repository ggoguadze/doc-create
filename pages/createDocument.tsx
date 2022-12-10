import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { prisma } from "../prisma";
import { Driver, Transport, Customer, Products, Order } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CreateInvoice from "../components/createInvoice";
import CreateBill from "../components/CreateBill";

export interface IOrder {
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
    const orders = await prisma.order.findMany({
        include: {
            customer: true
        }
    });
    return { props: { customers, products, drivers, transports, orders } };
};

type OrderWithCustomer = Order & { customer: Customer };

function createDocument({
    customers,
    products,
    drivers,
    transports,
    orders
}: {
    customers: Customer[];
    products: Products[];
    drivers: Driver[];
    transports: Transport[];
    orders: OrderWithCustomer[];
}) {
    const [displayInvoiceModal, setDisplayInvoiceModal] = useState(false);
    const [displayBillModal, setDisplayBillModal] = useState(false);

    function toggleInvoiceItemForm() {
        setDisplayInvoiceModal(!displayInvoiceModal);
    }

    function toggleBillItemForm() {
        setDisplayBillModal(!displayBillModal);
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

    function previewDocument(id: number) {
        router.push(`/invoice/${id}`);
    }

    return (
        <>
            <span className="p-buttonset">
                <Button onClick={toggleBillItemForm} label="Jauns rēķins" icon="pi pi-file" />
                <Button onClick={toggleInvoiceItemForm} label="Jauna pavadzīme" icon="pi pi-file" />
                <Button disabled={orders.length === 0} label="Parakstīt" icon="pi pi-print" />
            </span>

            <DataTable dataKey="id" selectionMode="single" value={orders}>
                <Column
                    field="id"
                    header="Dokumenta numurs"
                    body={(order: OrderWithCustomer) => {
                        return order.id.toString().padStart(4, "0");
                    }}
                ></Column>
                <Column
                    field="dateCreated"
                    header="Izveides datums"
                    body={(order: OrderWithCustomer) => {
                        return new Date(order.dateCreated).toLocaleString();
                    }}
                ></Column>
                <Column
                    field="customer"
                    header="Klients"
                    body={(order: OrderWithCustomer) => {
                        return order.customer.clientName;
                    }}
                ></Column>
                <Column
                    field="customer"
                    header="Adrese"
                    body={(order: OrderWithCustomer) => {
                        return order.customer.legalAdress;
                    }}
                ></Column>
                <Column
                    body={(order: OrderWithCustomer) => {
                        return (
                            <>
                                <Button onClick={() => previewDocument(order.id)} label="Apskatīt" icon="pi pi-file" />
                                <Button onClick={() => deleteOrder(order.id)} label="Dzēst" icon="pi pi-file" />
                            </>
                        );
                    }}
                ></Column>
            </DataTable>

            <Dialog visible={displayInvoiceModal} onHide={toggleInvoiceItemForm}>
                <CreateInvoice toggleItemForm={toggleInvoiceItemForm} saveInvoice={saveOrder} />
            </Dialog>
            <Dialog visible={displayBillModal} onHide={toggleBillItemForm}>
                <CreateBill toggleItemForm={toggleBillItemForm} saveBill={saveOrder} />
            </Dialog>
        </>
    );
}

export default createDocument;
