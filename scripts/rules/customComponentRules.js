const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
};
module.exports = [
    // {
    //     description: "Component DisplayNames should have added spaces",
    //     condition: (component) => component.DisplayName,
    //     setValue: (component) => {
    //         component.Key = component.DisplayName
    //         component.DisplayName = addSpaces(component.DisplayName);
    //         return ["DisplayName"];
    //     }
    // },
    // {
    //     description: "Set the PreviewUri to `https://www.thegamecrafter.com/product-images/${component.Key}.jpg`",
    //     condition: (component) => component.Key && component.PreviewUri !== `https://www.thegamecrafter.com/product-images/${component.Key}.jpg`,
    //     setValue: (component) => {
    //         component.PreviewUri = `https://www.thegamecrafter.com/product-images/${component.Key}.jpg`;
    //         return ["PreviewUri"];
    //     }
    // },
    {
      description: "Set PlaygroundCreationTask, GameCrafterUploadTask, and SimulatorCreationTask for components tagged with 'deck'",
      condition: (component) => component.Tags && component.Tags.includes("deck") && 
        (component.PlaygroundCreationTask !== "DECK" || 
         component.GameCrafterUploadTask !== "deck" || 
         component.SimulatorCreationTask !== "DECK"),
      setValue: (component) => {
        component.PlaygroundCreationTask = "DECK";
        component.GameCrafterUploadTask = "deck";
        component.SimulatorCreationTask = "DECK";
        return ["PlaygroundCreationTask", "GameCrafterUploadTask", "SimulatorCreationTask"];
      }
    },
    {
        description: "Set isDisabled to false for all components",
        condition: (component) => component.IsDisabled !== false,
        setValue: (component) => {
          component.IsDisabled = false;
          return ["IsDisabled"];
        }
    },
    {
        description: "Set IsPrintingDisabled to false for all components",
        condition: (component) => component.IsPrintingDisabled !== false,
        setValue: (component) => {
          component.IsPrintingDisabled = false;
          return ["IsPrintingDisabled"];
        }
    },
    {
        description: "Disable components with GameCrafterUploadTask customcuttwosidedslugged",
        condition: (component) => component.GameCrafterUploadTask === "customcuttwosidedslugged" && 
          (component.IsDisabled !== true || 
           component.PlaygroundCreationTask !== "none" || 
           component.SimulatorCreationTask !== "none"),
        setValue: (component) => {
            component.IsDisabled = true;
            component.PlaygroundCreationTask = "none";
            component.SimulatorCreationTask = "none";
            return ["IsDisabled", "PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    {
        description: "Components tagged 'box' don't have SimulatorCreationTask or PlaygroundCreationTask",
        condition: (component) => component.Tags && component.Tags.includes("box"),
        setValue: (component) => {
            component.SimulatorCreationTask = "none";
            component.PlaygroundCreationTask = "none";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'book' have IsPrintingDisabled set to true",
        condition: (component) => component.Tags && component.Tags.includes("book"),
        setValue: (component) => {
            component.IsPrintingDisabled = true;
            return ["IsPrintingDisabled"];
        }
    },
    {
        description: "Components without PlaygroundCreationTask or SimulatorCreationTask are assigned none",
        condition: (component) => !component.PlaygroundCreationTask || !component.SimulatorCreationTask,
        setValue: (component) => {
            component.PlaygroundCreationTask = "none";
            component.SimulatorCreationTask = "none";
            return ["PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    {
        description: "Components tagged 'board' or 'mat' have Simulator/Playground CreationTask set to 'BOARD'",
        condition: (component) => component.Tags && (component.Tags.includes("board") || component.Tags.includes("mat")),
        setValue: (component) => {
            component.SimulatorCreationTask = "BOARD";
            component.PlaygroundCreationTask = "BOARD";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    //   {
    //       description: "Components tagged 'tin' or 'hookbox' but not 'accordion' and not 'folio' and not  that aren't tagged 'packaging' are tagged 'packaging'",
    //       condition: (component) => component.Tags && (component.Tags.includes("tin") || component.Tags.includes("hookbox")) && !component.Tags.includes("packaging") && !component.Tags.includes("accordion") && !component.Tags.includes("folio"),
    //       setValue: (component) => {
    //           component.Tags = [...component.Tags, "packaging"];
    //           return ["Tags"];
    //       }
    //   },
    {
        description: "Components tagged 'standee' that aren't tagged 'token' are tagged 'token'",
        condition: (component) => component.Tags && (component.Tags.includes("standee")) && !component.Tags.includes("token"),
        setValue: (component) => {
            component.Tags = [...component.Tags, "token"];
            return ["Tags"];
        }
    },
    {
        description: "Components tagged packaging have Simulator/PlaygroundCreationTask set to none",
        condition: (component) => component.Tags && component.Tags.includes("packaging"),
        setValue: (component) => {
            component.SimulatorCreationTask = "none";
            component.PlaygroundCreationTask = "none";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Anything tagged 'deck' or 'board' gets the Playground/SimulatorCreationTask set to 'DECK'",
        condition: (component) => component.Tags && (component.Tags.includes("deck") || component.Tags.includes("board")),
        setValue: (component) => {
            component.PlaygroundCreationTask = "DECK";
            component.SimulatorCreationTask = "DECK";
            return ["PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    {
        description: "Disable components that whose DisplayName contains 'Acrylic'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Acrylic"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    },
    {
        description: "Components whose DisplayName contains 'Sticker' are tagged 'stickers'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Sticker") && !component.Tags.includes("stickers"),
        setValue: (component) => {
            component.Tags = [...component.Tags, "stickers"];
            return ["Tags"];
        }
    },
    {
        description: "Components whose DisplayName contains 'Book' are tagged 'document'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Book") && !component.Tags.includes("document"),
        setValue: (component) => {
            component.Tags = [...component.Tags, "document"];
            return ["Tags"];
        }
    },
    {
        description: "Components tagged meeple get the Playground/SimulatorCreationTask set to 'Meeple'",
        condition: (component) => component.Tags && component.Tags.includes("meeple"),
        setValue: (component) => {
            component.PlaygroundCreationTask = "Meeple";
            component.SimulatorCreationTask = "Meeple";
            return ["PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    {
        description: "Components tagged 'packaging' get the Playground/SimulatorCreationTask set to 'none'",
        condition: (component) => component.Tags && component.Tags.includes("packaging"),
        setValue: (component) => {
            component.PlaygroundCreationTask = "none";
            component.SimulatorCreationTask = "none";
            return ["PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    {
        // Cut components require another svg for customization, which templative doesn't support
        description: "Components tagged 'cut' are disabled",
        condition: (component) => component.Tags && component.Tags.includes("cut"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    },
    {
        description: "Components tagged 'token' or 'document' or 'mat' get the SimulatorCreationTask set to 'DECK'",
        condition: (component) => component.Tags && (component.Tags.includes("token") || component.Tags.includes("document") || component.Tags.includes("mat")),
        setValue: (component) => {
            component.SimulatorCreationTask = "DECK";
            return ["SimulatorCreationTask"];
        }
    },
    {
        description: "Components tagged 'document' and 'book' are disabled",
        condition: (component) => component.Tags && (component.Tags.includes("document") && component.Tags.includes("book")),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    }
  ];