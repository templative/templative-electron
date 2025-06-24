import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";

export default function StudioContent({goToTutorial}) {
    return <>
        <p>Use Studio Content to describe you or your design studio. Put information like your company's name, website, support email, and social media links.</p>
        
        <p>Like <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>Piece Content</span> and <span className="tutorial-link" onClick={() => goToTutorial("Game Content")}>Game Content</span>, reference Studio Content from <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>Art Recipes</span>.</p>
        
        <p>Note that both Studio and Game Content are available to all compositions. Consider the case where a card has a name in its piece content, references the name of the game from Game Content, and references the name of the studio and designer from Studio Content.</p>
    </>
}