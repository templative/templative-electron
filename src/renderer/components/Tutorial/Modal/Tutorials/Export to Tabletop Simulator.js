import React, { useState, useEffect } from 'react';
import HeadsUpContent from "../TutorialComponents/HeadsUpContent";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import tabletopSimulatorMain from "./Images/tabletopSimulator_main.png";
import tabletopSimulatorSingleplayer from "./Images/tabletopSimulator_singleplayer.png";
import tabletopSimulatorYourGame from "./Images/tabletopSimulator_yourgame.png";
import tabletopSimulatorLoaded from "./Images/tabletopSimulator_loaded.png";
import tabletopSimulatorCreationScreen_created from "./Images/tabletopSimulatorCreationScreen_created.png";
import tabletopSimulatorCreationScreen from "./Images/tabletopSimulatorCreationScreen.png";

export default function ExportingToTabletopSimulator({goToTutorial, goToExternalLink}) {
    return (
        <>
            <p>Convert your Templative project into a playable <span className="external-link" onClick={() => goToExternalLink("https://kb.tabletopsimulator.com/custom-content/save-file-format/")}>Tabletop Simulator</span> save file by pressing the Create Simulator Save button. Look in your <code>~/Documents/My Games/Tabletop Simulator</code> directory for your save file.</p>
            <LocalLabeledImage src={tabletopSimulatorCreationScreen} caption="Press the Create Simulator Save button" />
            <p>If Tabletop Simulator's save files are stored somewhere else on your computer, change the Tabletop Simulator save location using the magnifying glass icon above the Create Simulator Save button.</p>
            <LocalLabeledImage src={tabletopSimulatorCreationScreen_created} caption="Our composition tiled for TTS" />
            <LocalLabeledImage src={tabletopSimulatorMain} caption="Select Create" />
            <LocalLabeledImage src={tabletopSimulatorSingleplayer} caption="Select Singleplayer" />
            <LocalLabeledImage src={tabletopSimulatorYourGame} caption="Select your Newly Created Save" />
            <LocalLabeledImage src={tabletopSimulatorLoaded} caption="Search the Bag for your Compositions" />
            
            <HeadsUpContent>
                <p>Note that Templative does not come with a copy of <span className='external-link' onClick={() => goToExternalLink("https://store.steampowered.com/app/286160/Tabletop_Simulator/")}>Tabletop Simulator</span>.</p>
            </HeadsUpContent>
            
            

            <h2>Understanding the Simulator Save File</h2>
            <p>Tabletop Simulator saves are <span className='external-link' onClick={() => goToExternalLink("https://tabletopsimulator.com/docs/saves/")}>JSON files</span> that contain a playable snapshot of your game. They are saved in your ~/Documents/My Games/Tabletop Simulator directory.</p>
            
            <p>When you are ready to share your Tabletop Simulator save with players, you can use <span className='external-link' onClick={() => goToExternalLink("https://kb.tabletopsimulator.com/custom-content/steam-workshop/")}>Tabletop Simulator's ingame Steam Workshop upload tools</span>.</p>
            
            <p><span className='external-link' onClick={() => goToExternalLink("https://kb.tabletopsimulator.com/custom-content/asset-importing/")}>Steam Workshop saves do not have access to your local Tabletop Simulator images</span>. Templative handles linking your images to Amazon's cloud.</p>

            
            <h2>Uploading to the Steam Workshop</h2>
            <p>Now that we have our save, and have moved things around how we like, uploading it is straightforward.</p>
            
            <p>In the top controls of our Tabletop Sim save, click Modding, then Workshop Upload.</p>
            <TemplativeLabeledImage
                src="/uploadingToWorkshop.png"
                alt="The Tabletop Simulator screen"
                caption="Workshop upload interface"
            />
            <p>Give it a nice title, description, and thumbnail.</p>
            <TemplativeLabeledImage
                src="/workshopUploadControls.png"
                alt="The Tabletop Simulator screen"
                caption="Workshop upload configuration"
            />
            
            <p>Consider reading <span className='external-link' onClick={() => goToExternalLink("https://blog.tabletopsimulator.com/blog/tabletop-simulator-uploading-to-steam-workshop")}>Tabletop Simulator's documentation</span> for more detailed information about the upload process.</p>
        </>
    );
} 