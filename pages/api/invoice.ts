import { NextApiHandler } from 'next'
const { chromium } = require('playwright')

const Handler: NextApiHandler = async (req, res) => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:3000/invoice')
  await page.emulateMediaType('screen')

  const pdfBuffer = await page.pdf({ format: 'A4' })

  res.send(pdfBuffer)

  await browser.close()
}