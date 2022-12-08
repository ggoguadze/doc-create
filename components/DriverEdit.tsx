import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IDriver } from "../pages/otherData";

interface IDriverEditProps {
    saveDriver: (driver: IDriver) => void;
    toggleItemForm: () => void;
    selectedData?: IDriver;
}

function DriverEdit(props: IDriverEditProps) {
    const [driverName, setDriverName] = React.useState(props.selectedData?.name ?? "");

    function onDriverSave() {
        props.saveDriver({
            name: driverName
        });
        props.toggleItemForm();
    }

    return (
        <>
            <div className="form-content">
                <span className="p-float-label">
                    <InputText id="driverName" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                    <label htmlFor="driverName">Nosaukums</label>
                </span>
            </div>
            <div className="form-footer">
                <Button onClick={onDriverSave} label="Saglabāt" icon="pi pi-save" />
                <Button onClick={props.toggleItemForm} label="Atcelt" icon="pi pi-times" />
            </div>
        </>
    );
}

export default DriverEdit;
