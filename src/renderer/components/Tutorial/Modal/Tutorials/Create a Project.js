import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";

export default function CreateYourFirstGame({goToTutorial}) {
    return <>
        <p>Welcome to Templative! Creating a Templative project is the first step to making your own tabletop games.</p>

        <p>Give your project a name like <em>Sorcery and Collecting Things</em>, create a folder for it, select a template, and click create.</p>
        
        <RelatedTutorials tutorialNames={["Start a Project"]} goToTutorial={goToTutorial} />
    </>
}