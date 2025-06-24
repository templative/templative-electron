import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
export default function GameContent({goToTutorial}) {
    return <>
        
        <p>Use Game Content to describe your game. Like <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>Piece Content</span> and <span className="tutorial-link" onClick={() => goToTutorial("Studio Content")}>Studio Content</span>, reference Game Content from <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>Art Recipes</span>.</p>

        <p>Note that both Studio and Game Content are available to all compositions. Consider the case where a card has a name in its piece content, references the name of the game from Game Content, and references the name of the studio and designer from Studio Content.</p>
        
        <h3>Game Content Updates the TheGameCrafter Store</h3>
        <p>Manage how your TheGameCrafter store page looks by updating the playtime, player count, age rating, cool factors, short description, and long description. <span className="tutorial-link" onClick={() => goToTutorial("Upload to TheGameCrafter")}>Upload your game to TheGameCrafter</span> to see your changes.</p>
        
        <p>Update the images your TheGameCrafter store will use by editing your GameCrafter ad images.</p>
        
        <RelatedTutorials tutorialNames={["Piece Content", "Studio Content", "Art Recipes"]} goToTutorial={goToTutorial} />
    </>
}