import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { ITransport } from "../pages/transport";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface ITransportEditProps {
    saveTransport: (transport: ITransport) => void;
    toggleItemForm: () => void;
    selectedData?: ITransport;
}

function TransportEdit(props: ITransportEditProps) {
    const [transportName, setTransportName] = React.useState(props.selectedData?.name ?? "");
    const [number, setNumber] = React.useState(props.selectedData?.number ?? "");

    function onTransportSave() {
        props.saveTransport({
            name: transportName,
            number
        });
        props.toggleItemForm();
    }

    const confirm = () => {
        confirmDialog({
            message: 'Vai tiešām vēlaties atcelt?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Jā',
            rejectLabel: 'Nē',
            accept: props.toggleItemForm
        });
    };

    return (
        <>
            <ConfirmDialog />
            <div className="form-content">
                <span className="p-float-label">
                    <InputText
                        style={{ width: "18rem" }}
                        id="transportName"
                        value={transportName}
                        onChange={(e) => setTransportName(e.target.value)}
                    />
                    <label htmlFor="transportName">Nosaukums</label>
                </span>

                <span className="p-float-label">
                    <InputText style={{ width: "18rem" }} id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                    <label htmlFor="number">Reģistrācijas nummurs</label>
                </span>
            </div>
            <div className="form-footer">
                <span className="p-buttonset">
                    <Button onClick={onTransportSave} label="Saglabāt" icon="pi pi-save" />
                    <Button onClick={confirm} label="Atcelt" icon="pi pi-times" />
                </span>
            </div>
        </>
    );
}

export default TransportEdit;
