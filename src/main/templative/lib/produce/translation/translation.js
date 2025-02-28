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
  if (!fs.existsSync(translationCacheFilepath)) {
    await createLangaugeTranslationCache(gameRootDirectory, destinationLanguageCode);
  }

  const translationCacheFileContent = await fs.promises.readFile(translationCacheFilepath, 'utf-8');
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

function createTranslationFolder(gameRootDirectory) {
  const translationDirectoryPath = path.join(gameRootDirectory, "translations");
  if (fs.existsSync(translationDirectoryPath)) {
    return;
  }
  fs.mkdirSync(translationDirectoryPath, { recursive: true });
}

function hasTranslationFolder(gameRootDirectory) {
  const translationDirectoryPath = path.join(gameRootDirectory, "translations");
  return fs.existsSync(translationDirectoryPath);
}

function hasExistingLanguageTranslationCache(gameRootDirectory, destinationLanguageCode) {
  return fs.existsSync(path.join(gameRootDirectory, "translations", destinationLanguageCode));
}

function createLanguageTranslationCacheFolder(gameRootDirectory, destinationLanguageCode) {
  fs.mkdirSync(path.join(gameRootDirectory, "translations", destinationLanguageCode), { recursive: true });
}

async function createLangaugeTranslationCache(gameRootDirectory, destinationLanguageCode) {
  if (!hasTranslationFolder(gameRootDirectory)) {
    createTranslationFolder(gameRootDirectory);
  }

  if (!hasExistingLanguageTranslationCache(gameRootDirectory, destinationLanguageCode)) {
    createLanguageTranslationCacheFolder(gameRootDirectory, destinationLanguageCode);
  }

  const translationCacheFilepath = path.join(gameRootDirectory, "translations", destinationLanguageCode, `${destinationLanguageCode}.csv`);
  await fs.promises.writeFile(translationCacheFilepath, "english,translation\n", 'utf-8');
}

module.exports = {
  getTranslation,
  getTranslation,
  createTranslationFolder,
  hasTranslationFolder,
};