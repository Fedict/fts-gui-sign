import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { MANUAL_SIGNATURE, selectSignature, setSignatureArea, setSignatureFields } from '../../reducers/CustomSignatureReducer'

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

/**
 * Get dimensions of all pages of a PDF. Also get all signature acroform dimensions
 * @param pdf - The PDF
 */
const getPagesInfo = async (pdf) => {
    let newPagesInfo = [];
    let pageIndex = 0;
    while(pageIndex < pdf.numPages) {
        let page = await pdf.getPage(++pageIndex);
        let pageInfo =  {
            width: page.view[2],
            height: page.view[3],
            sigAcroforms: []
        };
        let annotations = await page.getAnnotations();
        annotations.forEach((annotation) => {
            if (annotation.subtype === "Widget" && annotation.fieldType === "Sig") {
                const r = annotation.rect;
                // Timestamp (and invisible signatures) get an annotation with an "empty" rectangle
                if (r[0] != 0 || r[1] != 0 || r[2] != 0 || r[3] != 0) {
                    pageInfo.sigAcroforms.push({
                        fieldName: annotation.fieldName,
                        // Coordinate system of pdf "zero" is bottom left hence the "page.view[3] - r[1]"
                        rect: normalizeRect({ left: r[0], top: page.view[3] - r[1], right: r[2], bottom: page.view[3] - r[3] }),
                        isSigned: annotation.BoSa_hasValue
                    })
                }
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
                    page.sigAcroforms.forEach((sigAcroform) => { if (!sigAcroform.isSigned) signatureFields.push(sigAcroform.fieldName)});
                } )
                dispatch(setSignatureArea(null));
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
        if (pagesInfo.length === 0) return;

        let pi = pagesInfo[pageNumber - 1];
        const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)
        setCanvasWidth(pi.width * scale);
        setCanvasHeight(pi.height * scale);
        setRenderPdf(true);
    }, [pagesInfo, pageNumber, zoomLevel]);

    useLayoutEffect(() => {
        if (!renderPdf) return;

        currentPDF.getPage(pageNumber).then(function (page) {
            const context = pdfCanvasRef.current.getContext('2d');
            const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)
            const renderContext = {
                canvasContext: context,
                viewport: page.getViewport({ scale: scale }),
                textContent: currentPDF,
            };
            
            page.render(renderContext).promise.then(() => {
                setRenderPdf(false);
            });
        }).catch((e) => {
            console.log("?" + e)
            setRenderPdf(false);
        });
    }, [renderPdf]);

    //****************************************************************************************
    // Handle mouse events to allow drawing the signature rectangle.
    // A signature can't be drawn over another so we're forbidding intersection with existing signing acroforms 
    //****************************************************************************************

    const selectionCanvasRef = useRef(null);
    const signatureArea = useSelector((state) => state.customSignatures.signatureArea);
    const signatureSelected = useSelector((state) => state.customSignatures.signatureSelected);
    const photoIncluded = useSelector((state) => state.customSignatures.photoIncluded);
    const locked = useSelector((state) => state.customSignatures.locked);
    const [imgSignatureLoaded, setImgSignatureLoaded] = useState(false);
    const [imgSignPhotoLoaded, setImgSignPhotoLoaded] = useState(false);
    
    let dragX;
    let dragY;
    let dragRect;
    
    useEffect(() => {
        if (signatureSelected === MANUAL_SIGNATURE) {
            if (pageNumber != signatureArea.page) setPageNumber(signatureArea.page);
        } else {
            pagesInfo.forEach((pi, index) => {
                pi.sigAcroforms.forEach((sigAcroForm) => {
                    if (signatureSelected === sigAcroForm.fieldName) {
                        if (pageNumber != (index + 1)) setPageNumber(index + 1);
                        return;
                    }
                })
            })
        }
    }, [signatureSelected])

    useLayoutEffect(() => {
        if (drawSignature && imgSignatureLoaded && imgSignPhotoLoaded) drawSignatureBoxes();
    }, [renderPdf, signatureSelected, signatureArea, canvasHeight, canvasWidth, photoIncluded, imgSignatureLoaded, imgSignPhotoLoaded]);

    const drawSignatureBoxes = (rect = null) => {
        const canvas = selectionCanvasRef.current;
        if (!canvas || canvas.height === 0) return;

        const scale = zoomLevel / ZOOM_CORRECTION; // Scale (to percentage compensated for DPI pseudo mapping)

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (rect) {
            // Draw current drag rectangle ...
            drawSignatureRect(ctx, rect, '#00EE00')
            }
        else {
            // ... or Draw existing manual (drag) signature
            if (signatureArea && signatureArea.page === pageNumber) {
                drawSignatureRect(ctx, scaleRect(signatureArea.rect, scale), signatureSelected === MANUAL_SIGNATURE ? '#00EE00' : '#EEEEEE');
            }
        }

        // Draw Existing signature (acroform) fields
        if (pagesInfo.length != 0) {
            pagesInfo[pageNumber - 1].sigAcroforms.forEach((sigAcroform) => {
                if (!sigAcroform.isSigned) {
                    drawSignatureRect(ctx, scaleRect(sigAcroform.rect, scale), signatureSelected === sigAcroform.fieldName ? '#00EE00' : '#EEEEEE');
                }
            });
        }
    };

    const drawSignatureRect = (ctx, r, color) => {
        const w = r.right - r.left;
        const h = r.bottom - r.top;
        ctx.fillStyle = color;
        ctx.fillRect(r.left, r.top, w, h);
        const image = document.getElementById(photoIncluded ? "signPhotoImage" : "signatureImage");
        if (image) {
            // Scale image with fixed x/y ratio
            let imgW = image.width;
            let imgH = image.height;
            let scale = w / imgW;
            const scaleY = h / imgH;
            if (scaleY < scale) scale = scaleY;
            imgH *= scale;
            imgW *= scale;
            ctx.drawImage(image, r.left + (w - imgW) / 2, r.top + (h - imgH) / 2, imgW, imgH);
        }
    }
    
    const recordNewRectIfValid = (e, checkSignatureArea = false) => {
        e.preventDefault();
        e.stopPropagation();
        var rect = normalizeRect({ top: dragY, right: e.offsetX, left: dragX, bottom: e.offsetY });

        let sigAcroforms = pagesInfo[pageNumber - 1].sigAcroforms;
        // Use indexed for loop to be able to return method
        for(let i = 0; i < sigAcroforms.length; i++) {
            const sigAcroform = sigAcroforms[i];
            if (intersectRect(scaleRect(sigAcroform.rect, zoomLevel / ZOOM_CORRECTION), rect)) {
                return sigAcroform.isSigned ? null : { target: sigAcroform.fieldName };
            }
        };
        if (checkSignatureArea && signatureArea && pageNumber === signatureArea.page  &&
            intersectRect(scaleRect(signatureArea.rect, zoomLevel / ZOOM_CORRECTION), rect)) {
            return { target: MANUAL_SIGNATURE };
        }

        drawSignatureBoxes(rect);
        dragRect = rect;
        return null;
    }
    
    const onMouseDown = (e) => {
        dragX = e.offsetX;
        dragY = e.offsetY;
        const signatureHit = recordNewRectIfValid(e, true);
        if (signatureHit) dispatch(selectSignature(signatureHit.target));
    };

    const onMouseMove = (e) => {
        if (dragRect) recordNewRectIfValid(e);
    };

    const onDocumentMouseUp = (e) => {
        onMouseUp(e, true);
    }
 
    const onMouseUp = (e, isOutOfCanvas) => {
        if (!dragRect) return;

        if (!isOutOfCanvas) recordNewRectIfValid(e);
        if ((dragRect.right - dragRect.left) !== 0 && (dragRect.bottom - dragRect.top) !== 0) {
            let rect = scaleRect(dragRect, ZOOM_CORRECTION / zoomLevel);
            // mouse coordinates can be outside of the canvas => Fix this
            if (rect.top < 0) rect.top = 0;
            if (rect.left < 0) rect.left = 0;
            const pi = pagesInfo[pageNumber - 1];
            if (rect.right > pi.width) rect.right = pi.width;
            if (rect.bottom > pi.height) rect.bottom = pi.height;
            dispatch(setSignatureArea({
                page: pageNumber,
                rect : rect
            }));
            dispatch(selectSignature(MANUAL_SIGNATURE))
        } else {
            drawSignatureBoxes();
        }
        dragRect = null;
    };

    useEffect(() => {
        if (!drawSignature || locked) return;

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
    }, [pagesInfo, pageNumber, zoomLevel, signatureSelected, signatureArea, locked, photoIncluded ]);


    //****************************************************************************************
    // HTML rendering
    //****************************************************************************************

    return (
        <div className="container flex-column border" style={ { width:"100%", backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
            <img className="d-none" id="signatureImage" src="/img/signature.png" onLoad={() => setImgSignatureLoaded(true)} />
            <img className="d-none" id="signPhotoImage" src="/img/photoSignature.png" onLoad={() => setImgSignPhotoLoaded(true)} />
            <div className="row">
                { pagesInfo.length > 1 && <>
                    <div className="col">
                        <button onClick={() => { setShowThumbnails(!showThumbnails) }}>Thumbnails</button>
                    </div>
                    <div className="col">
                        <span className="px-2">Page : </span>
                        <button className="px-2" onClick={() => { changePageNumber(pageNumber - 1) }} disabled={ pageNumber <= 1}>Pred</button>
                        <span  className="px-2">{ pageNumber }</span>
                        <button  className="px-2" onClick={() => { changePageNumber(pageNumber + 1) }} disabled={ currentPDF && pageNumber >= currentPDF.numPages}>Next</button>
                    </div>
                </>}

                <div className="col">
                    <span className="px-2">Zoom : </span>
                    <button  className="px-2" onClick={() => { setZoomLevel(predZoom()) }} disabled={ predZoom() === zoomLevel}>Out</button>
                    <span  className="px-2">{ zoomLevel }</span>
                    <button  className="px-2" onClick={() => { setZoomLevel(nextZoom()) }} disabled={ nextZoom() === zoomLevel}>In</button>
                </div>
            </div>
            <div className="row">
                { pagesInfo.length > 1 && 
                    <div style={{ overflow: "auto", width: "110px", textAlign: "center", height: "80vh"}}
                        hidden={ showThumbnails ? null : "hidden" }>{pagesInfo.map((input, pageIndex) => (
                        <canvas key={ "tumbnail-"+pageIndex } 
                            ref={(element) => thumbCanvasRefs.current[pageIndex] = element } 
                            width={pagesInfo[pageIndex].width / 10} height ={pagesInfo[pageIndex].height / 10}
                            onClick={ () => { setPageNumber(pageIndex + 1) }}
                            style={ pageNumber === (pageIndex + 1) ?  { border: "double" } : {} } />                    
                    ))}</div>
                }
                <div className="col" style={{ overflow: "auto", height: "80vh" }}>
                    <canvas id="pdf-canvas" ref={pdfCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "0" } } />
                    <canvas id="pdf-canvasSelection" ref={selectionCanvasRef} width={canvasWidth} height ={canvasHeight} style= { { position: "absolute", left: "0", top: "0", zIndex: "1" } } />
                </div>
            </div>
        </div>
         )
}

