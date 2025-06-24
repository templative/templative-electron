import React from 'react';
import PieceContentExample from "./Images/pieceContent.png"
import RelatedTutorials from "../TutorialComponents/RelatedTutorials";
import ImportModal from "./Images/importModal.png";
import ImportData from "./Images/importData.png";
import { LocalLabeledImage } from '../TutorialComponents/LabeledImage';

const PieceContentTutorial = ({ goToTutorial }) => {
    return (
        <>
            <p><strong>Piece Content</strong> is the information unique to a single part of a Composition, like a single card or die. For example, a Piece might have Fields like a name, a description, and a reference to an image file unique to it. If all Pieces in a Compositon have the same data, consider using <span className="tutorial-link" onClick={() => goToTutorial("Component Content")}>Component level Content</span> instead.</p>
            
            <p>Each block here is a <em>Piece</em>, and each row of a Piece is a <em>Field</em>.</p>
            <img src={PieceContentExample}/>
            <p>Piece Content files can be used by multiple Compositions.</p>
            
            <h3>Import your Google Sheet or CSV</h3>
            <p>Import your csv or sync with Google Sheet using the Import Data button.</p>
            <LocalLabeledImage src={ImportData} caption="Edit a composition and select Import Data" />
            
            <p>Use rows to create pieces, and columns to create fields. Use the first row as the header row. Include a <code>name</code> and <code>quantity</code> field to name your pieces and set the quantity of each piece. Make your Google Sheet public or Templative will not be able to access it.</p>
            
            <LocalLabeledImage src={ImportModal} caption="Drag a csv in or paste a Google Sheet url" />
            
            <h3>Quantity</h3>
            <p>Change the number of each piece included in exports by updating the quantity field of each piece. If your pieces are missing a quantity field, add it. Set the quantity to 0 to exclude it from exports.</p>
            
            <h3>Dice</h3>
            <p>When content is used for custom dice, each "piece" is a die face, and each "field" is a die face's value. The quantity field of die face is ignored. The number of pieces for a die must match the quantity of the faces in the die. A d4 composition cannot have 5 pieces.</p>

            <RelatedTutorials tutorialNames={["Manage Content", "Component Content", "Game Content", "Studio Content"]} goToTutorial={goToTutorial}/>
        </>
    );
};

export default PieceContentTutorial;
