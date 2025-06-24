import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import { TemplativeLabeledImage, LocalLabeledImage } from "../TutorialComponents/LabeledImage";
import CreatingAPrintAndPlay from "./Images/creatingPrintAndPlay.png"
import PrintoutOptions from "./Images/printoutOptions.png"
export default function CreatingaPrintandPlay({goToTutorial, goToExternalLink}) {
    return <>
        <p>Cheaply test your games by printing it out yourself.</p>
        <p><span className="tutorial-link" onClick={() => goToTutorial("Render a Project")}>Render your game</span> and then select the Create Print and Play tab. Choose what size paper to use, whether the backs your compositions are included, and whether you want a border around your final art for easier cutting. Create the pdf by pressing Create Printout.</p>
        <LocalLabeledImage
            src={CreatingAPrintAndPlay}
            alt="Created printout"
            caption="Example print and play output"
        />
        
        <HeadsUp message="Stock components and custom components that would be larger than the printable space of your page are not included in your pdf."/>

        <h2>Printing Equipment</h2>
        <p>Save money on home printing by using the following equipment:</p>
        
        <p><span className="external-link" onClick={() => goToExternalLink("https://www.amazon.com/HP-DeskJet-2755e-Wireless-Printer/dp/B08XYP6BJV")}>HP DeskJet 2755e Printer</span>: This printer <em>can</em> print on cardstock, but it won't look as good as when you print on regular paper. It cannot print front and back automatically.</p>
        <p><span className="external-link" onClick={() => goToExternalLink("https://www.amazon.com/gp/product/B07QQ3L753")}>Cardstock, 199 gsm, 8.5"x11"</span>: While this is not as heavy as actual poker cards, you cannot see through to the back and feels fine in the hands.</p>
        <p><span className="external-link" onClick={() => goToExternalLink("https://www.amazon.com/gp/product/B016LDV41S")}>Paper Guillotine</span>: The best way to cut out your cards.</p>
        <p><span className="external-link" onClick={() => goToExternalLink("https://www.amazon.com/gp/product/B08VHGLBPT")}>Paper Corner Rounder</span>: Cardstock cut with the paper guillotine is sharp, and has cut my fingers before. Consider a card rounder for that official look. It is also useful when attmepting to fit cards into a mint tin.</p>
        <p><span className="external-link" onClick={() => goToExternalLink("https://www.amazon.com/Sheets-Matte-Sticker-Inkjet-Printing/dp/B07T1HRYL5")}>Sticker Paper</span>: Great for putting unique graphics on flat pawns and blank dice.</p>
        
    </>
}