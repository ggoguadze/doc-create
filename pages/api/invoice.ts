
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"
import { IInvoice } from "../createInvoice"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const invoice: IInvoice = JSON.parse(req.body)
        const {products, ...rest} = invoice
        const savedInvoice = await prisma.invoice.create({ data: { ...rest, invoiceProducts: { create: products.map((product)=>({productName: product.productName, quantity:product.quantity, price: product.price, unit: product.unit})) } } })
        res.json(savedInvoice)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedInvoice = await prisma.invoice.delete({ where: { id: id } })
        res.json(deletedInvoice)
    } else if (req.method === "PATCH"){
        const updatedInvoice = await prisma.invoice.updateMany({data: {status: req.body}})
        res.json(updatedInvoice)
    }
}