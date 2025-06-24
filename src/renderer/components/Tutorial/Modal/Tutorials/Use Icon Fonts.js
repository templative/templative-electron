import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import { YoutubeLong } from "../TutorialComponents/YoutubeVideos";

import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import coloredIcon from "./Images/IconFonts/coloredIcon.png"
import iconFontExample from "./Images/IconFonts/iconFontExample.png"
import giveItAOnceOver from "./Images/IconFonts/giveItAOnceOver.png"

export default function IconFonts({goToTutorial, goToExternalLink}) {
    return <>
        <p>Use icon fonts to add icons to your text areas. Because overlays require a fixed x,y position, choose between adding icons as <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>overlays</span> or as your own icon fonts.</p>
        
        <LocalLabeledImage src={coloredIcon} caption="A icon in text"/>
        
        <p>Download your own icon fonts from places like <span className="external-link" onClick={() => goToExternalLink("https://fontawesome.com/icons")}>Font Awesome</span> or <span className="external-link" onClick={() => goToExternalLink("https://icomoon.io/app/#/select")}>IcoMoon</span>.</p>
        <p>Once you have downloaded your icon font, you can import it into Templative by placing it in your projects <code>/fonts</code> folder. Keep the fonts you use in your project folder so it will be easier to update them and to help your collaborators access them.</p>
        
        <LocalLabeledImage src={iconFontExample} caption="Icon fonts ready to use."/>
        
        <HeadsUp message="Make sure to install the font in your operating system as Templative does not manage and is not aware of fonts on your system."/>
        
        <h3>Creating your Own Icon Font</h3>
        
        <p>Create your own icon fonts by creating a bunch of simple svgs that are the same size. Then import them into Templative by going to the <code>Fonts {">"} Icon Fonts</code> tab and click <code>Create Icon Font</code>. Select your svgs, name it, and click create. Install the created font, then use it in your <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>Piece Content</span>.</p>
        
        <LocalLabeledImage src={giveItAOnceOver} caption="Import svgs into Templative to create an icon font."/>
        
        <HeadsUp message="Templative and Inkscape do not support multicolored icon fonts or multicolored emojis."/>
             
        <p>Follow along as I create an Icon Font step by step in the <span className="tutorial-link" onClick={() => goToTutorial("Make a Pokemon Icon Font")}>Creating a Pokemon Icon Font</span> tutorial.</p>
        
        <HeadsUp message="Templative caches your art renders and doesn't know about fonts on your system. So cached results of your art may use old font settings."/>
        
        <p>Delete the contents of your art cache folder <code>~/Documents/Templative/art-cache</code> so your art can be re-rendered with the new fonts. </p>
        
        <RelatedTutorials goToTutorial={goToTutorial} tutorialNames={["Piece Content", "Art Recipes", "Make a Pokemon Icon Font"]}/>
    </>
}