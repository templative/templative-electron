import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import Diagram from "./Images/templativeDiagram.svg"
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import "./StartAProject.css"
export default function CreatingYourGame({goToTutorial}) {
    return <>
        <p>Welcome to Templative! Manage the end-to-end production of your tabletop games using Templative projects. <span className='tutorial-link' onClick={()=>goToTutorial("Render a Project")}>Render your art</span>, <span className='tutorial-link' onClick={()=>goToTutorial("Create a Print and Play")}>distribute print and plays</span>, <span className='tutorial-link' onClick={()=>goToTutorial("Upload to TheGameCrafter")}>order professional prototypes</span>, and <span className='tutorial-link' onClick={()=>goToTutorial("Export to Tabletop Simulator")}>playtest your game</span> from the comfort of one application.</p>
        
        <p><span className='tutorial-link' onClick={()=>goToTutorial("Add Compositions")}>Add</span> and <span className='tutorial-link' onClick={()=>goToTutorial("Edit Compositions")}>edit</span> your compositions like custom and stock decks, boxes, dice, dials that follow <span className='tutorial-link' onClick={()=>goToTutorial("Art Recipes")}>recipes</span> for combining your <span className='tutorial-link' onClick={()=>goToTutorial("Manage Content")}>content</span> with your <span className='tutorial-link' onClick={()=>goToTutorial("Art")}>art</span> to make <span className='tutorial-link' onClick={()=>goToTutorial("Render a Project")}>final renders</span>, saving you hundreds of hours of work.</p>
        
        <p>Break down your project into reusable parts.</p>
        <LocalLabeledImage src={Diagram} caption="Manage reusable recipes, content, and art files instead of manually creating art and simulator saves, pdfs, and TheGameCrafter bleeds."/>
        
        
        <div className="start-a-project-table-container">
            <table className="start-a-project-table">
                <thead>
                    <tr>
                        <th>Term</th>
                        <th>Purpose</th>
                        <th>Example</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Project</td>
                        <td>The wrapper around a single game or game expansion.</td>
                        <td>The box and the contents of Axis & Allies or a single booster pack of Pokemon.</td>
                    </tr>
                    <tr>
                        <td>Composition</td>
                        <td>A product included in your project, such as the box, cards, dice.</td>
                        <td>A mint tin or some mint tin cards.</td>
                    </tr>
                    <tr>
                        <td>Content</td>
                        <td>Describe your pieces, components, and game.</td>
                        <td>Name the card "Orc Warrior" with a health of 10 and a team color of red.</td>
                    </tr>
                    <tr>
                        <td>Art</td>
                        <td>Describe the look of your graphic design and key art.</td>
                        <td>The graphic of an Orc Warrior and a collectible card game overlay.</td>
                    </tr>
                    <tr>
                        <td>Art Recipes</td>
                        <td>Combine art files, update placeholders, and style your art.</td>
                        <td>Layer the Orc Warrior's graphic on top of the collectible card game overlay, change its placeholder name to "Orc Warrior" and its health to 10. Change the border color to red.</td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Define content at different levels so that you don't have to repeat yourself.</p>
        <div className="start-a-project-table-container">
            <table className="start-a-project-table">
                <thead>
                <tr>
                    <th>Content</th>
                    <th>Scope</th>
                    <th>Purpose</th>
                    <th>Example</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Piece</td>
                    <td>Single card, token, or die</td>
                    <td>Defines a specific game element</td>
                    <td>The “Orc Warrior” card with 10 health</td>
                </tr>
                <tr>
                    <td>Component</td>
                    <td>A group of similar pieces</td>
                    <td>Defines shared data common to all pieces in the composition</td>
                    <td>All Monster cards have the same border color and type</td>
                </tr>
                <tr>
                    <td>Game</td>
                    <td>Game-wide details</td>
                    <td>Describe your game's player count, description, name, etc</td>
                    <td>“A deck-building game for 2 players in a fantasy war”</td>
                </tr>
                <tr>
                    <td>Studio</td>
                    <td>Your company or brand</td>
                    <td>Describe your company</td>
                    <td>Bingle Bongle Games LLC and designed by So and So</td>
                </tr>
                </tbody>
            </table>
        </div>
        
        <p>Pull information from your content into your art recipes to update your art to create final renders that you can export to TheGameCrafter, PDF, or Tabletop Simulator.</p>
        
        <p>Get started by <span className='tutorial-link' onClick={()=>goToTutorial("Add Compositions")}>adding your first composition</span>.</p>
        
        <h3>Rendering with Inkscape</h3>
        <p>To get access to Inkscape unique features such as text wrapping, patterns, clipping border, and high dpi, install <span className="external-link" onClick={() => goToExternalLink("https://inkscape.org/")}>Inkscape</span> and then go to <code>Edit {">"} Edit Settings</code> and change <code>Which Rendering Program Should Templative Use?</code> to <code>Inkscape</code>. See the <span className="tutorial-link" onClick={() => goToTutorial("Render a Project")}>Render a Project</span> tutorial for more information.</p>
        
        <RelatedTutorials tutorialNames={["Edit Compositions", "Art Recipes", "Manage Content", "Art", "Render a Project", "Create a Print and Play", "Upload to TheGameCrafter", "Export to Tabletop Simulator"]} goToTutorial={goToTutorial}/>
    </>
}