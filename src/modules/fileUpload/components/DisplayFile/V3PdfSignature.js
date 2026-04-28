import "./V3PdfSignature.css"

export const RED = { back: "#3B1923", border: "#492D35", text: "#B5B5B5", circle: "#471221", logo: "#542633" };
export const BLACK = { back: "#0C0F1E", border: "#2A2C39", text: "#FFFFFF", circle: "#0C0F1E", logo: "#2A2C39" };
export const GREEN = { back: "#162B20", border: "#293E32", text: "#B5B5B5", circle: "#162D20", logo: "#293E32" };
export const WHITE = { back: "#FFFFFF", border: "#E0E5E7", text: "#002B3E", circle: "#FFFFFF", logo: "#E0E5E7" };

const pi2 = Math.PI * 2;
const DATE_LINE_FACTOR = 2.2

export function InsetRect(rect, amount) {
    return { x: rect.x + amount, y: rect.y + amount, h: rect.h - 2 * amount, w: rect.w - 2 * amount };
}

export const drawPdfSignature = (r, color, texts, context) => {

    // Calculate general dimension
    const dim = Math.sqrt(r.w * r.h);

    // Main rounded rect clip
    let radius = dim / 16;
    context.fillStyle = color.back;
    context.beginPath();
    context.arc(r.x + radius, r.y + radius, radius, pi2 * 0.5, pi2 * 0.75);
    context.arc(r.x + r.w - radius, r.y + radius, radius, pi2 * 0.75, pi2);
    context.arc(r.x + r.w - radius, r.y + r.h - radius, radius, 0, pi2 * 0.25);
    context.arc(r.x + radius, r.y + r.h - radius, radius, pi2 * 0.25, pi2 * 0.5);
    context.fillStyle = color.back;
    context.fill();
    context.save();
    context.clip();

    // Draw circle with shadow
    radius = Math.max(r.h, r.w) * 0.6;
    const circleX = r.x + r.w * 0.3 + radius;
    const circleY = r.y + r.h / 2;

    context.shadowColor = color.logo;
    context.shadowBlur = 200;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.beginPath();
    context.arc(circleX, circleY, radius, 0, pi2);
    context.fillStyle = color.circle;
    context.fill();
    context.restore();

    // Smaller rounded rect clip
    const boxRect = InsetRect(r, dim / 20);
    context.beginPath();
    context.roundRect(boxRect.x, boxRect.y, boxRect.w, boxRect.h, dim / 20);
    context.closePath();
    context.save();
    context.clip();

    // Clipped ".be" logo
    const logo = ".be";
    context.fillStyle = color.logo;
    context.font = dim / 2.5 + "px BosaSignFont";
    const metrics = context.measureText(logo);
    context.fillText(logo, boxRect.x + boxRect.w * 0.9 - metrics.width, boxRect.y + boxRect.h * 1.02);

    context.restore();

    // Border with rounded corners
    let borderSize = dim / 80;
    if (borderSize > 4) borderSize = 4;
    context.lineWidth = borderSize;
    context.strokeStyle = color.border;
    context.beginPath();
    context.roundRect(boxRect.x, boxRect.y, boxRect.w, boxRect.h, dim / 20);
    context.closePath();
    context.stroke();

    const margin = dim / 16;
    const textRect = InsetRect(boxRect, margin);

    // We split the text in 2 or 3 equal vertical areas
    // Find font where we can either draw the fullname on a signle line or the first and last name on 2 lines with the same font size
    let dateH;
    let textH;
    let allFits;
    let okToDraw = true;	// If default fontSize fits, draw.
    let fullnameFits = false;
    let maxPasses = 15;
    let minFontSize = 0;
    let maxFontSize = dim / 7;
    if (maxFontSize < 3 || isNaN(maxFontSize)) maxFontSize = 3;
    let fontSize = maxFontSize;
    let firstLine = texts[2];
    while (true) {
        context.font = fontSize + "px BosaSignFont";
        let metrics = context.measureText(firstLine);
        textH = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        const firstNamesW = context.measureText(texts[2]).width;
        const lastNameW = context.measureText(texts[3]).width;
        const fullNameW = firstNamesW + context.measureText(' ').width + lastNameW;

        context.font = (fontSize / DATE_LINE_FACTOR) + "px BosaSignFont";
        metrics = context.measureText(texts[0]);
        dateH = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        allFits = metrics.width < textRect.w && context.measureText(texts[1]).width <= textRect.w;
        if (allFits) {
            allFits = fullNameW <= textRect.w && textRect.h > textH * 2;
            if (allFits) {
                if (okToDraw) {
                    firstLine = texts[2] + ' ' + texts[3];
                    fullnameFits = true;
                    break;
                }
            } else {
                allFits = firstNamesW <= textRect.w && lastNameW <= textRect.w && textRect.h > textH * 3;
                if (allFits && okToDraw) break;
            }
        }
        if (allFits) minFontSize = fontSize;
        else maxFontSize = fontSize;

        fontSize = Math.floor(minFontSize + (maxFontSize - minFontSize) / 2);
        if (fontSize < 2) return;
        okToDraw = minFontSize === fontSize || --maxPasses === 0;
    }

    context.fillStyle = color.text;
    context.fillText(texts[0], textRect.x, textRect.y + dateH);
    context.fillText(texts[1], textRect.x, textRect.y + dateH * 2.2);

    context.font = fontSize + "px BosaSignFont";
    context.fillText(firstLine, textRect.x, textRect.y + textH * 2.1);
    if (!fullnameFits) context.fillText(texts[3], textRect.x, textRect.y + textH * 3.2);
}
