import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";

export default function CreatingYourFirstGame({goToTutorial}) {
    return <>
        <p>Welcome to Templative! Creating a Templative project is the first step to making your own tabletop games.</p>

        <HeadsUp message="A Templative project is a bunch of local files on your computer. It isn't stored on the cloud."/>

        <p>Give your project a name like <em>Sorcery and Collecting Things</em>, create a folder for it, select a template, and click create.</p>

        {/* <p>This will take you to the <span className="tutorial-link" onClick={() => goToTutorial("Creating Compositions")}>Creating Compositions</span> screen.</p> */}
    </>
}