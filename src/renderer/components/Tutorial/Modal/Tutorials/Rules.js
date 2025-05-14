import React, { useState, useEffect } from 'react';
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function Rules({goToTutorial}) {
    return <>
        <p>Edit your rules within Templative to make sure each render of your game comes with an up to date pdf of the game rules. Every render of your game includes the rules as they looked at the time of rendering.</p>
        <p>The rules tabs is always accessible at the top of the Edit Components screen.</p>
        <LabeledImage
            src="/rules.png"
            alt="Example rules file"
            caption="The rules editor interface"
        />
        <p>Rules files are written in <a href="https://www.markdownguide.org/">Markdown</a>, a method of writing documentation.</p>
        </>
}