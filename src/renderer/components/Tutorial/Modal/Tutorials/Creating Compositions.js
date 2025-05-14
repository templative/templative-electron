import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function CreatingComponents({goToTutorial}) {
    return <>
        <p>Create components to add products like deck and dice to your game. All components that can be purchased from TheGameCrafter can be managed by Templative.</p>
        <HeadsUp message="Templative is not designed to assist with custom minis."/>
        <p>To create a new component, go to the Create Components screen. From there we are presented with many, many options for the type of component we want to create.</p>
        <p>First we must choose if we want to create a custom component, like a new poker deck, or if we want add stock components, like standard dice, to our game using the toggle.</p>
        <LabeledImage
            src="/stockToggle.png"
            alt="The stock vs custom component type toggle"
            caption="Choosing between stock and custom components"
        />
        <p>Then we filter our component type options by tags. To find packaging for our mostly poker deck game we might select `box` then `poker`. You may be suprised to find the kinds of board game components you can make. Now that we've filtered to poker boxes, we can see our new options.</p>
        <LabeledImage
            src="/pokerBoxOptions.png"
            alt="Selecting the box and poker tags to find good poker boxes."
            caption="Choosing between stock and custom components"
        />
        <p>Select a component type, give it a name, and press create. This creates the files for our component, and clears our selection so that we might add more components.</p>
        <LabeledImage
            src="/completeComponent.png"
            alt="Our completed component."
            caption="Our completed component."
        />
        <p>Now we can proceed to editing our new component in the Edit Component screen, read on in the <a href={`/docs/art`}>Art</a> article.</p>

        </>
}