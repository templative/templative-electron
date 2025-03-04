import { COMPONENT_INFO } from "../src/shared/componentInfo.js";
import { STOCK_COMPONENT_INFO } from "../src/shared/stockComponentInfo.js";
import fs from 'fs';
import componentRules from "./rules/customComponentRules.js";
import stockComponentRules from "./rules/stockComponentRules.js";

// Function to analyze the component data
function findMissingTasks() {
    const missingPlayground = [];
    const missingSimulator = [];
    const missingBoth = [];
  
    // Loop through all components in COMPONENT_INFO
    for (const [componentName, componentData] of Object.entries(COMPONENT_INFO)) {
      const hasPlayground = componentData.PlaygroundCreationTask !== undefined;
      const hasSimulator = componentData.SimulatorCreationTask !== undefined;
  
      if (!hasPlayground && !hasSimulator) {
        missingBoth.push(componentName);
      } else if (!hasPlayground) {
        missingPlayground.push(componentName);
      } else if (!hasSimulator) {
        missingSimulator.push(componentName);
      }
    }
  
    // Output results
    console.log('=== COMPONENTS MISSING TASKS ===');
    
    console.log('\nMissing both Playground and Simulator tasks:');
    console.log(missingBoth.length > 0 ? missingBoth.join(', ') : 'None');
    
    console.log('\nMissing only Playground tasks:');
    console.log(missingPlayground.length > 0 ? missingPlayground.join(', ') : 'None');
    
    console.log('\nMissing only Simulator tasks:');
    console.log(missingSimulator.length > 0 ? missingSimulator.join(', ') : 'None');
    
    console.log('\nTotal components:', Object.keys(COMPONENT_INFO).length);
    console.log('Components missing at least one task:', missingBoth.length + missingPlayground.length + missingSimulator.length);
    
    // Apply rules to components and update their values
    applyComponentRules();
}

// Function to apply rules and set values for components
function applyComponentRules() {
    console.log('\n=== APPLYING COMPONENT RULES ===');
    
    let totalUpdates = 0;
    
    // Process each rule
    componentRules.forEach(rule => {
        const updatedComponents = [];
        
        // Check all components for rule application
        for (const [componentName, componentData] of Object.entries(COMPONENT_INFO)) {
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
    
    console.log(`\nTotal component updates: ${totalUpdates}`);
    
    if (totalUpdates > 0) {
        console.log('\nSaving updates to component info file...');
        saveComponentInfo();
    } else {
        console.log('\nNo updates to save.');
    }
}

// Function to save the updated COMPONENT_INFO back to its source file
function saveComponentInfo() {
    try {
        // Determine the path to the componentInfo.js file
        const componentInfoPath = "/Users/oliverbarnum/Documents/git/templative-electron/src/shared/componentInfo.js"
        
        // Format the COMPONENT_INFO object as a JavaScript export
        const fileContent = `const COMPONENT_INFO = ${JSON.stringify(COMPONENT_INFO, null, 2)}
module.exports = { COMPONENT_INFO }`;
        
        // Write the updated content back to the file
        fs.writeFileSync(componentInfoPath, fileContent, 'utf8');
        
        console.log(`Successfully saved updated component info to: ${componentInfoPath}`);
    } catch (error) {
        console.error('Error saving component info:', error);
    }
}
  
// Run the analysis
findMissingTasks();