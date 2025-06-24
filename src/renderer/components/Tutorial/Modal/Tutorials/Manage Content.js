import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import AddAField from "./Images/addAField.png";
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";

export default function ManageYourContent({goToTutorial}) {
    return <>
        <p>Use Content to tell <span className="tutorial-link" onClick={()=>goToTutorial("Art Recipes")}>art recipes</span> what to put in your <span className="tutorial-link" onClick={()=>goToTutorial("Art")}>art</span> to create <span className="tutorial-link" onClick={()=>goToTutorial("Render a Project")}>final renders</span>.</p>
        
        <p>For instance, one of your cards might be named <code>Orc Warrior</code>, in the deck named <code>Red Team</code>, in the game named <code>Orcs vs Humans</code>, by the studio named <code>Orc Stans Ltd</code>. Saying "use the name" isn't specific enough.</p>
        
        
        
        <TemplativeLabeledImage
            src="/exampleCard.png"
            alt="An example card"
            caption="Example card showing different layers of content"
        />
        <p>Decide where in the four concentric layers of content to put your information: <code>piece</code>, <code>component</code>, <code>game</code>, or <code>studio</code>.</p>
        
        <p>Disambiguate where the <code>name</code> is from by saying the <code>Studio's name</code> or the <code>Piece's name</code>. Note that a particular piece—like a singular card or die—has access to all the data from its component, game, and studio it is a part of. Notice when you're writing the same thing over and over, it's a good sign to put it in the component or game content.</p>
        <TemplativeLabeledImage
            src="/content.png"
            alt="Concentric content"
            caption="A project is made by a studio which has a game which has components which have pieces"
        />
        <p>Rather than writing <code>red</code> in each piece's content dozens of times, define <code>factionColor</code> in the component content. Keep content that is common to all components in the game or studio content.</p>
        
        <h2>Editing Content</h2>
        <p>Add fields to your content by pressing the Add a Field button. The left side of the row is the name of the field, and the right side is the value of the field. Press the trash can on a row to delete it, but the name field cannot be deleted.</p>
        <LocalLabeledImage
            src={AddAField}
            caption="Add a field to your content"
        />
        <p>The studio and game content files are accessible from the Project tab.</p>
        
        <h2>An Example of Using Content</h2>
        <p>This Victory Points art recipes file replaces every instance of the word <code>{"{value}"}</code> found in the art file with the <code>Piece's value</code>.</p>
        <TemplativeLabeledImage
            src="/pipedContent.png"
            alt="Example art data piping a piece's value"
            caption="Content piping configuration example"
        />
        <p>In my case, I had three Victory Point chits with values of 1, 5, 10 respectively.</p>
        <TemplativeLabeledImage
            src="/victoryPointsContent.png"
            alt="The Victory Points piece's content"
            caption="Victory Points content configuration"
        />
        <p>Resulting in...</p>
        <TemplativeLabeledImage
            src="/victoryPointsOutput.png"
            alt="Our victory point output"
            caption="Final rendered Victory Points"
        />
        <RelatedTutorials tutorialNames={["Piece Content", "Component Content", "Game Content", "Studio Content"]} goToTutorial={goToTutorial}/>
    </>
}