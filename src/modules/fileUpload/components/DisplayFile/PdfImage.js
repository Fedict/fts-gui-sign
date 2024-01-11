export const POS_TOP        = "POS_TOP";
export const POS_LEFT       = "POS_LEFT";
export const POS_RIGHT      = "POS_RIGHT";
export const POS_BOTTOM     = "POS_BOTTOM";

export const VALIGN_TOP     = "VALIGN_TOP";
export const VALIGN_MIDDLE  = "VALIGN_MIDDLE";
export const VALIGN_BOTTOM  = "VALIGN_BOTTOM";

export const HALIGN_LEFT    = "HALIGN_LEFT";
export const HALIGN_CENTER  = "HALIGN_CENTER";
export const HALIGN_RIGHT   = "HALIGN_RIGHT";

export const drawPdfImage = (xPdfField, yPdfField, pdfFieldW, pdfFieldH, bgColor, padding, text, textColor, textPos, textAlignH, textAlignV, font, image, imgWidth, imgHeight, context) => {
    
    // Get FontMetrics by using a temporary BufferedImage and Graphics2D
    if (font) context.font = font;

    // Split the text in lines, compute the numer of pixels for each line (linesLen)
    text = text.replace("\\n", "\n");
    let lines = text.split("\n");
    let lineCount = lines.length;
    let linesLen = [];
    let maxLineLen = 0;
    let textHeigth = 0;
    let textDescent = 0;
    lines.forEach((line) => {
        const metrics = context.measureText(line);
        if (textHeigth === 0) {
            textDescent = metrics.fontBoundingBoxDescent;
            textHeigth = metrics.fontBoundingBoxAscent + textDescent;
        }
        if (metrics.width > maxLineLen) maxLineLen = metrics.width;
        linesLen.push(metrics.width);
    })

    // Compute the horizontal positions of each line of the image
    let xImg = 0;
    let xTextStart = 0;
    if (image) {
        if (POS_BOTTOM === textPos || POS_TOP === textPos) {
            if (maxLineLen < imgWidth) xTextStart += (imgWidth - maxLineLen) / 2;
            else if (imgWidth < maxLineLen) xImg += (maxLineLen - imgWidth) / 2;
        }
        else if (POS_RIGHT === textPos) xTextStart += padding + imgWidth;
        else if (POS_LEFT === textPos) xImg += padding + maxLineLen;
    }
    let linesX = [];
    linesLen.forEach((lineLen) => {
        if (HALIGN_LEFT === textAlignH) linesX.push(xTextStart);                                 // LEFT
        else if (HALIGN_RIGHT === textAlignH) linesX.push(xTextStart + maxLineLen - lineLen);    // RIGHT
        else linesX.push(xTextStart + (maxLineLen - lineLen) / 2);                              // CENTER
    })

    // Compute the vertical positions of each line and of the image
    let yImg = 0;
    let yTextStart = 0;
    const fullTextHeight = lineCount * textHeigth;
    if (image) {
        if (POS_LEFT === textPos || POS_RIGHT === textPos) {
            if (fullTextHeight < imgHeight) {
                if (VALIGN_BOTTOM === textAlignV) yTextStart += imgHeight - fullTextHeight;        // BOTTOM
                else if (VALIGN_MIDDLE === textAlignV) yTextStart += (imgHeight - fullTextHeight) / 2;  // MIDDLE
                // else do nothing                                                                  // TOP
            }
            else if (imgHeight < fullTextHeight) xImg += (fullTextHeight - imgHeight) / 2;
        }
        else if (POS_BOTTOM === textPos) yTextStart = padding + imgHeight;
        else if (POS_TOP === textPos) yImg += padding + fullTextHeight;
    }
    yTextStart += textHeigth - textDescent;

    // Compute the full width and length
    let fullWidth = 2 * padding; // padding left and right
    let fullHeight = 2 * padding; // padding top and bottom
    if (image) {
        if (POS_LEFT === textPos || POS_RIGHT === textPos) fullWidth += maxLineLen + padding + imgWidth; // image and text next to each other
        else fullWidth += Math.max(imgWidth, maxLineLen);
        if (POS_TOP === textPos || POS_BOTTOM === textPos) fullHeight += fullTextHeight + padding + imgHeight; // image and text below each other
        else fullHeight += Math.max(imgHeight, fullTextHeight);
    } else {
        fullWidth += maxLineLen;
        fullHeight += fullTextHeight;
    }
    
    let xOff = xPdfField + (pdfFieldW - fullWidth) / 2;
    let yOff = yPdfField + (pdfFieldH - fullHeight) / 2;

/*
    // Add extra width or extra height so that we get the same ratio as the width/height ratio of the PDF visible signature field
    let xOff = xPdfField + padding;
    let xLen = fullWidth;
    let yOff = yPdfField + padding;
    let yLen = fullHeight;
    if (fullWidth * pdfFieldH < fullHeight * pdfFieldW) {
        xLen = (fullHeight * pdfFieldW + pdfFieldH - 1) / pdfFieldH; // ceil((fullHeight * PdfFieldW) / PdfFieldH)
        xOff += (xLen - fullWidth) / 2;
    }
    else if (fullWidth * pdfFieldH > fullHeight * pdfFieldW) {
        yLen = (fullWidth * pdfFieldH + pdfFieldW - 1) / pdfFieldW;  // ceil((fullWidth * PdfFieldH) / PdfFieldW)
        yOff += (yLen - fullHeight) / 2;
    }
*/

    // Create the resulting PDF image
    // 1. Paint background
    context.fillStyle = bgColor;
    context.fillRect(xPdfField, yPdfField, pdfFieldW, pdfFieldH);
    // 2. Add text lines
    context.fillStyle = textColor;
    context.strokeRect(xOff, yOff, fullWidth, fullHeight);

    lines.forEach((line, i) => {
        context.fillText(line, xOff + padding + linesX[i], yOff + padding + yTextStart + i * textHeigth);
    });
    // 3. Add image
    if (image) context.drawImage(image, xOff + padding + xImg, yOff + padding + yImg, imgWidth, imgHeight);
}
