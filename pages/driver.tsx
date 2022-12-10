import { prisma } from "../prisma";
import { useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import TransportEdit from "../components/TransportEdit";
import DriverEdit from "../components/DriverEdit";
import { Driver } from "@prisma/client";
import { GetServerSideProps } from "next";

export interface ITransport {
    name: string;
    number: string;
}
export interface IDriver {
    name: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const drivers = await prisma.driver.findMany();

    return { props: { drivers } };
};
function otherData({ drivers }: { drivers: Driver[] }) {
    const [displayDriverModal, setDisplayDriverModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(0);
    const [driverEdit, setDriverEdit] = useState<IDriver | undefined>(undefined);



    function toggleDriverItemForm() {
        setDisplayDriverModal(!displayDriverModal);
    }

    function onEditDriver() {
        const driver = drivers.find((driver) => driver.id === selectedDriver) as IDriver;
        setDriverEdit(driver);
        toggleDriverItemForm();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }


    async function saveDriver(driver: IDriver) {
        const response = await fetch("/api/driver", {
            method: "POST",
            body: JSON.stringify(driver)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteDriver(id: number) {
        console.log(JSON.stringify(id));
        const response = await fetch("/api/driver", {
            method: "DELETE",
            body: JSON.stringify(id)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    return (
        <div className="other-data-container">
            <div className="driver-edit-container">
                <span className="p-buttonset">
                    <Button onClick={toggleDriverItemForm} label="Jauns" icon="pi pi-file" />
                    <Button onClick={onEditDriver} label="Labot" icon="pi pi-pencil" />
                    <Button onClick={() => deleteDriver(selectedDriver)} label="Dzēst" icon="pi pi-trash" />
                </span>
                <DataTable
                    dataKey="id"
                    selectionMode="single"
                    selection={selectedDriver}
                    onSelectionChange={(e) => setSelectedDriver(e.value.id)}
                    value={drivers}
                >
                    <Column field="name" header="Vārds, Uzvārds"></Column>
                </DataTable>
                <Dialog visible={displayDriverModal} onHide={toggleDriverItemForm}>
                    <DriverEdit
                        selectedData={driverEdit}
                        toggleItemForm={toggleDriverItemForm}
                        saveDriver={saveDriver}
                    />
                </Dialog>
            </div>
        </div>
    );
}

export default otherData;
