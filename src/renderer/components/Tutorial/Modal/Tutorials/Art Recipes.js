import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function ArtRecipes({goToTutorial}) {
    return <>
        <p>Use art recipes files to tell Templative how to modify <span className="tutorial-link" onClick={() => goToTutorial("Art")}>Art</span> using your <span className="tutorial-link" onClick={() => goToTutorial("Content")}>Content files</span>.</p>
        <p>Each component has one to two pieces of art recipes. Usually there is a front art recipe, and a back art recipe. Art Recipes files themselves can be reused across compositions, but it is not atypical for every single composition to have its own art recipes.</p>

        <h2>Operations</h2>
        <p>Art Recipes commands are seperated into overlays, style updates, and text replacements.</p>
        
        <LabeledImage
            src="/operations.png"
            alt="Art Recipes operation examples"
            caption="Different types of art recipe operations"
        />
        <p>These operations are done in order, starting with loading the template art file specified at the top. By default, Templative looks for the starter template files in the `/art/templates` folder.</p>
        <LabeledImage
            src="/atTheTop.png"
            alt="An example art recipes file"
            caption="Sample art recipe configuration"
        />

        <p>As an example, if we wanted to change the background color to the `teamColor` value of the deck, we could create a style update that finds the element in the art file with the id "background" and set it's `fill` property to the value stored in the `teamColor` field of the deck's component content.</p>
        <LabeledImage
            src="/backgroundColorUpdate.png"
            alt="Image of replacing the color"
            caption="Updating background color through art recipes"
        />

        <h3>Overlays</h3>
        <p>Use overlays to layer svg files on top of one another. By default, Templative looks for overlays in the `art/graphicalInserts` directory.</p>
        <LabeledImage
            src="/artFiles.png"
            alt="Graphic inserts directory"
            caption="Directory structure for graphic overlays"
        />
        <p>In practice, this means copying the underlying template art file into a new document saved into the graphicInserts directory.</p>
        <p>By default, the top left corner of overlay is placed at the top left corner of the template document. But we can also manually specify the position of the top left corner of our overlay. To make sure you like its position, copy the x,y positions of the overlay in the main template file and pass those values to Templative.</p>
        <LabeledImage
            src="/positioning.png"
            alt="Pulling the xy positions from Inkscape"
            caption="Setting overlay position coordinates"
        />

        <h3>Style Updates</h3>
        <p>Vector art is made up of shapes that have styling applied to them, such as what color it is `fill`'d with. It works very similarly to the <a href="https://www.w3schools.com/css/">CSS styling of html documents</a>.</p>

        <p>We use style updates predominantly to change the fill, stroke color, font-size, and size of object in our files. To create a style update, we pick the element we want to change by it's ID {"("}see below{")"}, pick which style property we want to change, and then select which value goes in that style property.</p>

        <h4>Assigning ids in Inkscape</h4>
        <p>SVG files are simply <a href="https://aws.amazon.com/what-is/xml/#:~:text=An%20Extensible%20Markup%20Language%20(XML,similar%20to%20other%20text%20files.">xml files</a> under the hood. xml is a common "human readable" data format, like JSON. Inkscape provides a useful in app xml editor for our svg files.</p>

        <LabeledImage
            src="/findingXmlEditor.png"
            alt="Dropdown to access xml editor"
            caption="Accessing Inkscape's XML editor"
        />

        <p>Select an object in your art file, note that the corresponding xml element is selected in the xml editor. From here, we can select the id attribute of the element, rename it, and press enter.</p>
        
        <LabeledImage
            src="/renamingId.png"
            alt="xml id attribute"
            caption="Editing element IDs in the XML editor"
        />

        <h3>Text Replacements</h3>
        <p>Use text replacements to pipe text data into your art files. Instead of manually writing your content into your art files, instead write {"{name}"} in your art file.</p>
        
        <h3>Text Replacements within Text Replacements</h3>
        <p>A text replacement can contain a curly brace wrapped text within it. For instance, the rules value of a piece might be "Upgrade the power by {"{powerLevel}"}" which is followed by a text replacement for that powerlevel.</p>

        <h2>Piping Content into your Art Recipes</h2>
        <p>In Templative, a singular piece, such as a single poker card, has unique data associated with it. That piece in turn has data associated with it at the <em>component</em> level. It also by extension has access to any data about the game and studio it is a part of.</p>
        <p>All of this information is easily accessible within Templative. If I want to set the value of an overlay, style update, or text replacement to a field in the content of the piece, component, game, studio, give the field and the source it's from to Templative.</p>
        <LabeledImage
            src="/sourcingData.png"
            alt="Pulling the displayName of the game"
            caption="Accessing game data in art recipes"
        />
        <p>In this example we pull the name of the game from the `Game` source and the `displayName` field.</p>
        <p>See the <span className="tutorial-link" onClick={() => goToTutorial("Content")}>Content files</span> article for more information on how content works.</p>
    
        <h2>Art Recipes Tricks</h2>
        <p>Inkscape is confusing at first, but once learned is very powerful.</p>
        
        <h3>Unique Backs</h3>
        <p>Rather than make a new component per unique back, Templative is capable of creating new components per unique back in a component. For instance, if a component with 12 cards in it has only three unique faces, but has four unique backColor's, Templative will split this component into four seperate components for you.</p>

        <h4>Modifying Gradients in Templative</h4>
        <p>Gradients are handled by seperate xml entities from objects they color. Usually, an object's fill is set to a hexcode like #ffffff. When an object's background is set to a gradient however, the fill is set to the id of the gradient. The seperate gradient object in the svg file has style properties for the beginning and end colors of the gradient.</p>

        <LabeledImage
            src="/referenceToGradient.png"
            alt="The seperate gradient object"
            caption="Gradient definition in SVG structure"
        />

        <p>To modify a gradient from Templative therefore, rather than grabbing the id of the object whose fill is a gradient, we grab the id of the gradient object itself, and manually set the beginning and end stop colors.</p>

        <LabeledImage
            src="/stopColorStyle.png"
            alt="The stop color in xml"
            caption="Gradient stop color configuration"
        />
        <p>With this information, we can set the stop color in Templative:</p>
        <LabeledImage
            src="/assigningStopColor.png"
            alt="Assigning the end color"
            caption="Setting gradient colors in art recipes"
        />

        <HeadsUp message="Modifying drop shadows in Templative works similarly to gradients, can you figure it out?"/>
        
    </>
}