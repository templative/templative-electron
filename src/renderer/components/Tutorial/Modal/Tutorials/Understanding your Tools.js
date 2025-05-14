import React, { useState, useEffect } from 'react';
const tabs = "/tabs.png"

export default function UnderstandingYourTools({goToTutorial}) {
    return <>
        <p>Templative provides you with many tools to be successful at board game production. These are split into various tables within Templative.</p>
        {/* <img src={tabs} alt="Templative's tabs"/> */}
        <p>Templative has the following tabs:</p>
        <ul>
            <li><span className="tutorial-link" onClick={() => goToTutorial("Creating Compositions")}>Composition Creation screen</span>: name and create new compositions.</li>
            <li><span className="tutorial-link" onClick={() => goToTutorial("Compositions")}>Edit screen</span>: modify the game's content, art, art recipes, and how the compositions assembles them.</li>
            <li><span className="tutorial-link" onClick={() => goToTutorial("Rendering your Game")}>Render screen</span>: render your game.</li>
            <li><span className="tutorial-link" onClick={() => goToTutorial("Creating a Print and Play")}>Print screen</span>: create pdfs of your board game for home printing.</li>
            <li><span className="tutorial-link" onClick={() => goToTutorial("Exporting to Tabletop Simulator")}>Tabletop Simulator screen</span>: create Tabletop Simulator saves to later publish for sharing.</li>
            {/* <li><span className="tutorial-link" onClick={() => goToTutorial("Exporting to Tabletop Playground")}>Tabletop Playground screen</span>: create Tabletop Playground packages for later publishing for sharing. We included Tabletop Playground as the <a href="https://discord.com/invite/breakmygame">Break my Game Discord</a> doesn't allow Tabletop Simulator.</li> */}
            <li><span className="tutorial-link" onClick={() => goToTutorial("Uploading to the Game Crafter")}>TheGameCrafter screen</span>: Upload your rendered game to TheGameCrafter for prototyping.</li>
            {/* <li><span className="tutorial-link" onClick={() => goToTutorial("Attending a Convention")}>The Convention Search screen</span>: Find and learn about conventions near you.</li>
            <li><span className="tutorial-link" onClick={() => goToTutorial("Finding a Publisher")}>The Publisher Search and Match screen</span>: Find and learn about publishers near you.</li> */}
            {/* <li>The Feedback screen: Send me feedback.</li> */}
        </ul>
        </>
}