import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RenderPreview from "./Images/renderPreview.png";
import RenderCompositions from "./Images/renderCompositions.png";
export default function RenderingYourGame({goToTutorial}) {
    return <>
        <p>Render your game to create the final artwork for all or part of your project.</p>
        <p>Render specific pieces using the preview button. Open the preview tab on the right of the Edit Tab.</p>
        <LocalLabeledImage
            src={RenderPreview}
            caption="The Preview in piece content"
        />
        <p>Or render all compositions or a specific composition using the Render Tab. If you want to render only one composition, toggle it in the dropdown above the Render All button.</p>
        <LocalLabeledImage
            src={RenderCompositions}
            caption="The Render Tab with the countries composition rendered"
        />
        <p>Watch the output of the rendering in the output window of the Render Tab. Rendered compositions each create a output folder in the <code>/output</code> folder of your project.</p>

        <p>To go to the folder containing your art, right click an output folder and select View Folder.</p>
        
        <p>Export to <span className="tutorial-link" onClick={() => goToTutorial("Export to Tabletop Simulator")}>Tabletop Simulator</span>, <span className="tutorial-link" onClick={() => goToTutorial("Create a Print and Play")}>printable pdf</span>, or <span className="tutorial-link" onClick={() => goToTutorial("Upload to TheGameCrafter")}>TheGameCrafter</span> store page using your output folders.</p>
        
        <HeadsUp message="For Git users, the /output and its contents are excluded in the .gitignore file."/>
        
        <h3>Rendering with Inkscape</h3>
        <p>To get access to Inkscape unique features such as text wrapping and patterns, install <span className="external-link" onClick={() => goToExternalLink("https://inkscape.org/")}>Inkscape</span> and then go to <code>Edit {">"} Edit Settings</code> and change <code>Which Rendering Program Should Templative Use?</code> to <code>Inkscape</code>.</p>
        
        <h3>Skip Re-Rendering with the Art Cache</h3>
        <p>Note that if you try to render a piece that has already been rendered, Templative will skip the rendering process and use the cached result instead of re-rendering. Change a content, the art recipe, or the art files to trigger re-rendering. If you change one piece of a composition but not others, only the changed content will be re-rendered. As an example, change 5hp to 10hp in the art to trigger re-rendering.</p>
        
        <p>Control the background rendering and cache settings by going to <code>Edit {">"} Edit Settings</code> and changing the settings in <code>Rendering</code>.</p>
        
        <HeadsUp message="Templative doesn't know about fonts on your system. So cached results of your art may use old font settings."/>
        
        <p>Delete the contents of your art cache folder <code>~/Documents/Templative/art-cache</code> so your art can be re-rendered with the new fonts. </p>
        
        </>
}