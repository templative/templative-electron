import React from "react";
import PdfIcon from './TypeIcons/PdfIcon';
import TabletopPlaygroundIcon from './TypeIcons/TabletopPlaygroundIcon';
import TabletopSimulatorIcon from './TypeIcons/TabletopSimulatorIcon';
import TheGameCrafterIcon from './TypeIcons/theGameCrafterIcon';
import PrintIcon from './TypeIcons/print.svg?react';
import "./ComponentType.css";


/**
 * Component that renders all export icons for a component
 */

const ExportIcons = ({ componentInfo, isStock }) => {
    const exportRoutes = [
        {
            name: "The Game Crafter", 
            available: isStock || ((!!componentInfo.GameCrafterUploadTask) || (!!componentInfo.GameCrafterSkuId && !!componentInfo.GameCrafterGuid)),
            icon: TheGameCrafterIcon
        },{
            name: "Tabletop Simulator",
            available: !!componentInfo.SimulatorCreationTask && componentInfo.SimulatorCreationTask !== "none",
            icon: TabletopSimulatorIcon
        },
        // {
        //     name: "Tabletop Playground",
        //     available: !!componentInfo.PlaygroundCreationTask && componentInfo.PlaygroundCreationTask !== "none",
        //     icon: TabletopPlaygroundIcon,
        // },
        {
            name: "Print",
            available: !componentInfo.IsPrintingDisabled && !isStock && 
                      componentInfo.DimensionsInches && 
                      componentInfo.DimensionsInches[0] <= 17 && 
                      componentInfo.DimensionsInches[1] <= 11,
            icon: PrintIcon
        }
    ]
   
    return (
        <div className="export-icons">
            <span className="export-icons-label">Exports to </span>
            {exportRoutes.map(({ available, icon: Icon, name }) => {
                if (!available) {
                    return null;
                }
                return (
                    <span className="export-icon" key={name}>
                        <Icon />
                    </span>
                )
            })}
        </div>
    );
};

export default ExportIcons; 