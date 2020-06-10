export const getRequestId = (idList) => {
    let newId = ""
    do {
        newId = Math.floor(Math.random() * Math.floor(99999)) //0-99998
    }
    while (idList.includes(newId))

    return newId
}