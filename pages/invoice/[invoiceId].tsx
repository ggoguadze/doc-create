import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GetServerSidePropsContext } from "next";
import { prisma } from "../../prisma";
import { Driver, Transport, Customer, InvoiceProduct, Invoice } from "@prisma/client";
import { ParsedUrlQuery } from 'querystring';


const products = [
    { "id": "1000", "name": "Saldais krējums", "price": 1.5, "unit": "kg", "quantity": 1 },
    { "id": "1001", "name": "Skābais krējums", "price": 1.5, "unit": "gab", "quantity": 12 },
    { "id": "1002", "name": "Kartupeļi", "price": 2.5, "unit": "kg", "quantity": 3 },
]





export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { invoiceId } = context.params as ParsedUrlQuery;
    const invoice = await prisma.invoice.findUnique({
        where: {
            id: Number(invoiceId)
        },
        include: {
            customer: true,
            driver: true,
            transport: true,
            invoiceProducts: true
        }
    });
    return { props: invoice }

}


type InvoiceWithCustomer = Invoice & { customer: Customer, driver: Driver, transport: Transport, invoiceProducts: InvoiceProduct[] };



function invoiceDetail(invoice: InvoiceWithCustomer) {
    console.log(JSON.stringify(invoice.invoiceProducts, null, 2))
    return (
        <div className='invoice-container'>
            <div className='header'>
                <div className='logo'>
                    <img src='/logo.png' alt='logo' />
                </div>
                <div className='date-created'>
                    {new Date(invoice.dateCreated).toLocaleString()}
                </div>
                <div className='invoice-number'>
                    <h3>Pavadzīme</h3> Nr. {invoice.id.toString().padStart(4, "0")}
                </div>
            </div>
            <Divider />
            <div className='content'>
                <div className='own-firm-data'>
                    <h6>Nosūtītājs:</h6>
                    <h6>Juridiskā adrese:</h6>
                    <h6>Iekraušanas adrese:</h6>
                    <h6>Norēķinu rekvizīti:</h6>
                </div>
                <Divider />
                <div className='customer-data'>
                    <h6>Preču saņēmējs: {invoice.customer.clientName}</h6>
                    <h6>Juridiskā adrese: {invoice.customer.legalAdress}</h6>
                    <h6>Izkraušanas adrese: {invoice.customer.deliveryAdress}</h6>
                    <h6>Norēķinu rekvizīti: {invoice.customer.bankName + " " + invoice.customer.account}</h6>
                </div>
                <Divider />
                <div className='transport-driver-data'>
                    <h6>Transporta līdzeklis:</h6>
                    <h6>Vadītājs:</h6>
                </div>

                <div className='invoice-items'>
                    <DataTable value={invoice.invoiceProducts} responsiveLayout="scroll">
                        <Column field="productName" header="Preču nosaukums"></Column>
                        <Column body={(product: InvoiceProduct) => {
                            return product.quantity + ' ' + product.unit
                        }} field="quantity" header="Daudzums"></Column>
                        <Column field="price" header="Cena"></Column>
                        <Column body={(product: InvoiceProduct) => {
                            return product.quantity * product.price
                        }} header="Summa"></Column>
                    </DataTable>
                </div>

                <div className='invoice-total'>
                    <h6>Kopā: {
                        invoice.invoiceProducts.reduce((total, product) => total + product.quantity * product.price, 0).toFixed(2)
                    } Eur</h6>
                    <h6>PVN 21%: {
                        (invoice.invoiceProducts.reduce((total, product) => total + product.quantity * product.price, 0) * 0.21).toFixed(2)
                    } Eur</h6>
                    <h6>Summa apmaksai: {
                        (invoice.invoiceProducts.reduce((total, product) => total + product.quantity * product.price, 0) * 1.21).toFixed(2)
                    } Eur</h6>
                </div>
            </div>
            <Divider />
            <div className='footer'>
                <div className='issued-by'>
                    <h6>Izsniedza</h6>
                    <h6>Vārds, uzvārds: {invoice.createdBy}</h6>
                    <h6>Paraksts:</h6>
                    <h6>Datums: </h6>
                </div>
                <Divider layout="vertical" />
                <div className='issued-to'>
                    <div className='issued-by'>
                        <h6>Saņēma</h6>
                        <h6>Vārds, uzvārds:</h6>
                        <h6>Paraksts:</h6>
                        <h6>Datums</h6>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default invoiceDetail