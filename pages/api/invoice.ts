
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"
import { IFullInvoice } from "../createInvoice"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const invoice: IFullInvoice = JSON.parse(req.body)
        const {products, ...rest} = invoice
        const savedInvoice = await prisma.invoice.create({ data: { ...rest, invoiceProducts: { create: products.map((product)=>({productName: product.productName, quantity:product.quantity, price: product.price, unit: product.unit})) } } })
        res.json(savedInvoice)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        await prisma.invoiceProduct.deleteMany({where: {invoiceId: id}})
        const deletedInvoice = await prisma.invoice.delete({ where: { id: id } })
        res.json(deletedInvoice)
    } else if (req.method === "PATCH"){
        const body = JSON.parse(req.body)
        if(body.id){
        const updatedInvoice = await prisma.invoice.update({ where: { id: body.id }, data:{ status:body.status}})
        res.json(updatedInvoice)
        return
        }
        const updatedInvoice = await prisma.invoice.updateMany({data: {status: req.body}})
        res.json(updatedInvoice)
    }
}