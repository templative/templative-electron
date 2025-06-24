import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import EyeIcon from "../../../Rules/Icons/Eye.svg?react"
export default function CreateYourRulebook({goToTutorial, goToExternalLink}) {
    return <>
        <p>Create rulebooks in Templative using <span className="external-link" onClick={() => goToExternalLink("https://www.markdownguide.org/getting-started/")}>Markdown</span>. For markdown syntax, use <code>#</code>'s to create headers, hyphens to create lists, and <code>[links](www.linktothing.com)</code> to create links. Use multiple hastags like <code>## This</code> to create subheaders. Organize your rulebook into concentric sections by using different kinds of headers.</p>
        
        <p><span className="tutorial-link" onClick={() => goToTutorial("Render a Project")}>Render your game</span> to create a <span className="external-link" onClick={() => goToExternalLink("https://www.adobe.com/acrobat/about-adobe-pdf.html")}>PDF</span> version of your rulebook. Note that every render includes a PDF.</p>
        
        <p>To see how your rulebook will look, press the <EyeIcon/> button to open the preview window on the right.</p>
        
        <h3>Adding Images</h3>
        
        <p>Add images to your rulebooks using <code>![Alt Text for the Image](file path for the image)</code>. Link images in your rulebook using either local urls or internet urls. Link urls relative to your project location like this: <code>![Name your image](./images/setupExample.png)</code>. Link images using internet urls like this: <code>![Name your Image](https://drive.google.com/file/d/1234567890/view?usp=sharing)</code>.</p>
        
        <h3>Example Structure</h3>
        
        <p>Consider this example structure:</p>
        
        <code>
            # Name of your Game<br/>
            <br/>
            Lore dump ...<br/>
            <br/>
            ## Objective<br/>
            <br/>
            Win the game by having the most points.<br/>
            <br/>
            ## Components<br/>
            <br/>
            - 12 cards<br/>
            - 2 dice<br/>
            <br/>
            ## How to Play<br/>
            <br/>
            Win the game by having the most points. Gain points by drawing point cards. Draw cards by ...<br/>
            <br/>
            ### Turns<br/>
            <br/>
            Take turns ...<br/>
            <br/>
            ### Winning the Game<br/>
            <br/>
            Win the game by...
        </code>
        
        
    </>
}