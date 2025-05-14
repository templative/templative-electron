import React, { useState, useEffect } from 'react';
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function ExportingtoTabletopSimulator({goToTutorial}) {
        return <>
            <p>Export to Tabletop Simulator to playtest your game with your friends virtually.</p>
            {/* <TemplativePurchaseSuggestion isLoggedIn={this.props.isLoggedIn} doesOwnTemplative={this.props.doesOwnTemplative}/> */}
            <p>Tabletop Simulator is one of the most common ways to playtest your game. We create custom content by creating a save that we upload to the Steam Workshop. To do this we:</p>
            
                <p>Go to the Tabletop Simulator Screen.</p>
                <p>Put in your Tabletop Simulator saves documents folder, usually `...\Documents\My Games\Tabletop Simulator`</p>
                <p>Select an outputed game.</p>
                <p>Press `Create Simulator Save`. Wait a couple seconds, this operation can take several seconds.</p>
                <LabeledImage
                    src="/tabletopSimulatorScreen.png"
                    alt="The Tabletop Simulator screen"
                    caption="The Tabletop Simulator export interface"
                />
                <p>Open Tabletop Simulator. Click Create, then Singleplayer. Notice your Templative created saves on the bottom row:</p>
                <LabeledImage
                    src="/tabletopSimulatorSaves.png"
                    alt="The Tabletop Simulator screen"
                    caption="Accessing saved games in Tabletop Simulator"
                />
                <p>Click the game save we just created.</p>
                <LabeledImage
                    src="/inTabletopSim.png"
                    alt="Our game in Tabletop Simulator"
                    caption="Game loaded in Tabletop Simulator"
                />
            
            <h2>Uploading our Tabletop Simulator Game to the Steam Workshop</h2>
            <p>Now that we have our save, and have moved things around how we like, uploading it is straightforward.</p>
            
                <p>In the top controls of our Tabletop Sim save, click Modding, then Workshop Upload.</p>
                <LabeledImage
                    src="/uploadingToWorkshop.png"
                    alt="The Tabletop Simulator screen"
                    caption="Workshop upload interface"
                />
                <p>Give it a nice title, description, and thumbnail.</p>
                <LabeledImage
                    src="/workshopUploadControls.png"
                    alt="The Tabletop Simulator screen"
                    caption="Workshop upload configuration"
                />
            
            <p>Consider reading <a href="https://blog.tabletopsimulator.com/blog/tabletop-simulator-uploading-to-steam-workshop">Tabletop Simulator's documentation</a>.</p>
            </>
}