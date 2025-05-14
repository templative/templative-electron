import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function RenderingYourGame({goToTutorial}) {
    return <>
        <p>Render your game to create the completed artwork of all or part of your game. If you haven't already, install Inkscape by following the <a href={`/docs/installing-the-tools`}>Installing the Tools</a> article.</p>
        <p>There are three ways to render your game:</p>
        <ul>
            <li>Render your Entire Game</li>
            <li>Render a Component</li>
            <li>Render a Piece</li>
        </ul>
        <p>To render your entire game, go to the Render screen and press the Render All button. While you can queue up several renders at a time, it is not recommended.</p>
        <LabeledImage
            src="/renderScreen.png"
            alt="The render screen"
            caption="The main render interface"
        />
        <p>If you want to render only one component, toggle it in the dropdown above the Render All button.</p>
        <HeadsUp message="Mac users may notice that the Inkscape icon shows for each rendered image, this is a known issue I hope to fix. Thank you for your patience."/>
        <p>Note that each time you render something in this screen, a new folder is created in the `/output` folder of your project.</p>
        <HeadsUp message="For Git users, the default .gitignore for Templative projects ignores the contents of the output folder, as it would otherwise clutter your checkins."/>
        <p>As the game is rendered, you will notice the progress bar advance and the images of your game appear. Hover your mouse over the magnifying glass of an output image to get a closer look.</p>
        <LabeledImage
            src="/aCloserLook.png"
            alt="A closer look at an image"
            caption="Examining rendered output"
        />
        <p>To go to the folder containing your art, right click an output folder.</p>
        <img src="/goToOutput.png" alt="How to go to the output of a render"/>
        <h2>Rendering a Singular Piece</h2>
        <p>While you are designing your components, you may want to see an example output without stopping to render the entire game. To render just one piece, go the the Edit Screen, select a component and a piece, and press Preview.</p>
        <img src="/previewAPiece.png" alt="An example rendered piece"/>
        <p>Similar to the other render view, hover your mouse over a render preview to see a larger version of the art. Note that previews aren't save locally to your project.</p>
        </>
}