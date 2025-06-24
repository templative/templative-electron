import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import installStuff from "./Images/IconFonts/installStuff.png"
import regularFontInstallation from "./Images/IconFonts/regularFontInstallation.png"
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import { YoutubeLong } from "../TutorialComponents/YoutubeVideos";

export default function Fonts({goToTutorial, goToExternalLink}) {
    return <>
        <p>Manage the fonts your game depends on from the Fonts tab.</p>
        
        
        
        <p>Download fonts from places like <span className="external-link" onClick={() => goToExternalLink("https://fonts.google.com/")}>Google Fonts</span> or <span className="external-link" onClick={() => goToExternalLink("https://www.dafont.com/")}>DaFont</span>. Keep in mind fonts have different licenses and some cost money to license.</p>
        
        <p>To begin making your own font, consider watching this tutorial:</p>
        
        <YoutubeLong videoId="tYKsALqR-pk"/>
        <p>Once you have downloaded or created your own font, place it in your project's <code>/fonts</code> directory.</p>       
        
        <HeadsUp message="Consider downloading Helevetica onto your Windows and Sans-Serif onto your Mac for consistency."/>
        
        <p>Install the fonts to your operating system by clicking the Install button on the font.</p>
        
        <LocalLabeledImage src={regularFontInstallation} caption="Install fonts to your operating system."/>
        <p>The font installation window varies by operating system, but for all cases press install on any Font installation windows that appear.</p>
        <LocalLabeledImage src={installStuff} caption="Install fonts to your operating system. This font has many types such as bold and italics that have their own windows."/>
        <HeadsUp message="Make sure to install the font in your operating system as Templative does not manage and is not aware of fonts on your system."/>
        <p>Now that you have installed your fonts, use them in your <span className="tutorial-link" onClick={() => goToTutorial("Art")}>Art files</span>.</p>
        
        <HeadsUp message="Templative caches your art renders and doesn't know about fonts on your system. So cached results of your art may use old font settings."/>
        
        <p>Delete the contents of your art cache folder <code>~/Documents/Templative/art-cache</code> so your art can be re-rendered with the new fonts. </p>
        
        <RelatedTutorials tutorialNames={["Art", "Use Icon Fonts"]} goToTutorial={goToTutorial}/>
    </>
}