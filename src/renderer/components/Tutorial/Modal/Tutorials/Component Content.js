import React from 'react';
const ComponentContentTutorial = ({ goToTutorial }) => {
    return (
        <>
            <p><strong>Component Content</strong> is the information common to all Pieces that are a part of a Composition. For example, all the Pieces share the teamName <code>Red Team</code>. If Pieces have unqiue content, consider using <span className="tutorial-link" onClick={() => goToTutorial("Piece Content")}>Piece level Content</span> instead.</p>
        </>
    );
};

export default ComponentContentTutorial;
