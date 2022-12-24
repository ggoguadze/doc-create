import { GetServerSideProps } from "next";
import React, { useRef, useState } from "react";
import { prisma } from "../prisma";
import { Driver, Transport, Customer, Products, Invoice } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CreateInvoice from "../components/CreateInvoice";
import { useEffect } from "react";
import { Toast } from "primereact/toast";

export interface IInvoice {
    dateDelivered: string;
    datePaymentDue: string;
    customerId: number;
    driverId: number;
    transportId: number;
    products: IInvoiceProduct[];
}

export interface IFullInvoice extends IInvoice {
    status: string;
    createdBy: string;
    dateCreated: string;
}

interface IInvoiceProduct {
    quantity: number;
    productName: string;
    price: number;
    unit: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const customers = await prisma.customer.findMany({ where: { isDeleted: false } });
    const products = await prisma.products.findMany();
    const drivers = await prisma.driver.findMany({ where: { isDeleted: false } });
    const transports = await prisma.transport.findMany({ where: { isDeleted: false } });
    const invoice = await prisma.invoice.findMany({
        include: {
            customer: true
        }
    });
    return { props: { customers, products, drivers, transports, invoice } };
};

export type InvoiceWithCustomer = Invoice & { customer: Customer };

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
    const [displaySigningModal, setDisplaySigningModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(0);
    const invoiceToast = useRef(null as any);

    useEffect(() => {
        if (displaySigningModal) {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    }, [displaySigningModal]);

    function toggleInvoiceItemForm() {
        if (!customers || !products || !drivers || !transports) {
            showError();
            return;
        }
        setDisplayInvoiceModal(!displayInvoiceModal);
    }

    const showError = () => {
        if (!invoiceToast.current) {
            return;
        }
        let msg: string = "";
        if (!customers) {
            msg = msg + "Sistēmā nav klienti ";
        }
        if (!products && msg.length === 0) {
            msg = msg + `Sistēmā nav produkti. `;
        } else if (!products) {
            msg = msg + `\nSistēmā nav produkti. `;
        }
        if (!drivers && msg.length === 0) {
            msg = msg + "Sistēmā nav vadītāji . ";
        } else if (!drivers) {
            msg = msg + `\nSistēmā nav vadītāji . `;
        }
        if (!transports && msg.length === 0) {
            msg = msg + "Sistēmā nav transportlīdzekļi. ";
        } else if (!transports) {
            msg = msg + `\nSistēmā nav transportlīdzekļi. `;
        }
        invoiceToast.current.show({ severity: "error", summary: "Kļūda", detail: msg, life: 3000 });
    };

    function toggleSigningModal(id?: number) {
        if (id) {
            setSelectedInvoiceId(id);
        }
        setDisplaySigningModal(!displaySigningModal);
    }

    function closeSigningModal() {
        setDisplaySigningModal(false);
        if (selectedInvoiceId) {
            updateSingleInvoiceStatus(selectedInvoiceId);
            setSelectedInvoiceId(0);
            return;
        }
        updateInvoiceStatus();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function createInvoicePdfs() {
        let blobArray: Blob[] = [];
        for await (const inv of invoice) {
            const response = await fetch("/api/invoicePdf", {
                method: "POST",
                body: JSON.stringify(inv.id)
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            blobArray.push(await response.blob());
        }
        return blobArray;
    }

    function downloadInvoices(pdfs: Blob[]) {
        for (const [i, pdf] of pdfs.entries()) {
            const url = URL.createObjectURL(pdf);
            const a = document.createElement("a");
            a.setAttribute(
                "download",
                `Pavadzīme-${invoice[i].customer.clientName}${new Date(
                    invoice[i].dateCreated
                ).toLocaleDateString()}.pdf`
            );
            a.setAttribute("href", url);
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
        }
    }

    async function signInvoice() {
        const pdfs = await createInvoicePdfs();
        downloadInvoices(pdfs);
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

    async function updateInvoiceStatus() {
        const response = await fetch("/api/invoice", {
            method: "PATCH",
            body: "SIGNED"
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function updateSingleInvoiceStatus(id: number) {
        const response = await fetch("/api/invoice", {
            method: "PATCH",
            body: JSON.stringify({ id, status: "SIGNED" })
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
        router.push(`/invoice/view/${id}`);
    }

    return (
        <>
            <Toast ref={invoiceToast} />
            <span className="p-buttonset">
                <Button onClick={toggleInvoiceItemForm} label="Jauna pavadzīme" icon="pi pi-file" />
                {invoice.some((inv) => inv.status === "UNSIGNED") && (
                    <Button
                        onClick={() => {
                            toggleSigningModal();
                        }}
                        label="Parakstīt"
                        icon="pi pi-pencil"
                    />
                )}

                <Button
                    onClick={() => {
                        signInvoice();
                    }}
                    label="Lejupielādēt pavadzīmes"
                    icon="pi pi-download"
                />
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
                    field="legalAdress"
                    header="Adrese"
                    body={(invoice: InvoiceWithCustomer) => {
                        return invoice.customer.legalAdress;
                    }}
                ></Column>
                <Column
                    field="statuss"
                    header="Statuss"
                    body={(invoice: InvoiceWithCustomer) => {
                        if (invoice.status === "SIGNED") {
                            return "Parakstīts";
                        }
                        return "Neparakstīts";
                    }}
                ></Column>
                <Column
                    body={(invoice: InvoiceWithCustomer) => {
                        return (
                            <span className="p-buttonset">
                                {invoice.status === "UNSIGNED" && (
                                    <Button
                                        onClick={() => toggleSigningModal(invoice.id)}
                                        label="Parakstīt"
                                        icon="pi pi-pencil"
                                    />
                                )}
                                <Button
                                    onClick={() => previewDocument(invoice.id)}
                                    label="Apskatīt"
                                    icon="pi pi-file"
                                />
                                <Button onClick={() => deleteInvoice(invoice.id)} label="Dzēst" icon="pi pi-trash" />
                            </span>
                        );
                    }}
                ></Column>
            </DataTable>
            <div className="create-invoice">
                <Dialog
                    blockScroll={true}
                    style={{ width: "60vw" }}
                    visible={displayInvoiceModal}
                    onHide={toggleInvoiceItemForm}
                    closeOnEscape={false}
                    closable={false}
                    draggable={false}
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

                        <h1>Simulēts parakstīšanas process</h1>

                        <Button onClick={() => closeSigningModal()} disabled={isLoading}>
                            Atgriezties elektronisko dokumentu sagatavotājā{" "}
                        </Button>
                    </div>
                </Dialog>
            </div>
        </>
    );
}

export default createInvoice;
