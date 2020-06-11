
export const generateIdFromArray = (idList) => {
    let newId = ""
    do {
        newId = Math.floor(Math.random() * Math.floor(99999)) //0-99998
    }
    while (idList.includes(newId))

    return newId
}


export const generateId = (oldId) => {

    return generateIdFromArray([oldId])
}
