import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { selectSignature, setSignatureArea, setSignatureFields } from '../../reducers/DisplayPDFReducer'

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

const getPagesInfo = async (pdf) => {
    let newPagesInfo = [];
    let pageIndex = 0;
    while(pageIndex < pdf.numPages) {
        let page = await pdf.getPage(++pageIndex);
        let pageInfo =  {
            width: page.view[2],
            height: page.view[3],
            sigAcroform: []
        };
        let annotations = await page.getAnnotations();
        annotations.forEach((annotation) => {
            if (annotation.subtype === "Widget" && annotation.fieldType === "Sig") {
                const r = annotation.rect;
                pageInfo.sigAcroform.push({
                    fieldName: annotation.fieldName,
                    // Coordinate system of pdf "zero" is bottom left hence the "page.view[3] - r[1]"
                    rect: normalizeRect({ left: r[0], top: page.view[3] - r[1], right: r[2], bottom: page.view[3] - r[3] })
                })
            }
        })
        newPagesInfo.push(pageInfo)
    }
    return newPagesInfo;
}

/**
 * Component to display a PDF, select a rectangle where a visible signature (acroform) will be added 
 * @param {object} props.drawSignature - the user is allowed to draw a signature in the PDF  
 * @param {object} props.file - file that is shown
 * @param {string} props.file.name - name of the file
 * @param {object} props.file.url - dataURL for the file
 */
