import React from "react";
import PdfIcon from './TypeIcons/PdfIcon';
import TabletopPlaygroundIcon from './TypeIcons/TabletopPlaygroundIcon';
import TabletopSimulatorIcon from './TypeIcons/TabletopSimulatorIcon';
import TheGameCrafterIcon from './TypeIcons/theGameCrafterIcon';
import "./ComponentType.css";

/**
 * Get export route information for a component
 * @param {Object} componentInfo - Component information object
 * @returns {Object} Export route availability and reasons
 */
export const getExportRouteInfo = (componentInfo) => {
    return {
        gameCrafter: {
            available: (!!componentInfo.GameCrafterUploadTask) || (!!componentInfo.GameCrafterSkuId && !!componentInfo.GameCrafterGuid),
            reason: !componentInfo.GameCrafterUploadTask ? "No GameCrafter upload task defined" : null
        },
        simulator: {
            available: !!componentInfo.SimulatorCreationTask,
            reason: !componentInfo.SimulatorCreationTask ? "No Tabletop Simulator task defined" : null
        },
        playground: {
            available: !!componentInfo.PlaygroundCreationTask,
            reason: !componentInfo.PlaygroundCreationTask ? "No Tabletop Playground task defined" : null
        },
        printable: {
            available: componentInfo.DimensionsInches && 
                      componentInfo.DimensionsInches[0] <= 17 && 
                      componentInfo.DimensionsInches[1] <= 11,
            reason: !componentInfo.DimensionsInches ? "No dimensions defined" :
                    (componentInfo.DimensionsInches[0] > 17 || componentInfo.DimensionsInches[1] > 11) ? 
                    "Too large for tabloid paper" : null
        }
    };
};

/**
 * Individual export icon component
 */
export const ExportIcon = ({ available, title, children }) => {
    return (
        <span className={`export-icon ${available ? 'available' : 'unavailable'}`} title={title}>
            {children}
        </span>
    );
};

/**
 * Component that renders all export icons for a component
 */
const ExportIcons = ({ componentInfo }) => {
    const exportRoutes = getExportRouteInfo(componentInfo);
    
    return (
        <div className="export-icons">
            {/* <ExportIcon 
                available={exportRoutes.gameCrafter.available}
                title={exportRoutes.gameCrafter.available ? "Available on TheGameCrafter" : exportRoutes.gameCrafter.reason}
            >
                <TheGameCrafterIcon disabled={!exportRoutes.gameCrafter.available} />
            </ExportIcon>
            <ExportIcon 
                available={exportRoutes.simulator.available}
                title={exportRoutes.simulator.available ? "Available for Tabletop Simulator" : exportRoutes.simulator.reason}
            >
                <TabletopSimulatorIcon disabled={!exportRoutes.simulator.available} />
            </ExportIcon>
            <ExportIcon 
                available={exportRoutes.playground.available}
                title={exportRoutes.playground.available ? "Available for Tabletop Playground" : exportRoutes.playground.reason}
            >
                <TabletopPlaygroundIcon disabled={!exportRoutes.playground.available} />
            </ExportIcon>
            <ExportIcon 
                available={exportRoutes.printable.available}
                title={exportRoutes.printable.available ? "Printable" : exportRoutes.printable.reason}
            >
                <PdfIcon disabled={!exportRoutes.printable.available} />
            </ExportIcon> */}
        </div>
    );
};

export default ExportIcons; 