import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import CreatingCompositionsImage from "./Images/createCompositions.png"
import RedPls from "./Images/redPls.png"
import chosenComponent from "./Images/chosenComponent.png"
import chosenDie from "./Images/chosenDie.png"
export default function CreatingCompositions({goToTutorial}) {
    return <>
        <p>Add compositions, like custom and stock decks and dice, to your project using the Add tab.</p>

        <p>Choose if you want to create a custom composition, like a new poker deck, or if you want add stock compositions, like standard dice, by selecting the Custom and Stock tabs.</p>
        <LocalLabeledImage
            src={CreatingCompositionsImage}
            caption="Choosing between stock and custom components"
        />
        <p>Use the search bar to find specific types of compositions.</p>
        <LocalLabeledImage
            src={RedPls}
            caption="Just the red stock components please"
        />
        <p>Select a composition type. Note that some composition types have multiple options, such as boxes coming in multiple sizes.</p>
        <LocalLabeledImage
            src={chosenComponent}
            caption="Stout boxes come in multiple sizes"
        />
        <LocalLabeledImage
            src={chosenDie}
            caption="Dice come in multiple sizes and colors"
        />
        <p>Give your composition a name and press create to add it to your project. You can now edit your composition in the <span className="tutorial-link" onClick={() => goToTutorial("Edit Compositions")}>Edit Compositions</span> screen.</p>
        </>
}