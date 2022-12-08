import { prisma } from "../prisma";
import { useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import TransportEdit from "../components/TransportEdit";
import DriverEdit from "../components/DriverEdit";
import { Driver, Transport } from "@prisma/client";
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
    const transports = await prisma.transport.findMany();
    return { props: { drivers, transports } };
};
function otherData({ drivers, transports }: { drivers: Driver[]; transports: Transport[] }) {
    const [displayTransportModal, setDisplayTransportModal] = useState(false);
    const [displayDriverModal, setDisplayDriverModal] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState(0);
    const [selectedDriver, setSelectedDriver] = useState(0);
    const [transportEdit, setTransportEdit] = useState<ITransport | undefined>(undefined);
    const [driverEdit, setDriverEdit] = useState<IDriver | undefined>(undefined);

    function toggleTransportItemForm() {
        setDisplayTransportModal(!displayTransportModal);
    }

    function toggleDriverItemForm() {
        setDisplayDriverModal(!displayDriverModal);
    }

    function onEditTransport() {
        const transport = transports.find((transport) => transport.id === selectedTransport) as ITransport;
        setTransportEdit(transport);
        toggleTransportItemForm();
    }

    function onEditDriver() {
        const driver = drivers.find((driver) => driver.id === selectedDriver) as IDriver;
        setDriverEdit(driver);
        toggleTransportItemForm();
    }

    const router = useRouter();
    function refreshPage() {
        router.replace(router.asPath);
    }

    async function saveTransport(transport: ITransport) {
        const response = await fetch("/api/transport", {
            method: "POST",
            body: JSON.stringify(transport)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
    }

    async function deleteTransport(id: number) {
        console.log(JSON.stringify(id));
        const response = await fetch("/api/transport", {
            method: "DELETE",
            body: JSON.stringify(id)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json().then(() => refreshPage());
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
            <div className="transport-edit-container">
                <div>Transporti</div>
                <span className="p-buttonset">
                    <Button onClick={toggleTransportItemForm} label="Jauns" icon="pi pi-file" />
                    <Button onClick={onEditTransport} label="Labot" icon="pi pi-pencil" />
                    <Button onClick={() => deleteTransport(selectedTransport)} label="Dzēst" icon="pi pi-trash" />
                </span>
                <DataTable
                    dataKey="id"
                    selectionMode="single"
                    selection={selectedTransport}
                    onSelectionChange={(e) => setSelectedTransport(e.value.id)}
                    value={transports}
                >
                    <Column field="name" header="Nosaukums"></Column>
                    <Column field="number" header="Reģistrācijas nummurs"></Column>
                </DataTable>
                <Dialog visible={displayTransportModal} onHide={toggleTransportItemForm}>
                    <TransportEdit
                        selectedData={transportEdit}
                        toggleItemForm={toggleTransportItemForm}
                        saveTransport={saveTransport}
                    />
                </Dialog>
            </div>

            <div className="driver-edit-container">
                <div>Auto vadītāji</div>
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
