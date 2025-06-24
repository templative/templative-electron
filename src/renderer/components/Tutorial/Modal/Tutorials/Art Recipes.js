import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import Charizard from "./Images/charizard.png";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
export default function ArtRecipes({goToTutorial}) {
    return <>
        <p>Create the final art for your <span className="tutorial-link" onClick={() => goToTutorial("Edit Compositions")}>compositions</span> by using front and back art recipes that assemble your <span className="tutorial-link" onClick={() => goToTutorial("Art")}>art</span> files using your <span className="tutorial-link" onClick={() => goToTutorial("Manage Content")}>content</span> files.</p>
        
        

        <h2>Operations</h2>
        <p>Use overlays, style updates, and text replacements to assemble your final art.</p>
        
        <TemplativeLabeledImage
            src="/operations.png"
            alt="Art Recipes operation examples"
            caption="Different types of art recipe operations."
        />
        <p>Note that Templative executes these operations in order, starting with loading the template art file specified at the top, then the overlays, the style updates, and finally the text replacements. Find the template and overlay files in the <code>/art</code> folder.</p>
        
        <p>Consider the best Pokemon, Charizard.</p>
        
        <LocalLabeledImage src={Charizard} alt="Charizard" caption="Pokemon cards are complicated, don't do them by hand." />
        
        <p>Assemble Charizard by starting with a blank template svg file, overlaying the Charizard graphic, then overlaying the standard Pokemon card overlay, and finally the evolution graphic (Charmeleon). From there, update the styling of the border and background to fit with Charizard's fire theme. There are many text replacements to make: update the name, HP, type, height, stage, artist name, company name, year, etc.</p>

        <h3>Overlays</h3>
        <p>Layer svg files on top of one another using overlays. Place overlay files in the <code>/art</code> directory. </p>
        
        <p>Overlays need a filename; choose whether to input a static filename or to source it from a field in your <span className="tutorial-link" onClick={() => goToTutorial("Manage Content")}>Content</span> files. Templative automatically appends <code>~/.../Project/art/</code> to whatever value you give it, so to overlay the <code>/art/deckOverlay.svg</code> file, simply write <code>deckOverlay</code>.</p>

        
        <p>Choose whether you'd like to reuse these art recipes files across compositions or to create unique recipes for each composition. Often each piece in a composition has a unique overlay, to achieve this, add an overlay that pulls from the <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>piece's graphic field</span>, or another similarly named field. To reuse an art recipe for each player's deck but with different graphics for each player, pull the <code>graphic</code> filename from the <span className="tutorial-link" onClick={() => goToTutorial("Component Content")}>component content</span> file, with a unique component content file for each composition. If you want the value to be global to all compositions, decide whether to source the filename of the overlay from the <span className="tutorial-link" onClick={() => goToTutorial("Game Content")}>game content</span>, <span className="tutorial-link" onClick={() => goToTutorial("Studio Content")}>studio content</span>, or as a static value in the art recipe. Choose whichever is most convenient.</p>
        
        <p>Control where the overlay is placed using the <code>x</code> and <code>y</code> properties, by default the top left corner of the overlay is placed in the top left corner of the template file.</p>
        <TemplativeLabeledImage
            src="/positioning.png"
            alt="Pulling the xy positions from Inkscape"
            caption="Setting overlay position coordinates"
        />

        <h3>Style Updates</h3>
        <p>Update the styling of your elements using <span className="external-link" onClick={() => goToExternalLink("https://www.w3schools.com/css/")}>CSS</span> properties, which are fields like <code>fill</code> and <code>stroke</code>—the color of the shape and the color of the border respectively—that manage how your shapes look.</p>

        <p>For instance, to change the background color to the <code>teamColor</code> value of the deck, create a style update for the element with the id <code>background</code> and set its <code>fill</code> property to the value stored in the <code>teamColor</code> field of the deck's <span className="tutorial-link" onClick={() => goToTutorial("Component Content")}>component content</span>.</p>

        <h4>Assigning ids in Inkscape</h4>
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
        <HeadsUp message="Make sure that the id's within the overlay files are unique, otherwise Templative may perform unexpected operations."/>

        <h3>Text Replacements</h3>
        <p>Pipe text data into your art files using text replacements. Instead of manually writing content, place <code>{"{name}"}</code> in your art file, and <code>name</code> and what to replace it with, a static value or a field from your <span className="tutorial-link" onClick={() => goToTutorial("Manage Content")}>Content</span> files.</p>
        
        <RelatedTutorials tutorialNames={["Manage Content", "Art"]} goToTutorial={goToTutorial} />
    </>
}