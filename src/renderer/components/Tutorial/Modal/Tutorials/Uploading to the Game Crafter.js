import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function UploadingtoTheGameCrafter({goToTutorial, openExternalLink}) {
    return <>
        <p>TheGameCrafter is a print-on-demand service for board games. Typically manufacturers require a minimum order of several thousand copies. TheGameCrafter can do a single copy.</p>
        <p>This is </p>
        <p>Upload to <span className="external-link" onClick={() => openExternalLink("https://www.thegamecrafter.com/make/getting-started")}>TheGameCrafter</span> to purchase and sell your game.</p>
        {/* <TemplativePurchaseSuggestion isLoggedIn={this.props.isLoggedIn} doesOwnTemplative={this.props.doesOwnTemplative}/> */}
        <p>TheGameCrafter is a great resource for prototyping and reducing your risk when selling your games.</p>
        <p>To automagically upload to TheGameCrafter, go to TheGameCrafter screen.</p>
        <LabeledImage
            src="/theGameCrafterScreen.png"
            alt="TheGameCrafter screen"
            caption="The GameCrafter upload interface"
        />
        <p>We need an ApiKey and DesignerId to upload to TheGameCrafter automagically. Sign into <span className="external-link" onClick={() => openExternalLink("https://www.thegamecrafter.com")}>TheGameCrafter.com</span>. Go to the <span className="external-link" onClick={() => openExternalLink("https://www.thegamecrafter.com/account/overview")}>Your Account page</span> Under the Publishing section and click Designers.</p>
        <LabeledImage
            src="/publishing.png"
            alt="Publishing on TheGameCrafter"
            caption="Publishing section in TheGameCrafter dashboard"
        />
        <p>If you do not have a designer, create one. From there, click into your designer. Note the url of the Designer edit page, it should be something like `https://www.thegamecrafter.com/make/designer/YOUR-DESIGNER-ID-HERE`. Copy the DesignerId of the url and paste it into the Studio Content files of your game.</p>
        <LabeledImage
            src="/gameCrafterStudioContent.png"
            alt="Adding the DesignerId to Studio Content files"
            caption="Configuring DesignerId in studio settings"
        />
        <p>Render your game again so the DesignerId update shows up in modern renders.</p>
        <p>Back on TheGameCrafter.com, click ApiKeys under the Your Account section.</p>
        <LabeledImage
            src="/yourAccount.png"
            alt="Your Account options on TheGameCrafter"
            caption="TheGameCrafter account settings"
        />
        <p>You will probably be asked to verify your login by email. Verify it.</p>
        <p>Create an ApiKey by typing your name and Templative for Application Name, provide "https://www.templative.net" for the Application Url, and "Uploading to TheGameCrafter through Templative" as the reason.</p>
        <LabeledImage
            src="/creatingAnApiKey.png"
            alt="Creating your ApiKey"
            caption="API key creation process"
        />
        <p>Grab the Public Key of the ApiKey you generated and drop it in the ApiKey section of the Templative upload controls. Put in your username and password for TheGameCrafter.</p>
        <p>Toggle Publish? on to use the displayName of the game instead of the name when uploading. Toggle Proofed? on to mark all art as proofed already. Toggle Include Stock? to include stock components like coins and counters in this upload.</p>
        <p>Now, click `Upload to TheGameCrafter`.</p>
        <LabeledImage
            src="/uploadingInProgress.png"
            alt="The filled out upload controls"
            caption="Upload configuration interface"
        />
        <HeadsUp message="Templative uses your username and password to make requests on your behalf. The password is not saved to my server, and you will have to input it every time."/>
        <p>Watch as the file uploads take place in sequence.</p>
        <LabeledImage
            src="/uploadingLogging.png"
            alt="Upload logs"
            caption="Real-time upload progress"
        />
        <p>Click the final link at the top of the logs to open your completed game.</p>
        <LabeledImage
            src="/uploadedComponents.png"
            alt="Our Uploaded Components"
            caption="Successfully uploaded game components"
        />
    <h3>A Request from the Developer of Templative</h3>
    <p>Please be considerate of TheGameCrafter when uploading your game. We do not want to overload their servers with how many art files we bombard them with, at the same time, I do love sending them business.</p>
        
    <h2>Uploading the Shop Graphics</h2>
    <p>If you want to include TheGameCrafter shop graphics as part of your upload, update the art files in the `./gamecrafter` folder of your project.</p>
    <LabeledImage
        src="/theGameCrafterAdFiles.png"
        alt="The art files for theGameCrafter store"
        caption="Store graphics and promotional assets"
    />
    <p>Do not change the names or sizes of these are files, they are very specific. Any updates to these files will show up in theGameCrafter screen.</p>
    <p>To change what the shop says, edit your content file. The category, coolFactors (three comma seperated items), short description, long description, maxPlayers, minAge, minPlayers, playTime, rulesDescription, tagline, tags, and website url all feed directly into theGameCrafter's shop fields.</p>
    <LabeledImage
        src="/content.png"
        alt="TheGameCrafter fields in your Game content"
        caption="Game metadata configuration"
    />
    <p>Once done, your art files will be included with your upload to pretty up your page.</p>
    <LabeledImage
        src="/uploadDone.png"
        alt="The prettied up GameCrafter store"
        caption="Final store listing with graphics"
    />
    </>
}