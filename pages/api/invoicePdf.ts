
import { chromium } from 'playwright'
import { NextApiRequest, NextApiResponse } from "next"


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.emulateMedia({media:'screen'})
    const id = JSON.parse(req.body)
    await page.goto(`http://localhost:3000/invoice/${id}`)
    
    await page.getByText('Pavadzīme').isVisible()
      const pdfBuffer = await page.pdf({ format: 'A4' })
      
      await browser.close()
  
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Length', pdfBuffer.length)
  console.log(pdfBuffer)
  res.send(pdfBuffer)

}