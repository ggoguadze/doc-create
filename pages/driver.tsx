import { prisma } from "../prisma";
import { useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import DriverEdit from "../components/DriverEdit";
import { Driver } from "@prisma/client";
import { GetServerSideProps } from "next";

export interface IDriver {
    name: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const drivers = await prisma.driver.findMany({ where: { isDeleted: false } });

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

    function onCreateDriver() {
        setDriverEdit(undefined);
        toggleDriverItemForm();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveDriver(driver: IDriver) {
        if (driverEdit) {
            updateDriver(selectedDriver, driver);
        } else {
            createDriver(driver);
        }
    }

    async function createDriver(driver: IDriver) {
        const response = await fetch("/api/driver", {
            method: "POST",
            body: JSON.stringify(driver)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function updateDriver(id: number, driver: IDriver) {
        const response = await fetch("/api/driver", {
            method: "PATCH",
            body: JSON.stringify({ id, driver })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteDriver(id: number) {
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
                    <Button onClick={onCreateDriver} label="Jauns" icon="pi pi-file" />
                    <Button disabled={selectedDriver === 0} onClick={onEditDriver} label="Labot" icon="pi pi-pencil" />
                    <Button
                        disabled={selectedDriver === 0}
                        onClick={() => deleteDriver(selectedDriver)}
                        label="Dzēst"
                        icon="pi pi-trash"
                    />
                </span>
                <DataTable
                    dataKey="id"
                    selection={drivers.find((driver) => driver.id === selectedDriver)}
                    onSelectionChange={(e) => {
                        e.value ? setSelectedDriver(e.value.id) : setSelectedDriver(0);
                    }}
                    value={drivers}
                    emptyMessage="Nav datu"
                >
                    <Column style={{ width: "20px" }} selectionMode="single"></Column>
                    <Column field="name" header="Vārds, Uzvārds"></Column>
                </DataTable>
                <Dialog
                    blockScroll={true}
                    draggable={false}
                    closable={false}
                    visible={displayDriverModal}
                    onHide={toggleDriverItemForm}
                    closeOnEscape={false}
                >
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
