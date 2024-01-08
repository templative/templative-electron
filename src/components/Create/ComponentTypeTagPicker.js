import React from "react";
import "./CreatePanel.css"
import {componentTypeHasAllFilteredTags} from "./TagFilter"

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
        Object.keys(this.props.componentTypeOptions).map((key) => {
            var componentOption = this.props.componentTypeOptions[key]
            if (componentOption["Tags"] === undefined) {
                return
            }
            if (!componentTypeHasAllFilteredTags(this.props.selectedTags, componentOption["Tags"])) {
                return
            }
            addComponentTypeTagsToComponentTagOptions(componentTagOptions, componentOption["Tags"])
        })
        var tagDivs = []
        for (const tag in componentTagOptions) {
            if (componentTagOptions[tag] <= 1) {
                continue
            }
            tagDivs.push(<button 
                key={tag} 
                onClick={()=> this.props.toggleTagFilterCallback(tag)} 
                className={`btn tag-button ${this.props.selectedTags.has(tag) && "selected-tag"}`}>
                    {tag}
            </button>)
        }

        return <div className="component-tag-options">
            {tagDivs}
        </div>
    }
}