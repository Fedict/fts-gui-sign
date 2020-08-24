/**
 * function to generate a unique id
 * @param {[number]} idList - list of already existing ids
 * 
 * @returns {number} newId - a new id that is not included in the idList
 */
export const generateIdFromArray = (idList) => {
    let newId = ""
    do {
        newId = Math.floor(Math.random() * Math.floor(99999)) //0-99998
    }
    while (idList.includes(newId))

    return newId
}

/**
 * function to generate a unique id
 * @param {number} oldId - a id where the new random id is not equeal to
 * 
 * @returns {number} newId - a new id that is equel to the old id
 */
export const generateId = (oldId) => {
    return generateIdFromArray([oldId])
}
