import React, { useState, useEffect } from 'react';
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import XmlEditorExplanation from "./Explanations/xmlEditor";

import OverlayCombining from "./Images/OverlayCombining.png";
import OverlaySeperating from "./Images/OverlaySeperating.png";
import ArtTemplateExample from "../../../../../main/templative/lib/componentTemplates/PokerDeck.svg"
export default function Art({goToTutorial, goToExternalLink}) {
    return <>
        <p>Assemble final art for your <span className="tutorial-link" onClick={() => goToTutorial("Edit Compositions")}>compositions</span> by creating <span className="external-link" onClick={() => goToExternalLink("https://www.w3.org/TR/SVG11/")}>.svg</span> art files that your <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>art recipes</span> and <span className="tutorial-link" onClick={() => goToTutorial("Manage Content")}>content</span> files can modify. Place your svg art files in the <code>/art</code> directory. Use only <span className="external-link" onClick={() => goToExternalLink("https://www.w3.org/TR/SVG11/")}>svg</span> art files, and include any <code>.png</code> or <code>.jpg</code> files inside your svg files.</p>
        
        <p>Use programs like Inkscape or Adobe Illustrator to create your art files.</p>
        
        <h3>Use Templative to Assemble Art</h3>
        
        <p>Rather than manually writing <code>"Artillery, 10 health points, blue"</code> in the artwork, write <code>{"{name}"}</code> <code>{"{health}"}</code> and <code>{"{description}"}</code> in the artwork and add a text replacement art recipe command.</p>
        
        <p>Mock up a final version of your card, seperate it into different svg files, and use overlay commands in the art recipes to combine them.</p>
        
        <p>Instead of changing the color of the team emblem once for each player, add a style update to the art recipe to change the color of the team emblem.</p>
        <LocalLabeledImage
            src={OverlaySeperating}
            caption="The basic card plus two overlays."
        />
        
        <LocalLabeledImage
            src={OverlayCombining}
            caption="The final card, using the first overlay."
        />
        
        <h2>Art Templates</h2>
        <p>Use the colors of the templates to correctly place the art in your compositions. Stretch colors into the black area to fill the entire art, place borders and other non-essential art in the dark gray area, and use the actual content of your art file in the light gray areas.</p>
        <LocalLabeledImage
            src={ArtTemplateExample}
            caption="The art template of a Poker card"
        />

        <h2>Art File Sizing</h2>
        <p>Utilize Templative's default svg file size for the bottommost svg art file of your compositions, as they are setup to mirror the pixel dimensions that TheGameCrafter expects. In most cases this is handled for you by Templative, but in the cases where you create art files yourself, the viewbox of your svgs and size of your art files must match the <em>pixel</em> dimensions TheGameCrafter asks for (for poker cards that <code>825x1125px</code> with a scale of 1.</p>
        <TemplativeLabeledImage
            src="/sizing.png"
            alt="Art Recipes operation examples"
            caption="Art files must match TheGameCrafter's pixel dimensions"
        />
        
        <h2>DPI</h2>
        <p>Rest easy knowing Templative handles the resizing and output of your svgs into raster art for printing while maintaining the 300 DPI expected for print jobs.</p>
        
        <h2>CMYK vs RGB</h2>
        <p>Note that Templative outputs art files as pngs, which only supports the RGB color profile, instead of the typical CYMK color profile used in printing. If you are concerned about the color safety of your output, pull the final svgs created by Templative into Illustrator and <span className="external-link" onClick={() => goToExternalLink("https://www.wikihow.com/Change-Adobe-Illustrator-to-CMYK")}>export using its CMYK color profile</span>.</p>
        
        <RelatedTutorials tutorialNames={["Art Recipes", "Manage Content"]} goToTutorial={goToTutorial} />
        </>
}