function invoiceDetail() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <div className="invoice-wrapper">
                        <div className="invoice-top">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="invoice-top-left">
                                        <h2 className="client-company-name">Google Inc.</h2>
                                        <h6 className="client-address">
                                            31 Lake Floyd Circle, <br />
                                            Delaware, AC 987869 <br />
                                            India
                                        </h6>
                                        <h4>Reference</h4>
                                        <h5>
                                            UX Design &amp; Development for <br /> Android App.
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="invoice-top-right">
                                        <h2 className="our-company-name">Acme LLP</h2>
                                        <h6 className="our-address">
                                            477 Blackwell Street, <br />
                                            Dry Creek, Alaska <br />
                                            India
                                        </h6>

                                        <h5>06 September 2017</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-bottom">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h2 className="title">Invoice</h2>
                                </div>
                                <div className="clearfix"></div>

                                <div className="col-sm-3 col-md-3">
                                    <div className="invoice-bottom-left">
                                        <h5>Invoice No.</h5>
                                        <h4>BJI 009872</h4>
                                    </div>
                                </div>
                                <div className="col-md-offset-1 col-md-8 col-sm-9">
                                    <div className="invoice-bottom-right">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Qty</th>
                                                    <th>Description</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Initial research</td>
                                                    <td>₹10,000</td>
                                                </tr>
                                                <tr>
                                                    <td>1</td>
                                                    <td>UX design</td>
                                                    <td>₹35,000</td>
                                                </tr>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Web app development</td>
                                                    <td>₹50,000</td>
                                                </tr>
                                                <tr style={{ height: "40px" }}></tr>
                                            </tbody>
                                            <thead>
                                                <tr>
                                                    <th>Total</th>
                                                    <th></th>
                                                    <th>₹95,000</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <h4 className="terms">Terms</h4>
                                        <ul>
                                            <li>Invoice to be paid in advance.</li>
                                            <li>Make payment in 2,3 business days.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-xs-12">
                                    <hr className="divider" />
                                </div>
                                <div className="col-sm-4">
                                    <h6 className="text-left">acme.com</h6>
                                </div>
                                <div className="col-sm-4">
                                    <h6 className="text-center">contact@acme.com</h6>
                                </div>
                                <div className="col-sm-4">
                                    <h6 className="text-right">+91 8097678988</h6>
                                </div>
                            </div>
                            <div className="bottom-bar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default invoiceDetail