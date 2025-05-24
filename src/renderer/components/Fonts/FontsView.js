import React, { useContext } from "react";
import RegularFonts from "./RegularFonts";
import IconFonts from "./IconFonts/IconFonts";
import { RenderingWorkspaceContext } from "../Render/RenderingWorkspaceProvider";

import "./FontsView.css"

export default function FontsView({templativeRootDirectoryPath}) {
    const { selectedFontTab, setSelectedFontTab } = useContext(RenderingWorkspaceContext);
    
    const tabs = [
        {
            name: "Fonts",
            component: <RegularFonts templativeRootDirectoryPath={templativeRootDirectoryPath} />
        },
        {
            name: "Icon Fonts",
            component: <IconFonts templativeRootDirectoryPath={templativeRootDirectoryPath} />
        }
    ]
    return <div className="fonts-body">
        <div className="fonts-workspace">
            <div className="fonts-sidebar">
                {tabs.map((tab) => {
                    var isActive = selectedFontTab === tab.name;
                    return <div key={tab.name} className={`fonts-sidebar-item ${isActive ? "active" : ""}`} onClick={() => setSelectedFontTab(tab.name)}>{tab.name}</div>
                })}
            </div>
            <div className="fonts-content">
                {tabs.find((tab) => tab.name === selectedFontTab)?.component}
            </div>
        </div>
    </div>
}