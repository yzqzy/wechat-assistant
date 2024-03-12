import fs from 'fs'
import { PDFDocument, StandardFonts } from 'pdf-lib'

async function generatePDFFromJSON(jsonData, columns) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Set the font for the document
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Create a new page
  const page = pdfDoc.addPage()

  // Set the initial y position
  let y = page.getHeight() - 50

  // Set the font size and draw the column headers
  const fontSize = 12
  const headerHeight = 20
  page.setFont(font)
  page.setFontSize(fontSize)

  for (const column of columns) {
    page.drawText(column.label, {
      x: column.x,
      y
    })
  }

  // Move to the next line
  y -= headerHeight

  // Set the font size for the data rows
  const rowFontSize = 10
  page.setFontSize(rowFontSize)

  // Draw the data rows
  for (const data of jsonData) {
    for (const column of columns) {
      const value = data[column.key]
      page.drawText(value, {
        x: column.x,
        y
      })
    }

    // Move to the next line
    y -= rowFontSize
  }

  // Save the PDF document as a buffer
  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}

// Example usage
const jsonData = [
  { name: 'John Doe', age: '30', city: 'New York' },
  { name: 'Jane Smith', age: '25', city: 'London' },
  { name: 'Bob Johnson', age: '35', city: 'Paris' }
]

const columns = [
  { label: 'Name', key: 'name', x: 50 },
  { label: 'Age', key: 'age', x: 200 },
  { label: 'City', key: 'city', x: 300 }
]

generatePDFFromJSON(jsonData, columns)
  .then(pdfBytes => {
    const downloadFileName = 'data_to_pdf.pdf'
    fs.writeFileSync(downloadFileName, pdfBytes)
    console.log(`PDF saved as ${downloadFileName}`)
  })
  .catch(error => {
    console.error('Error:', error)
  })
