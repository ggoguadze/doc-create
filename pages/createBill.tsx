import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { prisma } from "../prisma";
import { Driver, Transport, Customer, Products, Bill } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CreateBill from "../components/CreateBill";

export interface IBill {
    billNumber: string;
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
    const bill = await prisma.bill.findMany({
        include: {
            customer: true
        }
    });
    return { props: { customers, products, drivers, transports, bill } };
};

type BillWithCustomer = Bill & { customer: Customer };

function createBill({
    customers,
    products,
    drivers,
    transports,
    bill
}: {
    customers: Customer[];
    products: Products[];
    drivers: Driver[];
    transports: Transport[];
    bill: BillWithCustomer[];
}) {

    const [displayBillModal, setDisplayBillModal] = useState(false);



    function toggleBillItemForm() {
        setDisplayBillModal(!displayBillModal);
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveBill(bill: IBill) {
        const response = await fetch("/api/bill", {
            method: "POST",
            body: JSON.stringify(bill)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteBill(id: number) {
        const response = await fetch("/api/bill", {
            method: "DELETE",
            body: JSON.stringify(id)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    function previewDocument(id: number) {
        router.push(`/bill/${id}`);
    }

    return (
        <>
            <span className="p-buttonset">
                <Button onClick={toggleBillItemForm} label="Jauns rēķins" icon="pi pi-file" />
                <Button disabled={bill.length === 0} label="Parakstīt" icon="pi pi-print" />
            </span>

            <DataTable dataKey="id" selectionMode="single" value={bill}>
                <Column
                    field="id"
                    header="Rēķina numurs"
                    body={(bill: BillWithCustomer) => {
                        return bill.id.toString().padStart(4, "0");
                    }}
                ></Column>
                <Column
                    field="dateCreated"
                    header="Izveides datums"
                    body={(bill: BillWithCustomer) => {
                        return new Date(bill.dateCreated).toLocaleString();
                    }}
                ></Column>
                <Column
                    field="customer"
                    header="Klients"
                    body={(bill: BillWithCustomer) => {
                        return bill.customer.clientName;
                    }}
                ></Column>
                <Column
                    field="customer"
                    header="Adrese"
                    body={(bill: BillWithCustomer) => {
                        return bill.customer.legalAdress;
                    }}
                ></Column>
                <Column
                    body={(bill: BillWithCustomer) => {
                        return (
                            <>
                                <Button onClick={() => previewDocument(bill.id)} label="Apskatīt" icon="pi pi-file" />
                                <Button onClick={() => deleteBill(bill.id)} label="Dzēst" icon="pi pi-file" />
                            </>
                        );
                    }}
                ></Column>
            </DataTable>


            <Dialog visible={displayBillModal} onHide={toggleBillItemForm}>
                <CreateBill toggleItemForm={toggleBillItemForm} saveBill={saveBill} />
            </Dialog>
        </>
    );
}

export default createBill;
