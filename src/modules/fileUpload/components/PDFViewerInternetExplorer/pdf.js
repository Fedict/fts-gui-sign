import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf'
import * as pdfjsworker from 'pdfjs-dist/es5/build/pdf.worker.entry'
import { getBinaryFromDataURI } from '../../helpers/FileHelper';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsworker

export default class PDFJs {

    scale = 1
    page = 1
    documentLength = 0
    document = undefined
    element = undefined
    pageElement = undefined
    canvas = undefined
    isRendering = false

    init = async (source, canvasElement, pageElement) => {
        

        this.element = canvasElement
        this.pageElement = pageElement

        const data = getBinaryFromDataURI(source)

        let me = this
        pdfjsLib.getDocument({ data: data }).promise.then(pdf => {

            const totalPagesCount = pdf.numPages;
            me.documentLength = totalPagesCount
            me.document = pdf

            pdf.getPage(me.page).then(async (page) => {

                me.isRendering = true
                const dimensionsContainer = canvasElement.getBoundingClientRect()
                const desiredWidth = dimensionsContainer.width - 20;
                const helperViewport = page.getViewport({ scale: 1, });
                const scale = desiredWidth / helperViewport.width;
                const viewport = page.getViewport({ scale: scale });

                let canvas = document.createElement("canvas")
                canvas.classList.add("mx-auto")
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                await page.render(renderContext).promise;
                me.canvas = canvas
                canvasElement.appendChild(canvas)
                me.renderPageCounter()
                me.scale = scale
                window.onresize = () => {
                    me.resizeCanvas()
                }
                me.isRendering = false
                
            })
        }).catch((err) => {
            console.log(err)
            
        });
    }

    resizeCanvas = () => {
        if (!this.isRendering) {
            const dimensionsContainer = this.element.getBoundingClientRect()

            let me = this
            this.document.getPage(this.page).then(async (page) => {
                me.isRendering = true
                const desiredWidth = dimensionsContainer.width - 50;
                const helperViewport = page.getViewport({ scale: 1, });
                var scale = desiredWidth / helperViewport.width;

                var viewport = page.getViewport({ scale: scale });
                const context = me.canvas.getContext('2d');
                me.canvas.height = viewport.height;
                me.canvas.width = viewport.width;
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                await page.render(renderContext).promise;
                me.scale = scale
                this.renderPageCounter()
                me.isRendering = false

            }).catch((err) => { console.log(err) });
        }

    }
    renderNextPage = () => {
        const newPage = this.page + 1
        if (newPage <= this.documentLength && this.document) {
            this.renderPage(newPage)
        }
        else if (newPage > this.documentLength && this.document) {
            this.renderPage(this.documentLength)
        }
    }
    renderPrevPage = () => {
        const newPage = this.page - 1
        if (newPage >= 1 && this.document) {
            this.renderPage(newPage)
        }
        else if (newPage < 1 && this.document) {
            this.renderPage(1)
        }
    }

    renderNewPage = (newPage) => {
        if (newPage < 1 && this.document) {
            this.renderPage(1)
        }
        else if (newPage > this.documentLength && this.document) {
            this.renderPage(this.documentLength)
        }
        else if (newPage >= 1 && newPage <= this.documentLength && this.document) {
            this.renderPage(newPage)
        }
    }

    renderPage = (newPage) => {
        let me = this
        if (!this.isRendering) {
            if (this.document && this.element && this.canvas) {
                this.document.getPage(newPage).then(async (page) => {
                    me.isRendering = true

                    var viewport = page.getViewport({ scale: me.scale });
                    const context = me.canvas.getContext('2d');
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    await page.render(renderContext).promise;
                    me.page = newPage
                    this.renderPageCounter()
                    me.isRendering = false

                }).catch((err) => { console.log(err) });
            }
        }
    }

    renderPageCounter = () => {
        let me = this
        const input = document.createElement("input")
        input.classList.add("form-control")

        input.type = 'number'
        input.value = this.page
        input.onblur = (e) => {
            const pageNumber = parseInt(e.target.value)
            if (!isNaN(pageNumber)) {
                me.renderNewPage(pageNumber)
            }
            else {
                me.renderPage(1)
            }
        }
        const pageTotal = document.createElement("span")
        pageTotal.classList.add("input-group-addon")
        pageTotal.classList.add("align-self-center")
        pageTotal.classList.add("ml-1")
        pageTotal.innerText = " / " + this.documentLength

        this.pageElement.innerHTML = ""
        this.pageElement.appendChild(input)
        this.pageElement.appendChild(pageTotal)
    }

    remove() {
        window.onresize = () => { }
        this.scale = 1
        this.page = 1
        this.documentLength = 0
        this.document = undefined
        this.element = undefined
        this.pageElement = undefined
        this.canvas = undefined
    }


}