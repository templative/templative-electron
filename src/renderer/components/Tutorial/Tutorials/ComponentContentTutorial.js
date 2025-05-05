import React from 'react';
import PieceContentExample from "./pieceContent.png"

const ComponentContentTutorial = ({ goToTutorial }) => {
    return (
        <>
            <p><strong>Component Content</strong> is the information common to all Pieces that are a part of a Composition. For example, all the Pieces share the teamName "Red Team". If Pieces have unqiue content, consider using <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>Piece level Content</span> instead.</p>
            
            <p>Each row of a Piece is a <em>Field</em>.</p>
        </>
    );
};

export default ComponentContentTutorial;
