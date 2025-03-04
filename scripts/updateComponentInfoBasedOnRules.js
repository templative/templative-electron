import { COMPONENT_INFO } from "../src/shared/componentInfo.js";
import { STOCK_COMPONENT_INFO } from "../src/shared/stockComponentInfo.js";
import fs from 'fs';
import componentRules from "./rules/customComponentRules.js";
import stockComponentRules from "./rules/stockComponentRules.js";


// Function to apply rules and set values for a specific type of component
function applyRulesToComponents(componentInfo, rules, componentType) {
    console.log(`\n=== APPLYING ${componentType.toUpperCase()} RULES ===`);
    
    let totalUpdates = 0;
    
    // Process each rule
    rules.forEach(rule => {
        const updatedComponents = [];
        
        // Check all components for rule application
        for (const [componentName, componentData] of Object.entries(componentInfo)) {
            // Skip components that don't meet the condition
            if (!rule.condition(componentData)) {
                continue;
            }
            
            // Apply the setValue function to modify the component
            const updatedFields = rule.setValue(componentData);
            if (updatedFields && updatedFields.length > 0) {
                updatedComponents.push({ name: componentName, fields: updatedFields });
            }
        }
        
        // Report updates for this rule
        console.log(`\nRule: "${rule.description}"`);
        if (updatedComponents.length > 0) {
            console.log('Updated components:');
            updatedComponents.forEach(comp => {
                console.log(`- ${comp.name}: ${comp.fields.join(', ')}`);
            });
        }
        
        totalUpdates += updatedComponents.length;
    });
    
    console.log(`\nTotal ${componentType} updates: ${totalUpdates}`);
    
    return totalUpdates;
}

// Function to save the updated component info back to its source file
function saveComponentInfo(componentInfo, filePath, exportName) {
    try {
        // Format the component info object as a JavaScript export
        const fileContent = `const ${exportName} = ${JSON.stringify(componentInfo, null, 2)}
module.exports = { ${exportName} }`;
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, fileContent, 'utf8');
        
        console.log(`Successfully saved updated ${exportName} to: ${filePath}`);
    } catch (error) {
        console.error(`Error saving ${exportName}:`, error);
    }
}

// Function to deduplicate tags in component data
function deduplicateTags(componentInfo) {
    console.log("\n=== DEDUPLICATING TAGS ===");
    let updatedCount = 0;
    
    for (const [componentName, componentData] of Object.entries(componentInfo)) {
        if (componentData.Tags && Array.isArray(componentData.Tags)) {
            const originalLength = componentData.Tags.length;
            // Use Set to remove duplicates, then convert back to array
            componentData.Tags = [...new Set(componentData.Tags)];
            
            // Check if any duplicates were removed
            if (componentData.Tags.length < originalLength) {
                updatedCount++;
                console.log(`- ${componentName}: Removed ${originalLength - componentData.Tags.length} duplicate tag(s)`);
            }
        }
    }
    
    console.log(`\nTotal components with deduplicated tags: ${updatedCount}`);
    return updatedCount;
}

// Function to run the component rule application process
function processComponents() {
    // Process regular components
    const componentUpdates = applyRulesToComponents(COMPONENT_INFO, componentRules, "component");
    // Deduplicate tags in regular components
    const componentTagDedupes = deduplicateTags(COMPONENT_INFO);
    
    if (componentUpdates > 0 || componentTagDedupes > 0) {
        console.log('\nSaving updates to component info file...');
        saveComponentInfo(
            COMPONENT_INFO, 
            "/Users/oliverbarnum/Documents/git/templative-electron/src/shared/componentInfo.js",
            "COMPONENT_INFO"
        );
    }
    
    // Process stock components
    const stockComponentUpdates = applyRulesToComponents(STOCK_COMPONENT_INFO, stockComponentRules, "stock component");
    // Deduplicate tags in stock components
    const stockComponentTagDedupes = deduplicateTags(STOCK_COMPONENT_INFO);
    
    if (stockComponentUpdates > 0 || stockComponentTagDedupes > 0) {
        console.log('\nSaving updates to stock component info file...');
        saveComponentInfo(
            STOCK_COMPONENT_INFO,
            "/Users/oliverbarnum/Documents/git/templative-electron/src/shared/stockComponentInfo.js",
            "STOCK_COMPONENT_INFO"
        );
    }
    
    if (componentUpdates === 0 && stockComponentUpdates === 0 && 
        componentTagDedupes === 0 && stockComponentTagDedupes === 0) {
        console.log('\nNo updates to save.');
    }
}
  
// Run the analysis
processComponents();