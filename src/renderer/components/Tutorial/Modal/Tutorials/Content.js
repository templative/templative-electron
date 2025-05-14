import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function Content({goToTutorial}) {
    return <>
        <p>Use Content to tell Templative what to put in the <a href={`/docs/art`}>Art</a> when commanded by the <a href={`/docs/art-recipes`}>Art Recipes</a> files.</p>
        <p>Every singular piece of your board game is made up of concentric layers of content.</p>
        <p>For instance, one of your cards might be called "Orc Warrior", but it might get it's red faction color from the "Orcs" deck it is a part of, while the "Orcs vs Humans" game title and the "Orc Stans Ltd" studio name in the bottom right would be from the game and studio content files respectively.</p>
        <LabeledImage
            src="/exampleCard.png"
            alt="An example card"
            caption="Example card showing different layers of content"
        />
        <p>A piece inherits all the data from its component, game, and studio it is a child of.</p>
        <LabeledImage
            src="/content.png"
            alt="Concentric content"
            caption="How content inheritance works"
        />
        <p>When defining content for my game, rather than writing "red factionColor" in each piece's content, we instead define factionColor in the component content. Similarly, content that is common among all components goes in the game or studio content.</p>
        <p>Consider the editing process and example at the bottom.</p>
        
        <h2>Editing Content</h2>
        <p>Add and update fields in each of the Content files to make them available to the Art Recipes commands to update Art with.</p>
        <p>The studio and content files are accessible from the Edit components screen. The game and studio tabs are always available at the top.</p>
        <HeadsUp message="Be careful of deleting default fields in the content files, they may be used by Templative."/>
        <p>Studio Content:</p>
        <LabeledImage
            src="/studioContent.png"
            alt="The studio's content"
            caption="Studio-level content configuration"
        />
        <p>Game Content:</p>
        <LabeledImage
            src="/gameContent.png"
            alt="The game's content"
            caption="Game-level content configuration"
        />
        <p>Each component you create gets it's own component content file in the Component Content directory.</p>
        <LabeledImage
            src="/componentContent.png"
            alt="The component's content"
            caption="Component-level content configuration"
        />
        <p>Each component you create gets it's own piece content file in the Piece Content directory. This file contains the data of multiple pieces.</p>
        <LabeledImage
            src="/pieceContent.png"
            alt="The piece's content"
            caption="Piece-level content configuration"
        />
        <p>When editing a specific piece, give it a name, for filenames, a displayName, for when a pretty name of the piece is given, a quantity, and any number of fields.</p>
        <LabeledImage
            src="/onePiece.png"
            alt="An example piece content"
            caption="Individual piece content editor"
        />
        <p>Delete a piece with the trash can. Duplicate it with the overlapping pages icon. Add a field to all peices in the file with the + button at the bottom of a piece. Delete a field from all pieces by clicking the trash can on the line of that field. Add a new piece by clicking `Create a New Piece` at the top.</p>
        <p>Lock a field so that you only see that one field for all pieces using the lock icon.</p>
        <LabeledImage
            src="/lockedField.png"
            alt="All fields are locked"
            caption="Field locking interface for focused editing"
        />
        <p>This is useful for when your pieces get large and unwieldy.</p>
        
        <h2>An Example of Using Content</h2>
        <p>This Victory Points art recipes file replaces every instead of {"{value}"} found in the art file with the Piece's value.</p>
        <LabeledImage
            src="/pipedContent.png"
            alt="Example art data piping a piece's value"
            caption="Content piping configuration example"
        />
        <p>In my case, I had three Victory Point chits with values of 1, 5, 10 respectively.</p>
        <LabeledImage
            src="/victoryPointsContent.png"
            alt="The Victory Points piece's content"
            caption="Victory Points content configuration"
        />
        <p>Resulting in...</p>
        <LabeledImage
            src="/victoryPointsOutput.png"
            alt="Our victory point output"
            caption="Final rendered Victory Points"
        />
        
        </>
}