export const DisplayPDF = ({ file, drawSignature }) => {
    const dispatch = useDispatch();
    const [currentPDF, setCurrentPDF] = useState(null);
    const [renderPdf, setRenderPdf] = useState(false);
    const [pagesInfo, setPagesInfo] = useState([]);
    const pdfCanvasRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const thumbCanvasRefs = useRef([]);
    const [thumbnailsRendered, setThumbnailsRendered] = useState(false);
    
    const [showThumbnails, setShowThumbnails] = useState(false);
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
    // Draw current PDF page and thumbnails 
    //****************************************************************************************

    useEffect(() => {
        setPageNumber(1);
        setZoomLevel(100);
        setShowThumbnails(false);
        getDocument(file.url).promise.then(pdf => {
            setCurrentPDF(pdf);
            setThumbnailsRendered(false);
            getPagesInfo(pdf).then((pagesInfo) => {
                setPagesInfo(pagesInfo);
                let signatureFields = [];
                pagesInfo.forEach((page) => {
                    page.sigAcroform.forEach((sigAcroform) => { signatureFields.push(sigAcroform.fieldName)});
                } )
                dispatch(setSignatureFields(signatureFields));
            });
        });
    }, [file.url]);

    useEffect(() => {
        if (thumbnailsRendered || !currentPDF) return;

        for(let thumbIndex = 0; thumbIndex < currentPDF.numPages; thumbIndex++) {
            currentPDF.getPage(thumbIndex + 1).then(function (thumbPage) {
                thumbPage.render({
                    canvasContext: thumbCanvasRefs.current[thumbIndex].getContext('2d'),
                    viewport: thumbPage.getViewport({ scale: 0.1 }),
                    textContent: currentPDF,
                });
            })
        }
        setThumbnailsRendered(true);
    }, [showThumbnails])

    const changePageNumber = (page) => {
        setPageNumber(page);
        if (thumbCanvasRefs.current) {
            let element = thumbCanvasRefs.current[page - 1];
            if (element) element.scrollIntoView();
        }
    }

    useEffect(() => {
        if (pagesInfo.length === 0 || !currentPDF) return;

        let pi = pagesInfo[pageNumber - 1];
        const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)
        setCanvasWidth(pi.width * scale);
        setCanvasHeight(pi.height * scale);
        setRenderPdf(true);
    }, [pagesInfo, pageNumber, zoomLevel, canvasHeight]);

    useLayoutEffect(() => {
        if (!renderPdf) return;

        currentPDF.getPage(pageNumber).then(function (page) {
            console.log("page", page);
            const context = pdfCanvasRef.current.getContext('2d');
            const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)
            const renderContext = {
                canvasContext: context,
                viewport: page.getViewport({ scale: scale }),
                textContent: currentPDF,
            };
            page.render(renderContext);
            setRenderPdf(false);
        }).catch((e) => { console.log("?" + e) });
    }, [renderPdf]);

    //****************************************************************************************
    // Handle mouse events to allow drawing the signature rectangle.
    // A signature can't be drawn over another so we're forbidding intersection with existing signing acroforms 
    //****************************************************************************************

    const selectionCanvasRef = useRef(null);
    const signatureArea = useSelector((state) => state.pdfSignatures.signatureArea);
    const signatureSelected = useSelector((state) => state.pdfSignatures.signatureSelected);
    let dragX;
    let dragY;
    let dragRect;
    
    useEffect(() => {
        drawSignatureBoxes();
    }, [renderPdf, signatureSelected, signatureArea]);

    const drawSignatureRect = (ctx, rect, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
        ctx.drawImage(document.getElementById("signatureImage"), rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
    }

    const drawSignatureBoxes = (rect = null) => {
        const canvas = selectionCanvasRef.current;
        if (!canvas || canvas.height === 0) return;

        const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;

        if (rect) {
            // Draw current selection ...
            drawSignatureRect(ctx, rect, '#00EE00')
            }
        else {
            // ... or Draw signature area
            if (signatureArea && signatureArea.page === pageNumber) {
                drawSignatureRect(ctx, scaleRect(signatureArea.rect, scale), signatureSelected === undefined ? '#00EE00' : '#EEEEEE');
            }
        }

        // Draw Existing signature fields
        if (pagesInfo.length != 0) {
            pagesInfo[pageNumber - 1].sigAcroform.forEach((sigAcroform) => {
                drawSignatureRect(ctx, scaleRect(sigAcroform.rect, scale), signatureSelected === sigAcroform.fieldName ? '#00EE00' : '#EEEEEE');
            });
        }
    };

    const recordNewRectIfValid = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var rect = normalizeRect({ top: dragY, right: e.offsetX, left: dragX, bottom: e.offsetY });

        let pi = pagesInfo[pageNumber - 1];
        for(let i = 0; i < pi.sigAcroform.length; i++) {
            if (intersectRect(scaleRect(pi.sigAcroform[i].rect, zoomLevel / ZOOM_CORRECTION), rect)) {
                return pi.sigAcroform[i].fieldName;
            }
        };

        drawSignatureBoxes(rect);
        dragRect = rect;
        return null;
    }
    
    const onMouseDown = (e) => {
        dragX = e.offsetX;
        dragY = e.offsetY;
        let fieldName = recordNewRectIfValid(e);
        if (fieldName) dispatch(selectSignature(fieldName));

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
        if (!dragRect) return;

        if (!isOutOfCanvas) recordNewRectIfValid(e);
        if ((dragRect.right - dragRect.left) !== 0 && (dragRect.bottom - dragRect.top) !== 0) {
            dispatch(setSignatureArea({
                page: pageNumber,
                rect : scaleRect(dragRect, ZOOM_CORRECTION / zoomLevel)
            }));
            dispatch(selectSignature(undefined))
        }
        dragRect = null;
    };

    useEffect(() => {
        if (!drawSignature) return;

        const canvas = selectionCanvasRef.current;
        if (canvas !== null) {
            dragRect = null;
            canvas.addEventListener("mousedown", onMouseDown);
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseup", onMouseUp);
            document.documentElement.addEventListener('mouseup', onDocumentMouseUp); 
            return () => {
                canvas.removeEventListener('mousedown', onMouseDown);
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('mouseup', onMouseUp);
                document.documentElement.removeEventListener('mouseup', onDocumentMouseUp); 
            }
        }
    }, [selectionCanvasRef, pagesInfo, pageNumber, zoomLevel]);


    //****************************************************************************************
    // HTML rendering
    //****************************************************************************************

    return (
        <div className="container flex-column border" style={ { width:"100%", backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
            <img class="d-none" id="signatureImage" src="/img/signature.png"/>
            <div className="row">
                <div className="col">
                    <button onClick={() => { setShowThumbnails(!showThumbnails) }}>I</button>
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
                 hidden={ showThumbnails ? null : "hidden" }>{pagesInfo.map((input, pageIndex) => (
                        <canvas key={ "tumbnail-"+pageIndex } 
                            ref={(element) => thumbCanvasRefs.current[pageIndex] = element } 
                            width={pagesInfo[pageIndex].width / 10} height ={pagesInfo[pageIndex].height / 10}
                            onClick={ () => { setPageNumber(pageIndex + 1) }}
                            style={ pageNumber === (pageIndex + 1) ?  { border: "double" } : {} } />                    
                 ))}</div>
                <div className="col" style={{ overflow: "auto", height: "80vh" }}>
                    <canvas id="pdf-canvas" ref={pdfCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "0" } } />
                    <canvas id="pdf-canvasSelection" ref={selectionCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "1" } } />
                </div>
            </div>
        </div>
         )
}
