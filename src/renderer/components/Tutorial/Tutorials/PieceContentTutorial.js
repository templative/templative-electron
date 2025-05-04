import React from 'react';
import PieceContentExample from "./pieceContent.png"

const PieceContentTutorial = ({ goToTutorial }) => {
    return (
        <>
            <p><strong>Piece Content</strong> is the information unique to a single part of a Composition, like a single card or die. For example, a Piece might have Fields like a name, a description, and a reference to an image file unique to it. If all Pieces in a Compositon have the same data, consider using <span className="tutorial-link" onClick={() => goToTutorial("Component Content")}>Component level Content</span> instead.</p>
            
            <p>Each block here is a <em>Piece</em>, and each row of a Piece is a <em>Field</em>.</p>
            <img src={PieceContentExample}/>
            <p>Piece Content files can be used by multiple Compositions.</p>
            <p>Piece Content can be imported from a csv or sync'd from Google Sheet urls. When importing, Templative will take the columns as Fields and the rows as Pieces.</p>

        </>
    );
};

export default PieceContentTutorial;
