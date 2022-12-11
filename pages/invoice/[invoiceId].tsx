import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const product = [
    { "id": "1000", "name": "Saldais krējums", "price": 1.5, "unit": "kg", "quantity": 1 },
    { "id": "1001", "name": "Skābais krējums", "price": 1.5, "unit": "gab", "quantity": 12 },
    { "id": "1002", "name": "Kartupeļi", "price": 2.5, "unit": "kg", "quantity": 3 },
]
function invoiceDetail() {
    return (
        <div className='invoice-container'>
            <div className='header'>
                <div className='logo'>
                    <img src='/logo.png' alt='logo' />
                </div>
                <div className='date-created'>
                    2021-01-01
                </div>
                <div className='invoice-number'>
                    <h3>Pavadzīme</h3> Nr. 0001
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
                    <h6>Preču saņēmējs:</h6>
                    <h6>Juridiskā adrese:</h6>
                    <h6>Izkraušanas adrese:</h6>
                    <h6>Norēķinu rekvizīti:</h6>
                </div>
                <Divider />
                <div className='transport-driver-data'>
                    <h6>Transporta līdzeklis:</h6>
                    <h6>Vadītājs:</h6>
                </div>

                <div className='invoice-items'>
                    <DataTable value={product} responsiveLayout="scroll">
                        <Column field="name" header="Preču nosaukums"></Column>
                        <Column body={(product) => {
                            return product.quantity + ' ' + product.unit;
                        }} field="quantity" header="Daudzums"></Column>
                        <Column field="price" header="Cena"></Column>
                        <Column body={(product) => {
                            return product.quantity * product.price;
                        }} header="Summa"></Column>
                    </DataTable>
                </div>

                <div className='invoice-total'>
                    <h6>Kopā: {
                        product.reduce((total, product) => total + product.quantity * product.price, 0).toFixed(2)
                    } Eur</h6>
                    <h6>PVN 21%: {
                        (product.reduce((total, product) => total + product.quantity * product.price, 0) * 0.21).toFixed(2)
                    } Eur</h6>
                    <h6>Summa apmaksai: {
                        (product.reduce((total, product) => total + product.quantity * product.price, 0) * 1.21).toFixed(2)
                    } Eur</h6>
                </div>
            </div>
            <Divider />
            <div className='footer'>
                <div className='issued-by'>
                    <h6>Izsniedza</h6>
                    <h6>Vārds, uzvārds:</h6>
                    <h6>Paraksts:</h6>
                    <h6>Datums</h6>
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