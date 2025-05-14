import React, { useState, useEffect } from 'react';
import LabeledImage from "../TutorialComponents/LabeledImage";

export default function Art({goToTutorial}) {
    return <>
        <p>Create art files so that your <span className="tutorial-link" onClick={() => goToTutorial("Art Recipes")}>Art Recipes</span> and modify it using your <span className="tutorial-link" onClick={() => goToTutorial("Content")}>Content files</span>.</p>
        
        <p>Templative places it's art files in the `/art/templates` and `/art/graphicalInserts` directories by default. The templates folder is used to as the starter art files for compositions, and the graphicalInserts directory is for files that will be overlaid on top of template art files.</p>
        <p>Templative expects all art files it interacts with to be SVGs. Raster art can be included in the seperate svg.</p>

        <h2>Art File Sizing</h2>
        <p>Svg files must be sized pixel for pixel with the pixel sizing that TheGameCrafter expects. In most cases this is handled for you by Templative, but in the cases where you create art files yourself, the viewbox of your svgs and size of your art files must match the <em>pixel</em> dimensions TheGameCrafter asks for. For poker cards that 825x1125px.</p>
        <LabeledImage
            src="/sizing.png"
            alt="Art Recipes operation examples"
            caption="Art files must match TheGameCrafter's pixel dimensions"
        />
        
        <h2>DPI</h2>
        <p>Templative handles the resizing and output of our svgs into raster art for printing while maintaining the 300 DPI expected for print jobs. We set the sizing of our svgs to standardize the ways art files interact.</p>
        
        <h2>CMYK vs RGB</h2>
        <p>Templative outputs art files as pngs, which do not support CYMK color profiles, instead using the RGB color space. Inkscape does not support support CYMK.</p>
        <p>In practice this means that some colors can look slightly off when printed.</p>
        
        <h3>Maintaining CYMK Color Profiles for Final Printing</h3>
        <p>Templative outputs both a final png <em>and a final svg</em>. If you are concerned about the color safety of your output, pull your final svgs into Illustrator and export using its CMYK color profile.</p>
        </>
}