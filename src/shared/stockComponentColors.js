const colors = ["red", "blue", "green", "yellow", "mustard", "purple", "orange", "pink", "brown", "gray", "black", "white", "apricot", "teal", "caramel", "ivory", "wood", "limegreen", 'lavender'];
const metals = ["gold", "silver", "bronze", "copper"]
const shades = ["light", "dark"];
const allColorVariations = [
  ...colors,
  ...metals,
  ...shades.flatMap(shade => colors.map(color => `${shade}${color}`)),
  ...shades.flatMap(shade => metals.map(metal => `${shade}${metal}`))
];
module.exports = {
    colors,
    metals,
    shades,
    allColorVariations
}