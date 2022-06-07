/* Checked by ESLint - https://eslint.org/demo */
const defaultData = {
  "lifeworld": [,],
  "autoplay" : false,
  "volume" : 1,
  "favorites": [],
  "sound" : {}
},
storeName = "naa3207-p1-settings";

const readLocalStorage = () => {
  let allValues = null;

  try{
    allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
  }catch(err){
    console.log(`Problem with JSON.parse() and ${storeName} !`);
    throw err;
  }

  return allValues;
};

const writeLocalStorage = (allValues) => {
  localStorage.setItem(storeName, JSON.stringify(allValues));
};

export const clearLocalStorage = () => writeLocalStorage(defaultData);

export const setLifeworld = (arr) => {
  const allValues = readLocalStorage();

  allValues.lifeworld = arr;
  writeLocalStorage(allValues);
};

export const getLifeworld = () => readLocalStorage().lifeworld;

export const addFavorite = (arr) => {
  const allValues = readLocalStorage();

  allValues.favorites.push(arr);
  writeLocalStorage(allValues);
};

export const getFavorites = () => readLocalStorage().favorites;

export const clearFavorites = () => {
  const allValues = readLocalStorage();

  allValues.favorites = [];
  writeLocalStorage(allValues);
};

export const setAutoplay = (val) => {
  const allValues = readLocalStorage();
  
  allValues.autoplay = val;
  writeLocalStorage(allValues);
};

export const getAutoplay = () => readLocalStorage().autoplay;

export const setVolume = (amt) => {
  const allValues = readLocalStorage();
  
  allValues.volume = amt;
  writeLocalStorage(allValues);
}

export const getVolume = () => readLocalStorage().volume;

export const setSound = (url) => {
  const allValues = readLocalStorage();
  
  allValues.sound = url;
  writeLocalStorage(allValues);
}

export const getSound = () => readLocalStorage().sound;
