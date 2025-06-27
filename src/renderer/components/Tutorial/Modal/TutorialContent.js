import AddCompositions from "./Tutorials/Add Compositions";
import Art from "./Tutorials/Art";
import ArtRecipes from "./Tutorials/Art Recipes";
import ComponentContent from "./Tutorials/Component Content";
import CreateAPrintAndPlay from "./Tutorials/Create a Print and Play";
import CreateAProject from './Tutorials/Create a Project';
import EditCompositions from "./Tutorials/Edit Compositions";
import ExportToTabletopSimulator from "./Tutorials/Export to Tabletop Simulator";
import GameContent from "./Tutorials/Game Content";
import MakeAPokemonIconFont from './Tutorials/Make a Pokemon Icon Font';
import MakeARulebook from "./Tutorials/Make a Rulebook";
import ManageFonts from "./Tutorials/Manage Fonts";
import ManageContent from "./Tutorials/Manage Content";
import PieceContent from "./Tutorials/Piece Content";
import RenderAProject from "./Tutorials/Render a Project";
import StartAProject from './Tutorials/Start a Project';
import StudioContent from "./Tutorials/Studio Content";
import UploadToTheGameCrafter from "./Tutorials/Upload to TheGameCrafter";
import UseIconFonts from "./Tutorials/Use Icon Fonts";
import FoesFriends from "./Tutorials/TemplateTutorials/Foes & Friends";
import Blokemon from "./Tutorials/TemplateTutorials/Blokemon";

const TutorialElements = {
    "Create a Project": CreateAProject,
    "Start a Project": StartAProject,
    "Edit Compositions": EditCompositions,
    "Add Compositions": AddCompositions,
    "Manage Content": ManageContent,
    "Piece Content": PieceContent,
    "Game Content": GameContent,
    "Component Content": ComponentContent,
    "Studio Content": StudioContent,
    "Art": Art,
    "Art Recipes": ArtRecipes,
    "Make a Rulebook": MakeARulebook,
    "Render a Project": RenderAProject,
    "Create a Print and Play": CreateAPrintAndPlay,
    "Export to Tabletop Simulator": ExportToTabletopSimulator,
    "Upload to TheGameCrafter": UploadToTheGameCrafter,
    "Manage Fonts": ManageFonts,
    "Use Icon Fonts": UseIconFonts,
    "Make a Pokemon Icon Font": MakeAPokemonIconFont,
    "Foes & Friends": FoesFriends,
    "Blokemon": Blokemon,
};

const tutorialGroups = {
    "Welcome": [
        "Start a Project",
    ],
    "Production": [
        "Add Compositions",
        "Edit Compositions",
        "Manage Content",
        "Piece Content",
        "Component Content",
        "Game Content",
        "Studio Content",
        "Art",
        "Art Recipes",
        "Make a Rulebook",
    ],
    
    "Distribution": {
        "Rendering": [
            "Render a Project",
        ],
        "TheGameCrafter": [
            "Upload to TheGameCrafter",
        ],
        "Tabletop Simulator": [
            "Export to Tabletop Simulator",
        ],
        "Printing": [
            "Create a Print and Play",
        ],
    },
    "Fonts": [
        "Manage Fonts",
        "Use Icon Fonts",
        "Make a Pokemon Icon Font",
    ],
    "Templates": [
        "Foes & Friends",
        "Blokemon",
    ],
}

const tutorialAcknowledgements = {
    "Add Compositions": "I will add some compositions",
    "Art Recipes": "I will issue commands to the art renderer",
    "Art": "I will create some svgs",
    "Component Content": "I will add some fields common to all pieces",
    "Create a Print and Play": "I will create a print and play",
    "Create a Project": "I will make a project, and it will be fun",
    "Edit Compositions": "I will edit my compositions",
    "Export to Tabletop Simulator": "I will export to Tabletop Simulator",
    "Game Content": "I will describe my game",
    "Make a Pokemon Icon Font": "I will create my own icon font",
    "Make a Rulebook": "I will write some rules",
    "Manage Content": "I will add some content to my game",
    "Manage Fonts": "I will install some fonts",
    "Piece Content": "I will make a piece and add some fields",
    "Render a Project": "I will create a render of my project",
    "Start a Project": "I will make a project, and it will be fun",
    "Studio Content": "I will describe my studio",
    "Upload to TheGameCrafter": "I will upload to TheGameCrafter",
    "Use Icon Fonts": "I will use some icon fonts",
    "Foes & Friends": "I will make some units",
    "Blokemon": "I will make some trading cards",
};

export { TutorialElements, tutorialAcknowledgements, tutorialGroups };