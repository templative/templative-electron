import React from 'react';
import Explanation from '../../TutorialComponents/Explanation';
import { TemplativeLabeledImage, LocalLabeledImage } from "../../TutorialComponents/LabeledImage";

export default function XmlEditorExplanation({goToTutorial, goToExternalLink}) {
    return <Explanation title="How do I edit the id's of my art?">
        <p>Assign each of your svg elements an id that Templative can recognize using Inkscape, Illustrator, or any text editor. In Inkscape, go to Edit {">"} XML Editor.</p>

        <TemplativeLabeledImage
            src="/findingXmlEditor.png"
            alt="Dropdown to access xml editor"
            caption="Accessing Inkscape's XML editor"
        />

        <p>Select an object in your svg file and watch as the corresponding xml element is selected in the xml editor. Select the id attribute of the element, rename it, and press enter.</p>

        <TemplativeLabeledImage
            src="/renamingId.png"
            alt="xml id attribute"
            caption="Editing element IDs in the XML editor"
        />

        <p>Now refer to that id in style updates.</p>
    </Explanation>
    
}