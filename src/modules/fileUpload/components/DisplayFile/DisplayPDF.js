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
 * Component to display a PDF
 * @param {object} props  
 * @param {object} props.uploadFile - upload file object from the redux store 
 * @param {object} props.uploadFile.displayFile - file that is shown 
 * @param {string} props.uploadFile.displayFile.name - name of the file
 * @param {object} props.uploadFile.displayFile.url - dataURL for the file
 */
export const DisplayPDF = ({ file }) => {
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

    const [currentPDF, setCurrentPDF] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const pdfCanvasRef = useRef(null);
    const selectionCanvasRef = useRef(null);
    const thumbCanvasRefs = useRef([]);
    const [thumbWidth, setThumbWidth] = useState([]);
    const [thumbHeight, setThumbHeight] = useState([]);

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


    useEffect(() => {
        setPageNumber(1);
        setZoomLevel(100);
    }, [])

    useEffect(() => {
        getDocument(file.url).promise.then(pdf => {
            setCurrentPDF(pdf);
        });
    }, [file.url]);
    
    useEffect(() => {
        if (!currentPDF || !showIndex) return;

        for(let thumbIndex = 0; thumbIndex < currentPDF.numPages; thumbIndex++) {
            currentPDF.getPage(thumbIndex + 1).then(function (thumbPage) {
                const context = thumbCanvasRefs.current[thumbIndex].getContext('2d');
                thumbWidth[thumbIndex] = thumbPage.view[2] / 10;
                thumbHeight[thumbIndex] = thumbPage.view[3] / 10;
                const renderContext = {
                    canvasContext: context,
                    viewport: thumbPage.getViewport({ scale: 0.1 }),
                    textContent: currentPDF,
                };
                thumbPage.render(renderContext);
            })
        }
    }, [currentPDF, showIndex])

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

    let thumbNails = [];
    if (currentPDF && showIndex) {
        for(let thumbIndex = 0; thumbIndex < currentPDF.numPages; thumbIndex++) {
            thumbNails.push(<canvas key={ thumbIndex } ref={(element) => thumbCanvasRefs.current[thumbIndex] = element} width={thumbWidth[thumbIndex]} height ={thumbHeight[thumbIndex]} />);
        }
    }

    return (
        <div className="container border">
            <div className="row bg-light">
                <div className="col-md-auto">
                    <button onClick={() => { setShowIndex(!showIndex) }}>I</button>
                </div>
                <div className="col-md-auto">
                    <span className="px-2">Page : </span>
                    <button className="px-2" onClick={() => { setPageNumber(pageNumber - 1) }} disabled={ pageNumber <= 1}>Pred</button>
                    <span  className="px-2">{ pageNumber }</span>
                    <button  className="px-2" onClick={() => { setPageNumber(pageNumber + 1) }} disabled={ currentPDF && pageNumber >= currentPDF.numPages}>Next</button>
                </div>
                <div className="col-md-auto">
                    <span className="px-2">Zoom : </span>
                    <button  className="px-2" onClick={() => { setZoomLevel(predZoom()) }} disabled={ predZoom() === zoomLevel}>Pred</button>
                    <span  className="px-2">{ zoomLevel }</span>
                    <button  className="px-2" onClick={() => { setZoomLevel(nextZoom()) }} disabled={ nextZoom() === zoomLevel}>Next</button>
                </div>
            </div>
            <div className="row">
            {showIndex && <div className="col-1 border">
                    {thumbNails}
                </div>}
                <div className="col bg-light" style={{ width: "100%", height: "1000px", overflow: "scroll", position: "relative" }} >
                    <canvas id="pdf-canvas" ref={pdfCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "0" } } />
                    <canvas id="pdf-canvasSelection" ref={selectionCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "1" } } />
                </div>
            </div>
        </div>
         )
}
