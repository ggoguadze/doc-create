import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { ITransport } from "../pages/otherData";

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

    return (
        <>
            <div className="form-content">
                <span className="p-float-label">
                    <InputText
                        id="transportName"
                        value={transportName}
                        onChange={(e) => setTransportName(e.target.value)}
                    />
                    <label htmlFor="transportName">Nosaukums</label>
                </span>

                <span className="p-float-label">
                    <InputText id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                    <label htmlFor="number">Reģistrācijas nummurs</label>
                </span>
            </div>
            <div className="form-footer">
                <Button onClick={onTransportSave} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </>
    );
}

export default TransportEdit;
