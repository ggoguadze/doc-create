import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { prisma } from "../prisma";
import { Driver, Transport, Customer, Products, Invoice, InvoiceProduct } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CreateInvoice from "../components/CreateInvoice";

export interface IInvoice {
    dateCreated: string;
    dateDelivered: string;
    datePaymentDue: string;
    status: string;
    customerId: number;
    driverId: number;
    transportId: number;
    createdBy: string;
    products: InvoiceProduct[];
}

export const getServerSideProps: GetServerSideProps = async () => {
    const customers = await prisma.customer.findMany();
    const products = await prisma.products.findMany();
    const drivers = await prisma.driver.findMany();
    const transports = await prisma.transport.findMany();
    const invoice = await prisma.invoice.findMany({
        include: {
            customer: true
        }
    });
    return { props: { customers, products, drivers, transports, invoice } };
};

type InvoiceWithCustomer = Invoice & { customer: Customer };

function createInvoice({
    customers,
    products,
    drivers,
    transports,
    invoice
}: {
    customers: Customer[];
    products: Products[];
    drivers: Driver[];
    transports: Transport[];
    invoice: InvoiceWithCustomer[];
}) {
    const [displayInvoiceModal, setDisplayInvoiceModal] = useState(false);

    function toggleInvoiceItemForm() {
        setDisplayInvoiceModal(!displayInvoiceModal);
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function signInvoice() {
        // katram id savs requests
        const respone = await fetch("/api/invoicePdf", {
            method: "get",
            body: JSON.stringify()
        });
        //respone is array of arrayBuffers, save each arrayBuffer as pdf
        // const arrayBuffers = await respone.json();
        // arrayBuffers.forEach((arrayBuffer: any, index: number) => {
        //     const blob = new Blob([arrayBuffer], { type: "application/pdf" });
        //     const url = URL.createObjectURL(blob);
        //     const a = document.createElement("a");
        //     a.setAttribute(
        //         "download",
        //         `invoice_${invoice[index].customer.clientName}_${invoice[index].dateCreated}.pdf`
        //     );
        //     a.setAttribute("href", url);
        //     a.click();
        // });

        // refreshPage();
        console.log(respone.body);
        const blob = await respone.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("download", `invoice.pdf`);
        a.setAttribute("href", url);
        a.click();

        refreshPage();
    }

    async function saveInvoice(invoice: IInvoice) {
        const response = await fetch("/api/invoice", {
            method: "POST",
            body: JSON.stringify(invoice)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteInvoice(id: number) {
        const response = await fetch("/api/invoice", {
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
                <Button onClick={toggleInvoiceItemForm} label="Jauna pavadzīme" icon="pi pi-file" />
                <Button disabled={invoice.length === 0} onClick={signInvoice} label="Parakstīt" icon="pi pi-print" />
            </span>

            <DataTable dataKey="id" selectionMode="single" value={invoice}>
                <Column
                    field="id"
                    header="Pavadzīmes numurs"
                    body={(invoice: InvoiceWithCustomer) => {
                        return invoice.id.toString().padStart(4, "0");
                    }}
                ></Column>
                <Column
                    field="dateCreated"
                    header="Izveides datums"
                    body={(invoice: InvoiceWithCustomer) => {
                        return new Date(invoice.dateCreated).toLocaleString();
                    }}
                ></Column>
                <Column
                    field="customer"
                    header="Klients"
                    body={(invoice: InvoiceWithCustomer) => {
                        return invoice.customer.clientName;
                    }}
                ></Column>
                <Column
                    field="customer"
                    header="Adrese"
                    body={(invoice: InvoiceWithCustomer) => {
                        return invoice.customer.legalAdress;
                    }}
                ></Column>
                <Column
                    body={(invoice: InvoiceWithCustomer) => {
                        return (
                            <span className="p-buttonset">
                                <Button
                                    onClick={() => previewDocument(invoice.id)}
                                    label="Apskatīt"
                                    icon="pi pi-file"
                                />
                                <Button onClick={() => deleteInvoice(invoice.id)} label="Dzēst" icon="pi pi-file" />
                            </span>
                        );
                    }}
                ></Column>
            </DataTable>
            <div className="create-invoice">
                <Dialog
                    style={{ width: "50vw", height: "50vw" }}
                    visible={displayInvoiceModal}
                    onHide={toggleInvoiceItemForm}
                >
                    <CreateInvoice
                        customers={customers}
                        transports={transports}
                        drivers={drivers}
                        products={products}
                        toggleItemForm={toggleInvoiceItemForm}
                        saveInvoice={saveInvoice}
                    />
                </Dialog>
            </div>
        </>
    );
}

export default createInvoice;
