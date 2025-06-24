import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import Diagram from "./Images/templativeDiagram.svg"
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
export default function CreatingYourGame({goToTutorial}) {
    return <>
        <p>Welcome to Templative! Manage the end-to-end production of your tabletop games using Templative projects. <span className='tutorial-link' onClick={()=>goToTutorial("Render a Project")}>Render your art</span>, <span className='tutorial-link' onClick={()=>goToTutorial("Create a Print and Play")}>distribute print and plays</span>, <span className='tutorial-link' onClick={()=>goToTutorial("Upload to TheGameCrafter")}>order professional prototypes</span>, and <span className='tutorial-link' onClick={()=>goToTutorial("Export to Tabletop Simulator")}>playtest your game</span> from the comfort of one application.</p>
        
        <p><span className='tutorial-link' onClick={()=>goToTutorial("Add Compositions")}>Add</span> and <span className='tutorial-link' onClick={()=>goToTutorial("Edit Compositions")}>edit</span> your compositions like custom and stock decks, boxes, dice, dials that follow <span className='tutorial-link' onClick={()=>goToTutorial("Art Recipes")}>recipes</span> for combining your <span className='tutorial-link' onClick={()=>goToTutorial("Manage Content")}>content</span> with your <span className='tutorial-link' onClick={()=>goToTutorial("Art")}>art</span> to make <span className='tutorial-link' onClick={()=>goToTutorial("Render a Project")}>final renders</span>, saving you hundreds of hours of work.</p>
        
        <LocalLabeledImage src={Diagram} caption="Manage reusable recipes, content, and art files instead of manually creating art and simulator saves, pdfs, and TheGameCrafter bleeds."/>
        
        <p>Get started by <span className='tutorial-link' onClick={()=>goToTutorial("Add Compositions")}>adding your first composition</span>.</p>
        
        <h3>Rendering with Inkscape</h3>
        <p>To get access to Inkscape unique features such as text wrapping and patterns, install <span className="external-link" onClick={() => goToExternalLink("https://inkscape.org/")}>Inkscape</span> and then go to <code>Edit {">"} Edit Settings</code> and change <code>Which Rendering Program Should Templative Use?</code> to <code>Inkscape</code>. See the <span className="tutorial-link" onClick={() => goToTutorial("Render a Project")}>Render a Project</span> tutorial for more information.</p>
        
        <RelatedTutorials tutorialNames={["Edit Compositions", "Art Recipes", "Manage Content", "Art", "Render a Project", "Create a Print and Play", "Upload to TheGameCrafter", "Export to Tabletop Simulator"]} goToTutorial={goToTutorial}/>
    </>
}