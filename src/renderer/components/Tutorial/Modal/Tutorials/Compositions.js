import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function ComponentCompose({goToTutorial}) {
    return <>
        <p>Use the Compositions file to tell Templative how to assemble your game using <a href={`/docs/art-recipes`}>Art Recipes</a> and <a href={`/docs/content`}>Content</a> files.</p> 

        <h2>Understanding File References</h2>
        <p>Each component has a name, type, quantity, art recipes, and content. Take a look a this example Mint Tin Deck named countries.</p>
        <LabeledImage
            src="/componentComposeExample.png"
            alt="An example component called countries"
            caption="Example component composition"
        />
        <p>This blurb shows us what files are used to create country mint tin cards. Namely:</p>
        <ul>
            <li>A <strong>component-level content file</strong> named countries.json in the gamedata/componentGamedata folder. This will contain any data common to all countries.</li>
            <li>A <strong>piece-level content file</strong> named countries.json in the gamedata/piecesGamedata folder. This will contain data that is unique to each card.</li>
            <li>A <strong>front art recipes file</strong> named countriesFront.json in the /artdata folder that tells us how the <em>front</em> art file of countries is assembled</li>
            <li>An <strong>back art recipes file</strong> named countriesBack.json in the /artdata folder that tells us how the <em>back</em> art file of countries is assembled</li>
        </ul>
        <p>If the file you name exists, then a clickable arrow button appears that will open that file in Templative.</p>
        <p>If you want to refer to a file in a folder, for instance to point to an older version of your content, you might write `oldContent files/countries`.</p>
        <HeadsUp message="Do not include extensions like .json in your file references."/>
        <p>If you want to change which file a component looks at, clicking on an input will give you suggestions:</p>
        <LabeledImage
            src="/fileOptions.png"
            alt="Suggested file names"
            caption="File suggestions when editing compositions"
        />
        <h2>Modifying Compositions</h2>
        <p>New compositions can be created using the <a href={`/docs/creating-compositions`}>Create Compositions tab</a>.</p>
        <p>You can increase the quantity of a given deck by incrementing the quantity field of the component.</p>
        <p>You can delete a component by clicking the trash can icon when you hover over a component. This does <strong>not</strong> delete the files the component refers to, it deletes the component and the files remain.</p>
        <p>You can duplicate a component by pressing the overlapping pages icon when you hover over a component. This does <strong>not</strong> duplicate the files the component refers to, it creats a new component that relies on those files.</p>

        </>
}