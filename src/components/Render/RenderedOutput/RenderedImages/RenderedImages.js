import React from "react";
import ComponentOutputDirectory from "./ComponentOutputDirectory";
import fs from "fs/promises";
import ComponentOutputContainer from "./ComponentOutputContainer";

export default class RenderedImages extends React.Component { 
    state = {
        groupedDirectories: {}
    }

    componentDidMount = async () => {
        await this.groupDirectoriesByName()
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps.componentDirectories !== this.props.componentDirectories) {
            await this.groupDirectoriesByName()
        }
    }

    groupDirectoriesByName = async () => {
        const grouped = {}
        for (const dir of this.props.componentDirectories) {
            try {
                const componentJson = JSON.parse(await fs.readFile(`${dir}/component.json`))
                const name = componentJson.name
                const type = componentJson.type
                
                if (!grouped[name]) {
                    grouped[name] = {
                        directories: [],
                        type: type
                    }
                }
                grouped[name].directories.push(dir)
            } catch (err) {
                console.error(`Error reading component.json from ${dir}:`, err)
            }
        }
        this.setState({ groupedDirectories: grouped })
    }

    addSpaces = (str) => {
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
    render = () => {
        
        return <React.Fragment>
            <div className="component-count-list">
                {Object.keys(this.props.typeQuantities)
                    .sort((a, b) => a.localeCompare(b))
                    .map(type => {
                        return <p key={type} className="component-count-list-item">{this.props.typeQuantities[type]}x {this.addSpaces(type)} Pieces</p>
                    })
                }
            </div>
            
            {Object.entries(this.state.groupedDirectories).map(([name, data]) => 
                <ComponentOutputContainer 
                    key={name} 
                    componentName={name}
                    componentType={data.type}
                    componentDirectories={data.directories}
                />
            )}
        
        </React.Fragment>
    }
}