import {FormattedMessage} from "react-intl";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { normalizeFontName } from "pdfjs-dist/build/pdf.worker";

GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
const ZOOM_CORRECTION = 60

function scaleRect(r, s) {
    return { top: r.top * s, left: r.left * s, bottom: r.bottom * s,  right: r.right * s };
}

function intersectRect(r1, r2) {
    return !(r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top);
}

const normalizeRect = (r) => {
    let rOut = {...r};
    if (r.left > r.right) {
        rOut.left = r.right;
        rOut.right = r.left;
    }
    if (r.top > r.bottom) {
        rOut.top = r.bottom;
        rOut.bottom = r.top;
    }
    return rOut;
}

const getSignatures = async (page, scale)  => {
    let annotations = await page.getAnnotations()
    const signatures = [];
    annotations.forEach((annotation) => {
        if (annotation.subtype === "Widget" && annotation.fieldType === "Sig") {
            const r = annotation.rect;
            signatures.push({
                fieldName:annotation.fieldName,
                    // Coordinate system of pdf is bottom left hence the "page.view[3] - r[1]"
                    rect: normalizeRect(scaleRect({ left: r[0], top: page.view[3] - r[1], right: r[2], bottom: page.view[3] - r[3] }, scale ) )
            })
        }
    })
    return signatures;
}


/**
 * Component to display a PDF, select a rectangle where a visible signature (acroform) will be added 
 * @param {object} props  
 * @param {object} props.uploadFile - upload file object from the redux store 
 * @param {object} props.uploadFile.displayFile - file that is shown 
 * @param {string} props.uploadFile.displayFile.name - name of the file
 * @param {object} props.uploadFile.displayFile.url - dataURL for the file
 */
