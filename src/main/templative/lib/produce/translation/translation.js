const path = require('path');
const fs = require('fs');
const csv = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const md5 = require('md5');

// const { Translator } = require('googletrans');
// const translator = new Translator();

function translateText(text, destinationLanguageCode) {
  // const response = await translator.translate(text, 'en', destinationLanguageCode);
  return text; // response.text;
}

async function getTranslation(gameRootDirectory, text, destinationLanguageCode) {
  if (!hasExistingLanguageTranslationCache(gameRootDirectory, destinationLanguageCode)) {
    await createLangaugeTranslationCache(gameRootDirectory, destinationLanguageCode);
  }

  const translationDictionary = await loadTranslationDictionary(gameRootDirectory, destinationLanguageCode);
  if (!translationDictionary.hasOwnProperty(text)) {
    const translation = await translateText(text, destinationLanguageCode);
    if (translation === null) {
      return null;
    }
    translationDictionary[text] = translation;
    await writeTranslationDictionary(gameRootDirectory, destinationLanguageCode, translationDictionary);
  }
  return translationDictionary[text];
}

async function loadTranslationDictionary(gameRootDirectory, destinationLanguageCode) {
  const translationCacheFilepath = path.join(gameRootDirectory, "translations", destinationLanguageCode, `${destinationLanguageCode}.csv`);
  
  var translationCacheFileContent;
  try {
    translationCacheFileContent = await fs.promises.readFile(translationCacheFilepath, 'utf-8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    await createLangaugeTranslationCache(gameRootDirectory, destinationLanguageCode);
    translationCacheFileContent = await fs.promises.readFile(translationCacheFilepath, 'utf-8');
  }
  const data = csv.parse(translationCacheFileContent, { columns: true });
  const translationDictionary = {};
  for (const item of data) {
    translationDictionary[item.english] = item.translation;
  }
  return translationDictionary;
}

async function writeTranslationDictionary(gameRootDirectory, destinationLanguageCode, translationDictionary) {
  const translationCacheFilepath = path.join(gameRootDirectory, "translations", destinationLanguageCode, `${destinationLanguageCode}.csv`);
  const translationCacheFileContent = stringify(Object.entries(translationDictionary).map(([english, translation]) => ({ english, translation })), { header: true });
  await fs.promises.writeFile(translationCacheFilepath, translationCacheFileContent, 'utf-8');
}

async function createTranslationFolder(gameRootDirectory) {
  const translationDirectoryPath = path.join(gameRootDirectory, "translations");
  try {
    await fs.promises.mkdir(translationDirectoryPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}
async function createLanguageTranslationCacheFolder(gameRootDirectory, destinationLanguageCode) {
  try {
    await fs.promises.mkdir(path.join(gameRootDirectory, "translations", destinationLanguageCode), { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

async function createLangaugeTranslationCache(gameRootDirectory, destinationLanguageCode) {
  
  await createTranslationFolder(gameRootDirectory);
  await createLanguageTranslationCacheFolder(gameRootDirectory, destinationLanguageCode);
  const translationCacheFilepath = path.join(gameRootDirectory, "translations", destinationLanguageCode, `${destinationLanguageCode}.csv`);
  await fs.promises.writeFile(translationCacheFilepath, "english,translation\n", 'utf-8');
}

module.exports = {
  getTranslation,
  getTranslation,
  hasTranslationFolder,
};