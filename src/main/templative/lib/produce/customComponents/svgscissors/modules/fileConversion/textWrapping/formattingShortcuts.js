// Users can write <i>...</i> or <b>...</b> or <strong>...</strong> or <em>...</em> instead of writing <tspan style="font-style:italic">...</tspan> or <tspan style="font-weight:bold">...</tspan>
async function processFormattingShortcuts(document) {    
    const formattingShortcuts = {
        'i': 'italic',
        'b': 'bold',
        'strong': 'bold',
        'em': 'italic',        
    }
    for (const [shortcut, formatting] of Object.entries(formattingShortcuts)) {
        let elements = document.querySelectorAll(shortcut);
        for (const element of elements) {
          const replacementTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            if (formatting === 'italic') {
                replacementTspan.style.fontStyle = 'italic';
            } else if (formatting === 'bold') {
                replacementTspan.style.fontWeight = 'bold';
            }
            // Transfer content
            while (element.firstChild) {
                replacementTspan.appendChild(element.firstChild);
            }
            element.parentNode.replaceChild(replacementTspan, element);
        }
    }
}

module.exports = {
    processFormattingShortcuts
}