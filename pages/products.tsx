import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { prisma } from "../prisma";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import ProductsEdit from "../components/ProductsEdit";
import { Products } from "@prisma/client";
import { useRouter } from "next/router";

export interface IProduct {
    name: string;
    price: number;
}

export const getServerSideProps = async () => {
    const products = await prisma.products.findMany();
    return { props: { products } };
};

function products({ products }: { products: Products[] }) {
    const [displayModal, setDisplayModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [productEdit, setProductEdit] = useState<IProduct | undefined>(undefined);

    function toggleItemForm() {
        setDisplayModal(!displayModal);
    }
    function onEditCustomer() {
        const product = products.find((product) => product.id === selectedProduct) as IProduct;
        setProductEdit(product);
        toggleItemForm();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveProduct(product: IProduct) {
        const response = await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteProduct(id: number) {
        console.log(JSON.stringify(id));
        const response = await fetch("/api/products", {
            method: "DELETE",
            body: JSON.stringify(id)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    return (
        <div>
            <span className="p-buttonset">
                <Button onClick={toggleItemForm} label="Jauns" icon="pi pi-file" />
                <Button onClick={onEditCustomer} label="Labot" icon="pi pi-pencil" />
                <Button onClick={() => deleteProduct(selectedProduct)} label="Dzēst" icon="pi pi-trash" />
            </span>
            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={selectedProduct}
                onSelectionChange={(e) => setSelectedProduct(e.value.id)}
                value={products}
            >
                <Column field="name" header="Nosaukums"></Column>
                <Column field="price" header="Cena"></Column>
            </DataTable>
            <Dialog visible={displayModal} onHide={toggleItemForm}>
                <ProductsEdit selectedData={productEdit} toggleItemForm={toggleItemForm} saveProduct={saveProduct} />
            </Dialog>
        </div>
    );
}

export default products;
