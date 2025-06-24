import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import UploadToTheGameCrafter from "./Images/uploadingToTheGameCrafter.png";
import LoginToTheGameCrafter from "./Images/loginToGameCrafter.png";
import advertisement from "./Images/thegamecrafter/adImagesThumbnail.png"
import backdropAndLogo from "./Images/thegamecrafter/adImagesBackdrop.png"
import actionShot from "./Images/thegamecrafter/adImagesActionShot.png"
import adImages from "./Images/adImages.png"

export default function TheGameCrafter({goToTutorial, goToExternalLink}) {
    return <>        
        <p>Create professional physical prototypes of your games using <span className="external-link" onClick={() => goToExternalLink("https://www.thegamecrafter.com/make/getting-started")}>TheGameCrafter</span>, a print-on-demand service for board games. Dodge having to purchase minimum order sizes of 3000 units from traditional board game manufacturers by using TheGameCrafter who can print singular copies. Sell your game without maintaining a costly inventory by using TheGameCrafter's storefront.</p>
        
        <HeadsUp message="Note that TheGameCrafter can run expensive per unit, and typically takes a month to print and ship within the US." />
        
        <h3>Create an Account and Login</h3>
        
        <p>To begin automagically uploading your game and store page to TheGameCrafter, <span className="external-link" onClick={() => goToExternalLink("https://www.thegamecrafter.com/login")}>create an account and log in</span>.</p>
        
        <p>Then, click login to TheGameCrafter from the <span className="tutorial-link" onClick={() => goToTutorial("Render a Project")}>Render Tab</span> and the <span className="tutorial-link" onClick={() => goToTutorial("Upload to TheGameCrafter")}>Upload to TheGameCrafter</span> tab of a output folder.</p>
        
        <LocalLabeledImage src={LoginToTheGameCrafter} caption="Login to TheGameCrafter from within Templative."/>
        
        <p>Once on TheGameCrafter, login and reply 'yes take me back to Templative' when prompted.</p>
        
        <h3>Prepare Your Game Content</h3>
        
        <p>To change what the shop says, edit the category, coolFactors (three comma seperated items), short description, long description, maxPlayers, minAge, minPlayers, playTime, rulesDescription, tagline, tags, and website url of your <span className="tutorial-link" onClick={() => goToTutorial("Game Content")}>Game Content</span> file.</p>
        
        <h3>Design Your Store Images</h3>
        
        <p>Design your TheGameCrafter Store page by updating your background, logo, action shot, and store thumbnail.</p>
        
        <p>Use programs like Photoshop, Gimp, Illustrator, or Inkscape to edit your images. Find blank defaults in the <code>/gamecrafter</code> folder of your project. Make sure to keep their sizes and <code>.png</code> files types exactly as they are as TheGameCrafter rejects other settings.</p>
        
        <LocalLabeledImage src={adImages} caption="Example Ad Images" />
        
        <p>Consider these example images:</p>
        <LocalLabeledImage src={backdropAndLogo} caption="Example Backdrop and Logo" />
        <LocalLabeledImage src={advertisement} caption="Example Advertisement" />
        <LocalLabeledImage src={actionShot} caption="Example Action Shot" />
        
        <h3>Upload Your Game</h3>
        
        <p>Once your content and images are ready, you can upload your game to TheGameCrafter from the Upload to TheGameCrafter Screen.</p>
        
        <p>Mark the upload as Published if you'd like the store to go live immediately. Otherwise, the store will be in a draft state until you click the Publish button.</p>
        <p>Mark the upload Proofed to skip having to proof every image on TheGameCrafter.</p>
        <p>Mark the upload to include stock compositions to include stock dice and the like, otherwise only custom compositions will be included.</p>
        
        <LocalLabeledImage src={UploadToTheGameCrafter} caption="Upload to TheGameCrafter from within Templative."/>
        
        <p>Your GameCrafter ad images will be included with your upload to pretty up your page. Click the link in the output of the upload to go to your game's page on TheGameCrafter.</p>
        
        <RelatedTutorials tutorialNames={["Game Content", "Studio Content", "Render a Project"]} goToTutorial={goToTutorial} />
    </>
} 