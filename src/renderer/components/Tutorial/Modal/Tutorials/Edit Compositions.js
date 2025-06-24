import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";

import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RelatedTutorials from '../TutorialComponents/RelatedTutorials';
import EditCompositionImage from "./Images/editComposition.png"
import CompositionContextMenu from "./Images/compositionContextMenu.png"
import CompositionSettings from "./Images/compositionSettings.png"
import EditingStockComponents from "./Images/editingStockComponents.png"


export default function Compositions({goToTutorial}) {
    return <>
        <p>Edit compositions to change how its <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>art recipes</span> use its <span className="tutorial-link" onClick={() => goToTutorial("Manage Content")}>content</span> to modify its <span className="tutorial-link" onClick={() => goToTutorial("Art")}>art</span> files. Add custom or stock compositions to your project using the <span className="tutorial-link" onClick={() => goToTutorial("Add Compositions")}>Add Compositions</span> tab.</p> 

        <h3>Editing Custom Compositions</h3>
        
        <p>See how the composition <code>actionCaps</code> has several files that underpin it: a component content file named <code>actions</code>, a piece content file named <code>actions</code>, a front art recipe file named <code>action</code>, and a back art recipe file named <code>actionBack</code>. Art is <em>what</em> you are modifying, art recipes is <em>how</em> you are modifying it, and content is <em>with what</em> you are modifying it. Content says <code>10hp</code>, art recipes say <code>replace {"{health}"} with the piece's hp value</code>, and the art file has the text <code>{"{health}"}</code>.</p>

        <LocalLabeledImage
            src={EditCompositionImage}
            caption="A composition on the piece content tab"
        />
        
        <HeadsUp message="Templative autosaves files as you edit them."/>
        
        <h4>Reuse Files Across Compositions</h4>
        <p>Reuse art, art recipes, and content files across compositions to avoid repeating yourself. Consider the case where there is a piece for every player with info like name, color, and role. Instead of writing 5 different piece content files that all say the same thing, reuse the player piece content file across the deck, tile, and dice compositions that each player has.</p>
        
        <p>Right click your composition to open the context menu where you can open the composition for editing, toggle whether its disabled, render it, delete it, or duplicate it. Disabled compositions are not rendered when you render your entire project.</p>
        
        <LocalLabeledImage
            src={CompositionContextMenu}
            caption="The context menu for a composition"
        />
        <p>Change the type, name, which files it uses, and whether the composition is disabled from the edit composition settings menu.</p>
        <LocalLabeledImage
            src={CompositionSettings}
            caption="Change which files are used to render the composition"
        />
        
        <h4>Editing Stock Compositions</h4>
        <p>Automatically include the correct amount of dice in your GameCrafter and Tabletop Simulator exports by managing the quantities of various colors of your stock compositions from the edit compositions view.</p>
        <LocalLabeledImage
            src={EditingStockComponents}
            caption="This project includes 1 stock die"
        />
        <RelatedTutorials tutorialNames={["Add Compositions"]} goToTutorial={goToTutorial}/>
        </>
}