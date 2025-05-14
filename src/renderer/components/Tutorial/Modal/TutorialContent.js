import EditCompositions from './Tutorials/EditCompositions';
import CreatingAComponent from './Tutorials/CreatingAComponent';
import OneVision from "./Tutorials/OneVision"
import PieceContentTutorial from "./Tutorials/PieceContentTutorial"
import ComponentContentTutorial from "./Tutorials/ComponentContentTutorial"
import UploadingtoTheGameCrafter from './Tutorials/Uploading to the Game Crafter';
import UnderstandingYourTools from './Tutorials/Understanding your Tools';
import Rules from './Tutorials/Rules';
import RenderingYourGame from "./Tutorials/Rendering your Game"
import ExportingToTabletopSimulator from "./Tutorials/Exporting to Tabletop Simulator"
import CreatingYourFirstGame from './Tutorials/Creating your First Game';
import CreatingCompositions from "./Tutorials/Creating Compositions"
import CreatingaPrintandPlay from './Tutorials/Creating a Print and Play';
import Content from "./Tutorials/Content"
import Compositions from "./Tutorials/Compositions"
import Art from "./Tutorials/Art"
import ArtRecipes from "./Tutorials/Art Recipes"

const TutorialElements = {
    "Edit Compositions": EditCompositions,
    "Creating a Component": CreatingAComponent,
    "One Vision": OneVision,
    "Piece Content": PieceContentTutorial,
    "Component Content": ComponentContentTutorial,
    "Uploading to the Game Crafter": UploadingtoTheGameCrafter,
    "Understanding your Tools": UnderstandingYourTools,
    "Rules": Rules,
    "Rendering your Game": RenderingYourGame,
    "Exporting to Tabletop Simulator": ExportingToTabletopSimulator,
    "Creating your First Game": CreatingYourFirstGame,
    "Creating Compositions": CreatingCompositions,
    "Creating a Print and Play": CreatingaPrintandPlay,
    "Content": Content,
    "Compositions": Compositions,
    "Art": Art,
    "Art Recipes": ArtRecipes
}
const tutorialAcknowledgements = {
    "Edit Compositions": "I will edit some compositions.",
    "Creating a Component": "I will create a new component.",
    "One Vision": "قولوا: الله أكبر، ولله الحمد",
    "Piece Content": "I will make a Piece and add some Fields.",
    "Component Content": "I will add some Fields common to all Pieces.",
    "Creating your First Game": "I will make a game, and it will be fun.",
    "Uploading to the Game Crafter": "I will upload my game to The Game Crafter.",
    "Understanding your Tools": "I understand the tools available to me.",
    "Rules": "I will write some rules for my game.",
    "Rendering your Game": "I will create a render of my project.",
    "Exporting to Tabletop Simulator": "I will export my project to Tabletop Simulator.",
    "Creating Compositions": "I will create some compositions.",
    "Creating a Print and Play": "I will create a print and play version of my game.",
    "Content": "I will add some content to my game.",
    "Compositions": "I will create some compositions.",
    "Art": "I will create some svgs.",
    "Art Recipes": "I will create some overlays, style updates, and text replacements."
}

export { TutorialElements, tutorialAcknowledgements };