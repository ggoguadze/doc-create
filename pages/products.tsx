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
    price: number | null;
    unit: string;
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
    function onEditProduct() {
        const product = products.find((product) => product.id === selectedProduct) as IProduct;
        setProductEdit(product);
        toggleItemForm();
    }

    function onCreateProduct() {
        setProductEdit(undefined);
        toggleItemForm();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveProduct(product: IProduct) {
        if (productEdit) {
            updateProduct(selectedProduct, product);
        } else {
            createProduct(product);
        }
    }

    async function createProduct(product: IProduct) {
        const response = await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function updateProduct(id: number, product: IProduct) {
        const response = await fetch("/api/products", {
            method: "PATCH",
            body: JSON.stringify({ id, product })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteProduct(id: number) {
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
                <Button onClick={onCreateProduct} label="Jauns" icon="pi pi-file" />
                <Button disabled={selectedProduct === 0} onClick={onEditProduct} label="Labot" icon="pi pi-pencil" />
                <Button
                    disabled={selectedProduct === 0}
                    onClick={() => deleteProduct(selectedProduct)}
                    label="Dzēst"
                    icon="pi pi-trash"
                />
            </span>
            <DataTable
                dataKey="id"
                selection={products.find((product) => product.id === selectedProduct)}
                onSelectionChange={(e) => {
                    e.value ? setSelectedProduct(e.value.id) : setSelectedProduct(0);
                }}
                value={products}
                emptyMessage="Nav datu"
            >
                <Column style={{ width: "20px" }} selectionMode="single"></Column>
                <Column field="name" header="Nosaukums"></Column>
                <Column field="price" header="Cena"></Column>
                <Column field="unit" header="Mērvienība"></Column>
            </DataTable>
            <Dialog
                blockScroll={true}
                draggable={false}
                closable={false}
                visible={displayModal}
                onHide={toggleItemForm}
                closeOnEscape={false}
            >
                <ProductsEdit selectedData={productEdit} toggleItemForm={toggleItemForm} saveProduct={saveProduct} />
            </Dialog>
        </div>
    );
}

export default products;
