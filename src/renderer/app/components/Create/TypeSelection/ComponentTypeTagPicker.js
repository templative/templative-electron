import React from "react";
import "./ComponentTypeTags.css"
import {componentTypeHasAllFilteredTags} from "../TagFilter"

export const addComponentTypeTagsToComponentTagOptions = (componentTagOptions, componentTypeTags) => {
    for (var i = 0 ; i < componentTypeTags.length ; i++) {
        if (componentTagOptions[componentTypeTags[i]] === undefined) {
            componentTagOptions[componentTypeTags[i]] = 1
        }
        else{
            componentTagOptions[componentTypeTags[i]] += 1
        }
    }
}

export default class ComponentTypeTagPicker extends React.Component {   
    render() {
        var componentTagOptions = {}
        Object.keys(this.props.componentTypeOptions)
            .filter((key) => {
                var componentOption = this.props.componentTypeOptions[key]
                const componentTypeHasNoTags = componentOption["Tags"] === undefined
                if (componentTypeHasNoTags) {
                    return false
                }
                const componentTypeWouldBeFilteredByCurrentTags = !componentTypeHasAllFilteredTags(this.props.selectedTags, componentOption["Tags"])
                if (componentTypeWouldBeFilteredByCurrentTags) {
                    return false
                }
                return true
            })
            .forEach((key) => {

                var componentOption = this.props.componentTypeOptions[key]
                addComponentTypeTagsToComponentTagOptions(componentTagOptions, componentOption["Tags"])
            })
        var sortedTagElements = Object.keys(componentTagOptions)
            .filter((tag) => {
                const tagWouldHasMoreThanOneItemInIt = componentTagOptions[tag] >= 1
                const tagIsBlank = tag.trim() === ""
                return tagWouldHasMoreThanOneItemInIt && !tagIsBlank
            })
            .sort((tagA, tagB) => {
                // if (componentTagOptions[tagA] < componentTagOptions[tagB]) {
                //     return 1;
                // }
                // if (componentTagOptions[tagA] > componentTagOptions[tagB]) {
                //     return -1;
                // }
                if (tagA < tagB) {
                    return -1;
                }
                if (tagA > tagB) {
                    return 1;
                }
                return 0;
            })
            .filter(tag => {
                for (let index = 0; index < this.props.majorCategories.length; index++) {
                    const majorCategory = this.props.majorCategories[index];
                    if (tag === majorCategory) {
                        return false
                    }
                }
                return true
            })
            .map((tag) => {
                return <button 
                    key={tag} 
                    onClick={()=> this.props.toggleTagFilterCallback(tag.trim())} 
                    className={`btn tag-button ${this.props.selectedTags.has(tag.trim()) && "selected-tag"}`}>
                        {tag.trim()}
                </button>
            })

        return <div className="component-tag-options">
            {sortedTagElements}
        </div>
    }
}