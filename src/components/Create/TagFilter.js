export const componentTypeHasAllFilteredTags = (selectedTags, componentTypeTags) => {
    for(const tagToFilterBy of selectedTags) {
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
    return true
}

