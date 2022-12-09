import React from "react";

interface IDocument {
    invoiceNumber: string;
    date: string;
    driver: string;
    transportName: string;
    transportNumber: string;
    items: {
        name: string;
        quantity: string;
        price: string;
        total: string;
    }[];
}

function createDocument() {
    const [doc, setDocument] = React.useState();

    function signDocument() {
        console.log("Sign document");
    }

    function createPdf() {}

    return (
        <>
            {doc ? (
                <iframe src={doc} width="600px" height="1200px" />
            ) : (
                <>
                    <div id="testInvoice">
                        <h1>Test invoice</h1>
                    </div>
                    <button onClick={createPdf}>CreatePDF</button>
                </>
            )}
        </>
    );
}

export default createDocument;
