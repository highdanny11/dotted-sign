import * as PDFLib from 'pdfjs-dist';
PDFLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs';
export const PDFUtils = async (file: string) => {
  try {
    const atobData = atob(file)
    const pdf = await PDFLib.getDocument({ data: atobData }).promise
    const numPages = pdf.numPages
    const canvasList: HTMLCanvasElement[] = []
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const canvas = document.createElement('canvas')
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1 })
      canvas.width = viewport.width
      canvas.height = viewport.height
      const context = canvas.getContext('2d')
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise
        canvasList.push(canvas)
      }
    }
    return canvasList
  } catch (error) {
    console.error('Error processing PDF:', error)
    return []
  }
}