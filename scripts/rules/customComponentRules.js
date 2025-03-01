module.exports = [
    {
      description: "Set PlaygroundCreationTask, GameCrafterUploadTask, and SimulatorCreationTask for components tagged with 'deck'",
      condition: (component) => component.Tags && component.Tags.includes("deck"),
      setValue: (component) => {
        component.PlaygroundCreationTask = "DECK";
        component.GameCrafterUploadTask = "deck";
        component.SimulatorCreationTask = "DECK";
        return ["PlaygroundCreationTask", "GameCrafterUploadTask", "SimulatorCreationTask"];
      }
      },
      {
          description: "Set isDisabled to false for all components",
          condition: () => true,
          setValue: (component) => {
          component.IsDisabled = false;
          return ["IsDisabled"];
          }
      },
      {
          description: "Set IsPrintingDisabled to false for all components",
          condition: () => true,
          setValue: (component) => {
          component.IsPrintingDisabled = false;
          return ["IsPrintingDisabled"];
          }
      },
      {
          description: "Disable components with GameCrafterUploadTask customcuttwosidedslugged",
          condition: (component) => component.GameCrafterUploadTask === "customcuttwosidedslugged",
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
      {
          description: "Components tagged 'tin' or 'hookbox' that aren't tagged 'packaging' are tagged 'packaging'",
          condition: (component) => component.Tags && (component.Tags.includes("tin") || component.Tags.includes("hookbox")) && !component.Tags.includes("packaging"),
          setValue: (component) => {
              component.Tags = [...component.Tags, "packaging"];
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
      }
  ];