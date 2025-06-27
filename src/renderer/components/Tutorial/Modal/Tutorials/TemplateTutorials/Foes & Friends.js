import React, { useState, useEffect } from 'react';
import HeadsUp from "../../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../../TutorialComponents/LabeledImage";
import FoesInfantry from "./Images/Foes-Infantry.png"
import Map from "./Images/Map-Map.png"
import UnitFront from "./Images/unitFront.png"
import FriendsAndFoesDiagram from "./Images/friendsAndFoesDiagram.png"
import Unit from "../../../../../../main/templative/lib/create/templates/wargame/art/Unit.svg"
import Infantry from "../../../../../../main/templative/lib/create/templates/wargame/art/Infantry.svg"

export default function FoesFriends({goToTutorial, goToExternalLink}) {
    return <>
        <p>Foes & Friends is a wargame template parodying Holland '44 and Axis & Allies. It is composed of square chits for units, a six-fold map with hexes, and two dice.</p>
        
        <LocalLabeledImage
            src={Map}
            caption="The Hex Map"
        />
        
        
        <p>There are a couple commands that assemble the final art.</p>
        
        <div className="row">
            <div className="col">
                <LocalLabeledImage
                    src={Unit}
                    caption="The Unit Template, Unit.svg"
                />
            </div>
            <div className="col">
                <LocalLabeledImage
                    src={Infantry}
                    caption="The Infantry Overlay, Infantry.svg"
                />
            </div>
        </div>
        <p>It starts with the <code>Unit.svg</code> template that has the <code>name</code>, <code>a</code> (attack), <code>d</code> (defense), and <code>m</code> (movement) value. It overlay's the Piece's graphic field, which in this case is <code>Infantry.svg</code>. It then updates the <code>background</code> element's fill to the Component's color, which for Foes is this red. Finally it updates the <code>name</code>, <code>a</code>, <code>d</code>, and <code>m</code> values to the Piece's name, attack, defense, and movement values.</p>
        <LocalLabeledImage
            src={UnitFront}
            caption="The Unit Template, Unit.svg"
        />
        <LocalLabeledImage
            src={FoesInfantry}
            caption="The final Foes Infantry artwork, Foes-Infantry.png"
        />
        <p>The icons are based on the <span className="external-link" onClick={() => goToExternalLink("https://en.wikipedia.org/wiki/NATO_Joint_Military_Symbology#Symbol_sets")}>NATO Joint Military Symbology</span>.</p>
        
        <p>There is a lot of reuse in these compositions. Both Friends and Foes unit compositions use the same art recipes, but, for replayability's sake, they have unique Pieces content. That way, the Foe airborne might be stronger or weaker than the Friend airborne. </p>
        <LocalLabeledImage
            src={FriendsAndFoesDiagram}
            caption="Friends and Foes Diagram"
        />
    </>
}