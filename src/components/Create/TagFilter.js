const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
}
export const matchesSearch = (search, possibleMatch) => {
    if (search === "") {
        return true
    }
    var upperPossibleMatch = addSpaces(possibleMatch).toUpperCase().replace(/[^A-Z0-9]/g, "")
    var upperSearch = addSpaces(search).toUpperCase().replace(/[^A-Z0-9]/g, "")
    return upperPossibleMatch.includes(upperSearch)
}
export const componentTypeHasAllFilteredTags = (mustHaveTags, componentTypeTags, mustNotHave) => {
    for(const tagToFilterBy of mustHaveTags) {
        var hasTag = false
        for (var i = 0 ; i < componentTypeTags.length ; i++) {
            if (tagToFilterBy !== componentTypeTags[i]) {
                continue
            }
            hasTag = true
            break
        }
        if (!hasTag) {
            return false;
        }
    }
    if (mustNotHave !== undefined) {
        for(var m = 0; m <= mustNotHave.length; m++) {
            var tagToFilterBy = mustNotHave[m]
            for (var i = 0 ; i < componentTypeTags.length ; i++) {
                if (tagToFilterBy === componentTypeTags[i]) {
                    return false
                }
            }
        }
    }
    return true
}

