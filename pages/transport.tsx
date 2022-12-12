import { prisma } from "../prisma";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import TransportEdit from "../components/TransportEdit";
import { Transport } from "@prisma/client";
import { GetServerSideProps } from "next";


export interface ITransport {
    name: string;
    number: string;
}
export interface IDriver {
    name: string;
}

export const getServerSideProps: GetServerSideProps = async () => {

    const transports = await prisma.transport.findMany();
    return { props: { transports } };
};
function otherData({ transports }: { transports: Transport[] }) {
    const [displayTransportModal, setDisplayTransportModal] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState(0);
    const [transportEdit, setTransportEdit] = useState<ITransport | undefined>(undefined);


    function toggleTransportItemForm() {
        setDisplayTransportModal(!displayTransportModal);
    }



    function onEditTransport() {
        const transport = transports.find((transport) => transport.id === selectedTransport) as ITransport;
        setTransportEdit(transport);
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
        const response = await fetch("/api/transport", {
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
                <span className="p-buttonset">
                    <Button onClick={toggleTransportItemForm} label="Jauns" icon="pi pi-file" />
                    <Button disabled={selectedTransport === 0} onClick={onEditTransport} label="Labot" icon="pi pi-pencil" />
                    <Button disabled={selectedTransport === 0} onClick={() => deleteTransport(selectedTransport)} label="Dzēst" icon="pi pi-trash" />
                </span>
                <DataTable
                    dataKey="id"
                    selectionMode="single"
                    selection={selectedTransport}
                    onSelectionChange={(e) => setSelectedTransport(e.value.id)}
                    value={transports}
                >
                    <Column style={{ width: '20px' }} selectionMode="single"></Column>
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
        </div>
    );
}

export default otherData;