export const DisplayPDF = ({ file }) => {
    const [currentPDF, setCurrentPDF] = useState(null);
    const pdfCanvasRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const thumbCanvasRefs = useRef([]);
    const [thumbSizes, setThumbSizes] = useState(null);
    const [renderThumbnails, setRenderThumbnails] = useState(false);

    const [showIndex, setShowIndex] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const [zoomLevel, setZoomLevel] = useState(100);
    const zoomLevels = [10, 25, 50, 75, 100, 110, 130, 150, 200, 300, 400];
    const nextZoom = () => {
        let nextZoomLevel = zoomLevels.find((zoom) => zoom > zoomLevel );
        return nextZoomLevel ? nextZoomLevel : zoomLevels.slice(-1);
    };
    const predZoom = () => {
        let predZoomLevel = zoomLevels.toReversed().find((zoom) => zoom < zoomLevel );
        return predZoomLevel ? predZoomLevel : zoomLevels[0];
    };

    //****************************************************************************************
    // Handle mouse events to allow drawing the signature rectangle.
    // A signature can't be drawn over another so we're forbidding intersection with existing signing acroforms 
    //****************************************************************************************
    const selectionCanvasRef = useRef(null);
    const [pageSignatures, setPageSignatures] = useState(null);
    const [signatureArea, setSignatureRect] = useState(null);
    let dragX;
    let dragY;
    let dragRect;
    
    const recordNewRectIfValid = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var rect = normalizeRect({ top: dragY, right: e.offsetX, left: dragX, bottom: e.offsetY });

        if (pageSignatures) {
            for(let i = 0; i < pageSignatures.length; i++) {
                const sigRect = pageSignatures[i].rect;
                if (intersectRect(sigRect, rect)) return;
            };
        }

        const canvas = selectionCanvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        context.strokeStyle = '#ff000080';
        context.strokeRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
        dragRect = rect;
    }
    
    const onMouseDown = (e) => {
        dragX = e.offsetX;
        dragY = e.offsetY;
        recordNewRectIfValid(e);
        console.log("DOWN");
        console.log(dragRect);
    };

    const onMouseMove = (e) => {
        if (dragRect) recordNewRectIfValid(e);
    };

    const onDocumentMouseUp = (e) => {
        onMouseUp(e, true);
    }

    const onMouseUp = (e, isOutOfCanvas) => {
        console.log("UP " + isOutOfCanvas);
        if (dragRect) {
            if (!isOutOfCanvas) recordNewRectIfValid(e);
            if ((dragRect.right - dragRect.left) !== 0 && (dragRect.bottom - dragRect.top) !== 0) {
                setSignatureRect({
                    page: pageNumber,
                    rect : scaleRect(dragRect, ZOOM_CORRECTION / zoomLevel)
                });
            }
            const canvas = selectionCanvasRef.current;
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        };
        dragRect = null;
    };

    useEffect(() => {
        const canvas = selectionCanvasRef.current;
        if (canvas !== null) {
            dragRect = null;
            canvas.addEventListener("mousedown", onMouseDown);
            canvas.addEventListener("mouseup", onMouseUp);
            document.documentElement.addEventListener('mouseup', onDocumentMouseUp); 
            canvas.addEventListener("mousemove", onMouseMove);
            return () => {
                canvas.removeEventListener('mousedown', onMouseDown);
                canvas.removeEventListener('mouseup', onMouseUp);
                document.documentElement.removeEventListener('mouseup', onDocumentMouseUp); 
                canvas.removeEventListener('mousemove', onMouseMove);
            }
        }
    }, [selectionCanvasRef, pageSignatures]);


    //****************************************************************************************
    // Draw current PDF page and thumbnails 
    //****************************************************************************************

    useEffect(() => {
        setShowIndex(false);
        setPageNumber(1);
        setZoomLevel(100);
        getDocument(file.url).promise.then(pdf => {
            setCurrentPDF(pdf);
            let getPagePromises = [];
            let thumbIndex = pdf.numPages;
            while(thumbIndex >= 1) getPagePromises.push(pdf.getPage(thumbIndex--));

            Promise.all(getPagePromises).then(function (thumbPages) {
                let newThumbSizes = [];
                thumbPages.forEach((page) => {{ newThumbSizes.push({ width: page.view[2] / 10, height: page.view[3] / 10 }) }});
                console.log("newThumbSizes");
                console.log(newThumbSizes);
                setThumbSizes(newThumbSizes);
                setRenderThumbnails(true);
                });
            });
    }, [file.url]);
    
    useEffect(() => {
        if (!renderThumbnails || !currentPDF) return;

        for(let thumbIndex = 0; thumbIndex < thumbSizes.length; thumbIndex++) {
            currentPDF.getPage(thumbIndex + 1).then(function (thumbPage) {
                thumbPage.render({
                    canvasContext: thumbCanvasRefs.current[thumbIndex].getContext('2d'),
                    viewport: thumbPage.getViewport({ scale: 0.1 }),
                    textContent: currentPDF,
                });
            })
        }
        setRenderThumbnails(false);
    }, [renderThumbnails])
    

    const changePageNumber = (page) => {
        setPageNumber(page);
        if (thumbCanvasRefs.current) {
            let element = thumbCanvasRefs.current[page - 1];
            if (element) element.scrollIntoView();
        }
    }

    useLayoutEffect(() => {
        renderPage();
    }, [currentPDF, pageNumber, zoomLevel, signatureArea]);

    const renderPage = () => {
        if (!currentPDF || !pdfCanvasRef.current) return;

        console.log("getPage ", pageNumber)
        currentPDF.getPage(pageNumber).then(function (page) {
            console.log("page", page);
            const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)
            setCanvasWidth(page.view[2] * scale);
            setCanvasHeight(page.view[3] * scale);
            const context = pdfCanvasRef.current.getContext('2d');
            const renderContext = {
                canvasContext: context,
                viewport: page.getViewport({ scale: scale }),
                textContent: currentPDF,
            };

            page.render(renderContext).promise.then(() => {
                // Draw new signature area
                const context = pdfCanvasRef.current.getContext('2d');
                if (signatureArea && signatureArea.page === pageNumber) {
                    context.strokeStyle = '#0000ff80';
                    context.lineWidth = 2;
                    const r = scaleRect(signatureArea.rect, scale);
                    context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
                }

                // Draw Existing signature fields
                getSignatures(page, scale).then((signaturesOnPage) => {
                    setPageSignatures(signaturesOnPage)
                    signaturesOnPage.forEach((signature) => {
                    context.strokeStyle = '#ff000080';
                    context.lineWidth = 2;
                    const r = signature.rect;
                    context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
                    })
                })
            }).catch((e) => { console.log("?" + e)});
        }).catch((e) => { console.log("?" + e) });
    }

    //****************************************************************************************
    // HTML rendering
    //****************************************************************************************

    return (
        <div className="container flex-column border" style={ { width:"100%", backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
            <div className="row">
                <div className="col">
                    <button onClick={() => { setShowIndex(!showIndex) }}>I</button>
                </div>
                <div className="col">
                    <span className="px-2">Page : </span>
                    <button className="px-2" onClick={() => { changePageNumber(pageNumber - 1) }} disabled={ pageNumber <= 1}>Pred</button>
                    <span  className="px-2">{ pageNumber }</span>
                    <button  className="px-2" onClick={() => { changePageNumber(pageNumber + 1) }} disabled={ currentPDF && pageNumber >= currentPDF.numPages}>Next</button>
                </div>
                <div className="col">
                    <span className="px-2">Zoom : </span>
                    <button  className="px-2" onClick={() => { setZoomLevel(predZoom()) }} disabled={ predZoom() === zoomLevel}>Pred</button>
                    <span  className="px-2">{ zoomLevel }</span>
                    <button  className="px-2" onClick={() => { setZoomLevel(nextZoom()) }} disabled={ nextZoom() === zoomLevel}>Next</button>
                </div>
            </div>
            <div className="row">
                <div style={{ overflow: "auto", width: "110px", textAlign: "center", height: "80vh"}}
                 hidden={ showIndex ? null : "hidden" }>{thumbSizes && thumbSizes.map((input, thumbIndex) => (
                        <canvas key={ "tumbnail-"+thumbIndex } 
                            ref={(element) => thumbCanvasRefs.current[thumbIndex] = element } 
                            width={thumbSizes[thumbIndex].width} height ={thumbSizes[thumbIndex].height}
                            onClick={ () => { setPageNumber(thumbIndex + 1) }}
                            style={ pageNumber === (thumbIndex + 1) ?  { border: "double" } : {} } />                    
                 ))}</div>
                <div className="col" style={{ overflow: "auto", height: "80vh" }}>
                    <canvas id="pdf-canvas" ref={pdfCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "0" } } />
                    <canvas id="pdf-canvasSelection" ref={selectionCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "1" } } />
                </div>
            </div>
        </div>
         )
}
