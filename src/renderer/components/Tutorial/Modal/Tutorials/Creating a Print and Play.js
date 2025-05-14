import React, { useState, useEffect } from 'react';
import HeadsUp from "../TutorialComponents/HeadsUp";
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function CreatingaPrintandPlay({goToTutorial}) {
    return <>
        <p>Print and play pdfs are a great to cheaply test <span className="tutorial-link" onClick={() => goToTutorial("Rendering your Game")}>renders of your game</span>.</p>
        <p>To create a printable pdf, go to the print screen, select an outputed folder of your game and select Create Printout.</p>
        <LabeledImage
            src="/printoutOptions.png"
            alt="Printout options"
            caption="Available print and play options"
        />
        <p>Typically you will be printing on Letter sized paper, but you can also select Tabloid sized. Decide whether or not you want to include the backs of components.</p>
        <LabeledImage
            src="/printout.png"
            alt="Created printout"
            caption="Example print and play output"
        />
        
        <HeadsUp message="Stock components and custom components that would be larger than the printable space of your page are not included in your pdf."/>

        <h2>Printing Equipment</h2>
        <p>Home printing can be expensive, but there are affordable options that I believe suffice. Instead of investing in a official printing operation, consider:</p>
        
        <p><a href="https://www.amazon.com/gp/product/B08XYP6BJ">HP DeskJet 2755e Printer</a>. This printer <em>can</em> print on cardstock, but it won't look as good as when you print on regular paper. While it cannot print front and back automatically, Templative marks all printable pdfs with a line in the corner to make it easier to feed back it back in for printing on the back.</p>
        <p><a href="https://www.amazon.com/gp/product/B07QQ3L753">Cardstock, 199 gsm, 8.5"x11"</a>. While this is not as heavy as actual poker cards, you cannot see through to the back and feels fine in the hands.</p>
        <p><a href="https://www.amazon.com/gp/product/B016LDV41S">Paper Guillotine</a>. The best way to cut out your cards.</p>
        <p><a href="https://www.amazon.com/gp/product/B08VHGLBPT">Paper Corner Rounder</a>. Cardstock cut with the paper guillotine is sharp, and has cut my fingers before. Consider a card rounder for that official look. It is also useful when attmepting to fit cards into a mint tin.</p>
        <p><a href="https://www.amazon.com/Sheets-Matte-Sticker-Inkjet-Printing/dp/B07T1HRYL5">Sticker Paper</a>. Great for putting unique graphics on flat pawns and blank dice.</p>
        
    </>
}