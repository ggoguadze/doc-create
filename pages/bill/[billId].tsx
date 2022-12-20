import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { GetServerSidePropsContext } from "next";
import { prisma } from "../../prisma";
import { Customer, BillProduct, Bill, User } from "@prisma/client";
import { ParsedUrlQuery } from "querystring";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { billId } = context.params as ParsedUrlQuery;
    const bill = await prisma.bill.findUnique({
        where: {
            id: Number(billId)
        },
        include: {
            customer: true,
            billProducts: true
        }
    });
    const user = await prisma.user.findMany();
    return { props: { bill, user } };
}

type BillWithData = Bill & { customer: Customer; billProducts: BillProduct[] };

function billDetail({ bill, user }: { bill: BillWithData; user: User[] }) {
    const userInfo = user[0];
    return (
        <div className="bill-container">
            <div className="page">
                <div className="header">
                    <div className="logo">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <div className="date-created">{new Date(bill.dateCreated).toLocaleString()}</div>
                    <div className="bill-number">
                        <h3>Rēķins</h3> Nr. {bill.id.toString().padStart(4, "0")}
                    </div>
                </div>
                <Divider />
                <div className="content">
                    <div className="own-firm-data">
                        <h6>Nosūtītājs: {userInfo.name}</h6>
                        <h6>Juridiskā adrese: {userInfo.legalAdress}</h6>
                        <h6>Norēķinu rekvizīti: {userInfo.bankName + " " + userInfo.account}</h6>
                    </div>
                    <Divider />
                    <div className="customer-data">
                        <h6>Preču saņēmējs: {bill.customer.clientName}</h6>
                        <h6>Juridiskā adrese: {bill.customer.legalAdress}</h6>
                        <h6>Norēķinu rekvizīti: {bill.customer.bankName + " " + bill.customer.account}</h6>
                    </div>
                    <Divider />
                    <div className="bill-items">
                        <DataTable value={bill.billProducts} responsiveLayout="scroll">
                            <Column field="productName" header="Preču nosaukums"></Column>
                            <Column
                                body={(product: BillProduct) => {
                                    return product.quantity + " " + product.unit;
                                }}
                                field="quantity"
                                header="Daudzums"
                            ></Column>
                            <Column field="price" header="Cena"></Column>
                            <Column
                                body={(product: BillProduct) => {
                                    return product.quantity * product.price;
                                }}
                                header="Summa"
                            ></Column>
                        </DataTable>
                    </div>

                    <div className="bill-total">
                        <h6>
                            Kopā:{" "}
                            {bill.billProducts
                                .reduce((total, product) => total + product.quantity * product.price, 0)
                                .toFixed(2)}{" "}
                            Eur
                        </h6>
                        <h6>
                            PVN 21%:{" "}
                            {(
                                bill.billProducts.reduce((total, product) => total + product.quantity * product.price, 0) *
                                0.21
                            ).toFixed(2)}{" "}
                            Eur
                        </h6>
                        <h6>
                            Summa apmaksai:{" "}
                            {(
                                bill.billProducts.reduce((total, product) => total + product.quantity * product.price, 0) *
                                1.21
                            ).toFixed(2)}{" "}
                            Eur
                        </h6>
                    </div>
                </div>
                <Divider />
                <div className="footer">
                    <div className="issued-by">
                        <h6>Izsniedza</h6>
                        <h6>Vārds, uzvārds: {bill.createdBy}</h6>
                        <h6>Paraksts: {bill.status === "SIGNED" ? "PARAKSTĪTS" : ""}</h6>
                        <h6>Datums: </h6>
                    </div>
                    <Divider layout="vertical" />
                    <div className="issued-to">
                        <div className="issued-by">
                            <h6>Saņēma</h6>
                            <h6>Vārds, uzvārds:</h6>
                            <h6>Paraksts:</h6>
                            <h6>Datums</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default billDetail;
