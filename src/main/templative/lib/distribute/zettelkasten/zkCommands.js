
const fs = require('fs');
const path = require('path');

function convertFilesToCsv() {
  const files = fs.readdirSync('.').filter(f => fs.statSync(path.join('.', f)).isFile());
  let csvContents = "name,quantity,contents\n";

  for (const file of files) {
    const permaNoteFile = fs.readFileSync(file, 'utf8');
    const [folgezettel, ...rest] = file.split('.');
    const name = `"${file.slice(folgezettel.length + 1, -rest[0].length - 1)}"`;
    
    let spanId = 0;
    const startingY = 406.058;
    const lineHeight = 33.33337;

    let contents = permaNoteFile;
    contents = contents.replace(/['']/g, '`');
    contents = contents.replace(/"/g, '`');
    contents = contents.replace(/–/g, '-');

    const lines = contents.split('\n');
    let formattedContent = "";
    for (const line of lines) {
      const newTspan = `<tspan x='-76.34375px' y='${startingY + (lineHeight * spanId)}' id='span${spanId}'>${line}NEWLINE</tspan>`;
      spanId++;
      formattedContent += newTspan;
    }

    csvContents += `${folgezettel},${name},1,"${formattedContent}"\n`;
  }

  fs.writeFileSync('../zettelkasten.csv', csvContents);
  console.log("Written to ../zettelkasten.csv");
}