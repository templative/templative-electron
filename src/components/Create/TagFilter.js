
var addSpaces = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')
        .replace("D 4", "D4")
        .replace("D 6", "D6")
        .replace("D 8", "D8")
        .replace("D 12", "D12")
        .replace("D 20", "D20")
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

