import { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import { prisma } from "../prisma";
import { Customer, Products, Bill } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CreateBill from "../components/CreateBill";
import { Toast } from "primereact/toast";

export interface IBill {
    datePaymentDue: string;
    customerId: number;
    products: IBillProduct[];
}

export interface IFullBill extends IBill {
    status: string;
    createdBy: string;
    dateCreated: string;
}

interface IBillProduct {
    quantity: number;
    productName: string;
    price: number;
    unit: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const customers = await prisma.customer.findMany({ where: { isDeleted: false } });
    const products = await prisma.products.findMany();
    const bill = await prisma.bill.findMany({
        include: {
            customer: true
        }
    });
    return { props: { customers, products, bill } };
};

type BillWithCustomer = Bill & { customer: Customer };

function createBill({
    customers,
    products,
    bill
}: {
    customers: Customer[];
    products: Products[];
    bill: BillWithCustomer[];
}) {
    const [displayBillModal, setDisplayBillModal] = useState(false);
    const [displaySigningModal, setDisplaySigningModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBillId, setSelectedBillId] = useState(0);
    const billToast = useRef(null as any);

    useEffect(() => {
        if (displaySigningModal) {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    }, [displaySigningModal]);

    function toggleBillItemForm() {
        if (!customers || !products) {
            showError();
            return;
        }
        setDisplayBillModal(!displayBillModal);
    }

    const showError = () => {
        if (!billToast.current) {
            return;
        }
        let msg: string = "";
        if (!customers) {
            msg = msg + "Sist??m?? nav klienti ";
        }
        if (!products && msg.length === 0) {
            msg = msg + `Sist??m?? nav produkti. `;
        } else if (!products) {
            msg = msg + `\nSist??m?? nav produkti. `;
        }
        billToast.current.show({ severity: "error", summary: "K????da", detail: msg, life: 3000 });
    };

    function toggleSigningModal(id?: number) {
        if (id) {
            setSelectedBillId(id);
        }
        setDisplaySigningModal(!displaySigningModal);
    }

    function closeSigningModal() {
        setDisplaySigningModal(false);
        if (selectedBillId) {
            updateSingleBillStatus(selectedBillId);
            setSelectedBillId(0);
            return;
        }
        updateBillStatus();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function createBillPdfs() {
        let blobArray: Blob[] = [];
        for await (const b of bill) {
            const response = await fetch("/api/billPdf", {
                method: "POST",
                body: JSON.stringify(b.id)
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            blobArray.push(await response.blob());
        }
        return blobArray;
    }

    function downloadBills(pdfs: Blob[]) {
        for (const [i, pdf] of pdfs.entries()) {
            const url = URL.createObjectURL(pdf);
            console.log(url, " url");
            const a = document.createElement("a");
            a.setAttribute(
                "download",
                `R????ins-${bill[i].customer.clientName}${new Date(bill[i].dateCreated).toLocaleDateString()}.pdf`
            );
            a.setAttribute("href", url);
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
        }
    }

    async function signBill() {
        const pdfs = await createBillPdfs();
        downloadBills(pdfs);
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

    async function updateBillStatus() {
        const response = await fetch("/api/bill", {
            method: "PATCH",
            body: "SIGNED"
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function updateSingleBillStatus(id: number) {
        const response = await fetch("/api/bill", {
            method: "PATCH",
            body: JSON.stringify({ id, status: "SIGNED" })
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
        router.push(`/bill/view/${id}`);
    }

    return (
        <>
            <Toast ref={billToast} />
            <span className="p-buttonset">
                <Button onClick={toggleBillItemForm} label="Jauns r????ins" icon="pi pi-file" />
                {bill.some((b) => b.status === "UNSIGNED") && (
                    <Button
                        onClick={() => {
                            toggleSigningModal();
                        }}
                        label="Parakst??t"
                        icon="pi pi-pencil"
                    />
                )}

                <Button
                    onClick={() => {
                        signBill();
                    }}
                    label="Lejupiel??d??t r????inus"
                    icon="pi pi-download"
                />
            </span>

            <DataTable dataKey="id" selectionMode="single" value={bill}>
                <Column
                    field="id"
                    header="R????ina numurs"
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
                    field="legalAdress"
                    header="Adrese"
                    body={(bill: BillWithCustomer) => {
                        return bill.customer.legalAdress;
                    }}
                ></Column>
                <Column
                    field="statuss"
                    header="Statuss"
                    body={(bill: BillWithCustomer) => {
                        if (bill.status === "SIGNED") {
                            return "Parakst??ts";
                        }
                        return "Neparakst??ts";
                    }}
                ></Column>
                <Column
                    body={(bill: BillWithCustomer) => {
                        return (
                            <span className="p-buttonset">
                                {bill.status === "UNSIGNED" && (
                                    <Button
                                        onClick={() => toggleSigningModal(bill.id)}
                                        label="Parakst??t"
                                        icon="pi pi-pencil"
                                    />
                                )}
                                <Button onClick={() => previewDocument(bill.id)} label="Apskat??t" icon="pi pi-file" />
                                <Button onClick={() => deleteBill(bill.id)} label="Dz??st" icon="pi pi-trash" />
                            </span>
                        );
                    }}
                ></Column>
            </DataTable>
            <div className="create-bill">
                <Dialog
                    blockScroll={true}
                    visible={displayBillModal}
                    onHide={toggleBillItemForm}
                    style={{ width: "60vw" }}
                    closeOnEscape={false}
                    closable={false}
                    draggable={false}
                >
                    <CreateBill
                        toggleItemForm={toggleBillItemForm}
                        saveBill={saveBill}
                        customers={customers}
                        products={products}
                    />
                </Dialog>
            </div>

            <div className="simulatedEsigning">
                <Dialog
                    blockScroll={true}
                    visible={displaySigningModal}
                    onHide={toggleSigningModal}
                    closeOnEscape={false}
                    closable={false}
                    maximized={true}
                    draggable={false}
                >
                    <div className="simulatedEsigning-content">
                        {isLoading && (
                            <div className="lds-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        )}

                        <h1>Simul??ts parakst????anas process</h1>

                        <Button onClick={() => closeSigningModal()} disabled={isLoading}>
                            Atgriezties elektronisko dokumentu sagatavot??j??{" "}
                        </Button>
                    </div>
                </Dialog>
            </div>
        </>
    );
}

export default createBill;
