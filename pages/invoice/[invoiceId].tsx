import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const products = [
    { "id": "1000", "code": "f230fh0g3", "name": "Bamboo Watch", "description": "Product Description", "image": "bamboo-watch.jpg", "price": 65, "category": "Accessories", "quantity": 24, "inventoryStatus": "INSTOCK", "rating": 5 },
    { "id": "1001", "code": "nvklal433", "name": "Black Watch", "description": "Product Description", "image": "black-watch.jpg", "price": 72, "category": "Accessories", "quantity": 61, "inventoryStatus": "INSTOCK", "rating": 4 },
    { "id": "1002", "code": "zz21cz3c1", "name": "Blue Band", "description": "Product Description", "image": "blue-band.jpg", "price": 79, "category": "Fitness", "quantity": 2, "inventoryStatus": "LOWSTOCK", "rating": 3 },
    { "id": "1003", "code": "244wgerg2", "name": "Blue T-Shirt", "description": "Product Description", "image": "blue-t-shirt.jpg", "price": 29, "category": "Clothing", "quantity": 25, "inventoryStatus": "INSTOCK", "rating": 5 },
    { "id": "1004", "code": "h456wer53", "name": "Bracelet", "description": "Product Description", "image": "bracelet.jpg", "price": 15, "category": "Accessories", "quantity": 73, "inventoryStatus": "INSTOCK", "rating": 4 },
    { "id": "1005", "code": "av2231fwg", "name": "Brown Purse", "description": "Product Description", "image": "brown-purse.jpg", "price": 120, "category": "Accessories", "quantity": 0, "inventoryStatus": "OUTOFSTOCK", "rating": 4 },
    { "id": "1006", "code": "bib36pfvm", "name": "Chakra Bracelet", "description": "Product Description", "image": "chakra-bracelet.jpg", "price": 32, "category": "Accessories", "quantity": 5, "inventoryStatus": "LOWSTOCK", "rating": 3 },
    { "id": "1007", "code": "mbvjkgip5", "name": "Galaxy Earrings", "description": "Product Description", "image": "galaxy-earrings.jpg", "price": 34, "category": "Accessories", "quantity": 23, "inventoryStatus": "INSTOCK", "rating": 5 },
    { "id": "1008", "code": "vbb124btr", "name": "Game Controller", "description": "Product Description", "image": "game-controller.jpg", "price": 99, "category": "Electronics", "quantity": 2, "inventoryStatus": "LOWSTOCK", "rating": 4 },
    { "id": "1009", "code": "cm230f032", "name": "Gaming Set", "description": "Product Description", "image": "gaming-set.jpg", "price": 299, "category": "Electronics", "quantity": 63, "inventoryStatus": "INSTOCK", "rating": 3 }
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
                <Divider />
                <div className='invoice-items'>
                    <DataTable value={products} responsiveLayout="scroll">
                        <Column field="code" header="Code"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="category" header="Category"></Column>
                        <Column field="quantity" header="Quantity"></Column>
                    </DataTable>
                </div>
                <Divider />
                <div className='invoice-total'>
                    <h6>Kopā:</h6>
                    <h6>PVN 21%:</h6>
                    <h6>Summa apmaksai:</h6>
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