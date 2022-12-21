import { InputText } from "primereact/inputtext";
import * as React from "react";
import { Button } from "primereact/button";
import { ITransport } from "../pages/transport";
import { confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

interface ITransportEditProps {
    saveTransport: (transport: ITransport) => void;
    toggleItemForm: () => void;
    selectedData?: ITransport;
}

function TransportEdit(props: ITransportEditProps) {
    const formik = useFormik({
        initialValues: {
            name: props.selectedData?.name ?? "",
            number: props.selectedData?.number ?? ""
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.name) {
                errors.name = "Nosaukums ir obligāts.";
            } else if (data.name.length > 20) {
                errors.name = "Nosaukums nedrīkst būt garāks par 20 rakstzīmēm.";
            }
            if (!data.number) {
                errors.number = "Reģistrācijas numurs ir obligāts.";
            } else if (data.number.length > 10) {
                errors.number = "Reģistrācijas numurs nedrīkst būt garāks par 10 rakstzīmēm.";
            }

            return errors;
        },
        onSubmit: (data) => {
            onTransportSave(data);
        }
    });

    const isFormFieldValid = (name: keyof typeof formik.touched) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: keyof typeof formik.touched) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    function onTransportSave(data: ITransport) {
        props.saveTransport({
            name: data.name,
            number: data.number
        });
        props.toggleItemForm();
    }

    const confirm = () => {
        confirmDialog({
            message: "Vai tiešām vēlaties atcelt?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Jā",
            rejectLabel: "Nē",
            accept: props.toggleItemForm
        });
    };

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
                                Nosaukums
                            </label>
                        </span>
                        {getFormErrorMessage("name")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="number"
                                value={formik.values.number}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="number" className={classNames({ "p-error": isFormFieldValid("number") })}>
                                Reģistrācijas nummurs
                            </label>
                        </span>
                        {getFormErrorMessage("number")}
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

export default TransportEdit;
