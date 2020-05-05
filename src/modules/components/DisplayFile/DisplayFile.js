import React from 'react'


export const DisplayFile = ({ file }) => {
    if (file) {
        const type = file.type
        let data = {
            isPdf: false,
            isXml: false,
        }
        switch (type) {
            case "application/pdf":
                data.isPdf = true
                break;
            case "application/xml":
            case "text/xml":
                data.isXml = true
                break;

            default:
                break
        }

        if (data.isPdf) {
            return <p>pdf</p>
        }
        if (data.isXml) {
            return <p>xml</p>
        }
    }
    return null

}

