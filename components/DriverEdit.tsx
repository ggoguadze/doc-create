import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { IDriver } from "../pages/driver";
import { confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

interface IDriverEditProps {
    saveDriver: (driver: IDriver) => void;
    toggleItemForm: () => void;
    selectedData?: IDriver;
}

function DriverEdit(props: IDriverEditProps) {
    const formik = useFormik({
        initialValues: {
            name: props.selectedData?.name ?? ""
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.name) {
                errors.name = "Vārds, uzvārds ir obligāts.";
            } else if (data.name.length > 30) {
                errors.name = "Vārds nedrīkst būt garāks par 30 rakstzīmēm.";
            } else if (!/^[a-zA-ZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ\s]*$/.test(data.name)) {
                errors.name = "Vārds nedrīkst saturēt ciparus vai speciālas rakstzīmes.";
            }

            return errors;
        },
        onSubmit: (data) => {
            onDriverSave(data);
        }
    });

    const isFormFieldValid = (name: keyof typeof formik.touched) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: keyof typeof formik.touched) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const confirm = () => {
        confirmDialog({
            message: "Vai tiešām vēlaties atcelt?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Jā",
            rejectLabel: "Nē",
            accept: props.toggleItemForm
        });
    };

    function onDriverSave(data: IDriver) {
        props.saveDriver({
            name: data.name
        });
        props.toggleItemForm();
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="form-content">
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>
                                Vārds, Uzvārds
                            </label>
                        </span>
                        {getFormErrorMessage("name")}
                    </div>
                </div>

                <div className="form-footer">
                    <span className="p-buttonset">
                        <Button type="submit" label="Saglabāt" icon="pi pi-save" />
                        <Button type="button" onClick={confirm} label="Atcelt" icon="pi pi-times" />
                    </span>
                </div>
            </form>
        </>
    );
}

export default DriverEdit;
