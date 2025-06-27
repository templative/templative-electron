import React, { useState, useEffect } from 'react';
import HeadsUp from "../../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../../TutorialComponents/LabeledImage";
import BokemonBack from "./Images/Bokemon-Back.png"
import BokemonBloke from "./Images/Bokemon-Bloke.png"
import BokemonBooster from "./Images/Booster-Booster.png"
import BokemonBoosterBox from "./Images/Booster Box-Booster Box.png"
import Bloke from "../../../../../../main/templative/lib/create/templates/ccg/art/Bloke.svg"
import BokemonFront from "../../../../../../main/templative/lib/create/templates/ccg/art/BokemonFront.svg"
export default function Blokemon({goToTutorial}) {
    return <>
        <p>Blokemon is a collectible card game parodying Pokemon and Magic: The Gathering. It is composed of a deck of poker cards, a booster pack, and a booster pack box.</p>
        
        <div className="row">
            <div className="col">
                <LocalLabeledImage src={BokemonBloke} caption="The front of the Blokemon card" />
                <LocalLabeledImage src={BokemonBooster} caption="The Blokemon Booster Pack" />
            </div>
            <div className="col">
                <LocalLabeledImage src={BokemonBack} caption="The back of the Blokemon card" />
                <LocalLabeledImage src={BokemonBoosterBox} caption="The Blokemon Booster Box" />
            </div>
        </div>
        <p>The back of the cards, the booster pack, and the booster box are all relatively simple. Their art recipe points at a static piece of art.</p>
        
        <p>The front of the collectible card is more complicated. It starts with <code>Blank.svg</code> and then overlay's the Piece's graphic field <code>Bloke</code>. Then it overlays the <code>BokemonOverlay</code>. Finally it updates the <code>name, type, types, rules, attack, and defense</code> values using the Piece's content.</p>
        <div className="row">
            <div className="col">
                <LocalLabeledImage src={Bloke} caption="Bloke" />
            </div>
            <div className="col">
                <LocalLabeledImage src={BokemonFront} caption="BokemonFront" />
            </div>
        </div>
        
        <h3>Installing the Icon Font</h3>
        
        <p>The type of the card in the top right uses the <code>BokemonTypes</code> icon font. Install the font to your operating system in the <span className="tutorial-link" onClick={() => goToTutorial("Use Icon Fonts")}>Icon Fonts</span> tab.</p>

        </>
}