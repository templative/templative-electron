import React, { useMemo } from "react";
import PdfIcon from './TypeIcons/PdfIcon';
import TabletopPlaygroundIcon from './TypeIcons/TabletopPlaygroundIcon';
import TabletopSimulatorIcon from './TypeIcons/TabletopSimulatorIcon';
import TheGameCrafterIcon from './TypeIcons/theGameCrafterIcon';
import StockComponentType from './StockComponentType';

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

export const ExportIcon = ({ available, title, children }) => {
    return (
        <span className={`export-icon ${available ? 'available' : 'unavailable'}`} title={title}>
            {children}
        </span>
    );
};

export const addSpaces = (str) => {
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
};

const ComponentType = ({ componentInfo, selectedComponentType, name, selectTypeCallback, existingQuantity }) => {
    const exportRoutes = useMemo(() => getExportRouteInfo(componentInfo), [componentInfo]);
    
    const displayName = useMemo(() => {
        if (!componentInfo["DisplayName"]) return name;
        return addSpaces(componentInfo["DisplayName"]);
    }, [componentInfo, name]);

    // Generate image URL for non-stock components
    const imageUrl = useMemo(() => {
        if (!name) return null;
        return `https://www.thegamecrafter.com/product-images/${name}.jpg`;
    }, [name]);

    return (
        <button type="button" 
            className={`btn btn-outline-primary component-type-card ${selectedComponentType === name && "selected-component-type"}`} 
            onClick={() => selectTypeCallback(name)}
        >
            <div className="component-type-content">
                <div className="component-type-info">
                    <p className="component-type-name">{existingQuantity !== 0 && `${existingQuantity}x `}{displayName}</p>
                    {componentInfo["DimensionsPixels"] && (
                        <p className="component-type-dimensions">
                            {`${componentInfo["DimensionsPixels"][0]}x${componentInfo["DimensionsPixels"][1]}px`}
                        </p>
                    )}
                    {imageUrl && (
                        <div className="component-type-preview">
                            <img 
                                src={imageUrl} 
                                alt={displayName}
                                className="preview-image"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    )}
                </div>
                <div className="export-icons">
                    <ExportIcon 
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
                    </ExportIcon>
                </div>
            </div>
        </button>
    )
}

export default ComponentType;