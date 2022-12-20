import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IDriver } from "../pages/driver";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface IDriverEditProps {
    saveDriver: (driver: IDriver) => void;
    toggleItemForm: () => void;
    selectedData?: IDriver;
}

function DriverEdit(props: IDriverEditProps) {
    const [driverName, setDriverName] = React.useState(props.selectedData?.name ?? "");

    const confirm = () => {
        confirmDialog({
            message: 'Vai tiešām vēlaties atcelt?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Jā',
            rejectLabel: 'Nē',
            accept: props.toggleItemForm
        });
    };

    function onDriverSave() {
        props.saveDriver({
            name: driverName
        });
        props.toggleItemForm();
    }

    return (
        <>
            <ConfirmDialog />
            <div className="form-content">
                <span className="p-float-label">
                    <InputText style={{ width: "18rem" }} id="driverName" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                    <label htmlFor="driverName">Nosaukums</label>
                </span>
            </div>
            <div className="form-footer" >
                <span className="p-buttonset">
                    <Button onClick={onDriverSave} label="Saglabāt" icon="pi pi-save" />
                    <Button onClick={confirm} label="Atcelt" icon="pi pi-times" />
                </span>
            </div>
        </>
    );
}

export default DriverEdit;
