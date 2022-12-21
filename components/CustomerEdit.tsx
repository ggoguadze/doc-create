import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { ICustomer } from "../pages/customer";
import { confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

interface ICustumerEditProps {
    saveCustomer: (customer: ICustomer) => void;
    toggleItemForm: () => void;
    selectedData?: ICustomer;
}

function CustomerEdit(props: ICustumerEditProps) {
    const formik = useFormik({
        initialValues: {
            clientName: props.selectedData?.clientName ?? "",
            email: props.selectedData?.email ?? "",
            legalAdress: props.selectedData?.legalAdress ?? "",
            deliveryAdress: props.selectedData?.deliveryAdress ?? "",
            bankName: props.selectedData?.bankName ?? "",
            pvnCode: props.selectedData?.pvnCode ?? "",
            account: props.selectedData?.account ?? ""
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.clientName) {
                errors.name = "Nosaukums ir obligāts.";
            } else if (data.clientName.length > 20) {
                errors.name = "Nosaukums nedrīkst būt garāks par 20 rakstzīmēm.";
            }

            if (!data.email) {
                errors.email = "E-pasts ir obligāts.";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
                errors.email = "Nepareizs e-pasta formāts.";
            }

            if (!data.legalAdress) {
                errors.legalAdress = "Juridiskā adrese ir obligāta.";
            } else if (data.legalAdress.length > 50) {
                errors.legalAdress = "Juridiskā adrese nedrīkst būt garāka par 50 rakstzīmēm.";
            }

            if (!data.deliveryAdress) {
                errors.deliveryAdress = "Piegādes adrese ir obligāta.";
            } else if (data.deliveryAdress.length > 50) {
                errors.deliveryAdress = "Piegādes adrese nedrīkst būt garāka par 50 rakstzīmēm.";
            }

            if (!data.bankName) {
                errors.bankName = "Bankas nosaukums ir obligāts.";
            } else if (data.bankName.length > 20) {
                errors.bankName = "Bankas nosaukums nedrīkst būt garāks par 20 rakstzīmēm.";
            }

            if (!data.pvnCode) {
                errors.pvnCode = "PVN kods ir obligāts.";
            } else if (data.pvnCode.length > 20) {
                errors.pvnCode = "PVN kods nedrīkst būt garāks par 20 rakstzīmēm.";
            }

            if (!data.account) {
                errors.account = "Konta numurs ir obligāts.";
            } else if (data.account.length > 20) {
                errors.account = "Konta numurs nedrīkst būt garāks par 20 rakstzīmēm.";
            }

            return errors;
        },
        onSubmit: (data) => {
            onCustomerSave(data);
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

    function onCustomerSave(data: ICustomer) {
        props.saveCustomer({
            clientName: data.clientName,
            email: data.email,
            legalAdress: data.legalAdress,
            deliveryAdress: data.deliveryAdress,
            bankName: data.bankName,
            pvnCode: data.pvnCode,
            account: data.account
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
                                id="clientName"
                                value={formik.values.clientName}
                                onChange={formik.handleChange}
                            />
                            <label
                                htmlFor="clientName"
                                className={classNames({ "p-error": isFormFieldValid("clientName") })}
                            >
                                Nosaukums
                            </label>
                        </span>
                        {getFormErrorMessage("clientName")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}>
                                E-pasts
                            </label>
                        </span>
                        {getFormErrorMessage("email")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="legalAdress"
                                value={formik.values.legalAdress}
                                onChange={formik.handleChange}
                            />
                            <label
                                htmlFor="legalAdress"
                                className={classNames({ "p-error": isFormFieldValid("legalAdress") })}
                            >
                                Adrese
                            </label>
                        </span>
                        {getFormErrorMessage("legalAdress")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="deliveryAdress"
                                value={formik.values.deliveryAdress}
                                onChange={formik.handleChange}
                            />
                            <label
                                htmlFor="deliveryAdress"
                                className={classNames({ "p-error": isFormFieldValid("deliveryAdress") })}
                            >
                                Piegādes adrese
                            </label>
                        </span>
                        {getFormErrorMessage("deliveryAdress")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="bankName"
                                value={formik.values.bankName}
                                onChange={formik.handleChange}
                            />
                            <label
                                htmlFor="bankName"
                                className={classNames({ "p-error": isFormFieldValid("bankName") })}
                            >
                                Banka
                            </label>
                        </span>
                        {getFormErrorMessage("bankName")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="pvnCode"
                                value={formik.values.pvnCode}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="pvnCode" className={classNames({ "p-error": isFormFieldValid("pvnCode") })}>
                                PVN kods
                            </label>
                        </span>
                        {getFormErrorMessage("pvnCode")}
                    </div>
                    <div className="form-entry">
                        <span className="p-float-label">
                            <InputText
                                style={{ width: "18rem" }}
                                id="account"
                                value={formik.values.account}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="account" className={classNames({ "p-error": isFormFieldValid("account") })}>
                                Bankas Kods
                            </label>
                        </span>
                        {getFormErrorMessage("account")}
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

export default CustomerEdit;
