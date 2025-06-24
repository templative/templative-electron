import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import { YoutubeLong } from "../TutorialComponents/YoutubeVideos";

import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import arranged from "./Images/IconFonts/arranged.png"
import creatingFont from "./Images/IconFonts/creatingFont.png"
import exporting from "./Images/IconFonts/exporting.png"
import mouseOver from "./Images/IconFonts/mouseOver.png"
import pokemonExamples from "./Images/IconFonts/pokemonExamples.png"
import art from "./Images/IconFonts/art.png"
import differenceTool from "./Images/IconFonts/differenceTool.png"
import fillTool from "./Images/IconFonts/fillTool.png"
import naming from "./Images/IconFonts/naming.png"
import selectingOutput from "./Images/IconFonts/selectingOutput.png"
import artRecipe from "./Images/IconFonts/artRecipe.png"
import example from "./Images/IconFonts/example.png"
import installing from "./Images/IconFonts/installing.png"
import oneImage from "./Images/IconFonts/oneImage.png"
import typeContent from "./Images/IconFonts/typeContent.png"
import giveItAOnceOver from "./Images/IconFonts/giveItAOnceOver.png"
import coloredIcon from "./Images/IconFonts/coloredIcon.png"

export default function MakeAPokemonIconFont({goToTutorial, goToExternalLink}) {
    return <>        
        <p>Create svgs in Inkscape or Illustrator or your favorite vector editor. Learn how I use Inkscape by watching this video.</p>
        
        <YoutubeLong videoId="L6F7X9YSJCU"/>
        
        <p>Since we're basing our icon font on existing symbols, copy in an example image into Inkscape.</p>
        <LocalLabeledImage src={pokemonExamples} caption="The original Bokemon types"/>
        <p>Use the fill tool to get the shape of the icon.</p>
        <LocalLabeledImage src={fillTool} caption="The filled in symbol."/>
        <p>Combine the parts of the symbol, like the Fairy type symbol, into one svg path element by selecting all the pieces and pressing <code>Path {">"} Union</code>.</p>
        <LocalLabeledImage src={oneImage} caption="Keep things simple by unioning the icon"/>
        <p>Create a bunch of circles with the same size. See how I've arranged them into a grid with a gray background to make it easier to see.</p>
        <LocalLabeledImage src={arranged} caption="Arrange your icons in a grid"/>
        <p>Select the circle and the symbol, then press <code>Path {">"} Difference</code> to get the shape of the icon. Delete the gray squares as they are not necessary.</p>
        <LocalLabeledImage src={differenceTool} caption="Circles with the symbol cut out"/>
        <p>Select each symbol and give it a name by going to <code>Edit {">"} XML Editor</code>. Click each shape and change the <code>id</code> attribute to the name of the type.</p>
        <LocalLabeledImage src={naming} caption="Named icons for easy reference"/>
        <p>Open the <code>File {">"} Export</code> menu. Select the Batch Export tab, select all your icons, and toggle the Batch Export tab to <code>Selection</code> export. Change the type of export to <code>Plain SVG</code>. Create and choose a folder in your icon fonts folder for ease of access, I named mine <code>/pokemonSymbols</code>. Click <code>Export</code>.</p> 
        <LocalLabeledImage src={exporting} caption="Icons ready for export"/>
        <p>Open Templative, go to the Fonts tab, toggle to Icon Fonts, click the Create Icon Font button. Click the Add SVG files area. Select our created icons.</p>
        <LocalLabeledImage src={selectingOutput} caption="Select your created svgs"/>
        <p>Make sure the icons look good in the preview. Name your font. Click Create Icon Font.</p>
        <LocalLabeledImage src={giveItAOnceOver} caption="Good to go?"/>
        <p>Appreciate your hard work!</p>
        <LocalLabeledImage src={creatingFont} caption="Our prepared icon font"/>
        <p>Press the install button in the top right corner of our font. On both Mac and Windows, press the install button of the font window that appears.</p>
        <LocalLabeledImage src={installing} caption="The font window for Windows"/>
        <HeadsUp message="Note that since this is an icon font the example text will look weird."/>
        <p>To use a glyph of our font, click a glyph to copy its code to your clipboard. </p>
        <LocalLabeledImage src={mouseOver} caption="Copying the Fairy type glyph to our clipboard"/>
        <p>Paste it into a field of a Piece in your <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>Piece Content</span>. If you want more than one icon you paste it multiple times.</p>
        <LocalLabeledImage src={typeContent} caption="A Pokemon card in a Euro deck with type Fairy"/>
        <p>Update the art file that will take the type content.</p>
        <LocalLabeledImage src={art} caption="Our art ready to recieve the type content"/>
        <p>Update the <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>Art Recipe</span> to use the type from the Piece Content.</p>
        <LocalLabeledImage src={artRecipe} caption="Replace {type} with the Piece's type"/>
        <p>Render your Pokemon card, and voila! Our card now has a type.</p>
        <LocalLabeledImage src={example} caption="A simple card with a type"/>
        
        <p>If you would like to change the color of the glyph, update the fill color in the glyph:</p>
        <p><code>{"<iconGlyph fill='red' font-family='BokemonTypes' glyph='type_fairy'/>"}</code></p>
        
        <LocalLabeledImage src={coloredIcon} caption="A red Fairy type"/>
        
        <RelatedTutorials goToTutorial={goToTutorial} tutorialNames={["Piece Content", "Art Recipes"]}/>
    </>
}