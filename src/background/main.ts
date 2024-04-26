import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';
import { weatherFetcher } from '../api/weather';

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([]);
  setStoredOptions({
    hasAutoOverlay: false,
    homeCity: '',
    tempScale: 'metric',
  });

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Add city to weather extension',
    id: 'weatherExtension',
  });

  chrome.alarms.create({
    periodInMinutes: 60,
  });

  chrome.contextMenus.onClicked.addListener(async (event) => {
    if (event.selectionText) {
      const cities = await getStoredCities();
      setStoredCities([...cities, event.selectionText]);
    }
  });

  chrome.alarms.onAlarm.addListener(async () => {
    const options = await getStoredOptions();
    if (options.homeCity === '') {
      return;
    }
    const data = await weatherFetcher([options.homeCity, options.tempScale]);
    const temp = Math.round(data.main.temp);
    const symbol = options.tempScale === 'metric' ? '\u2103' : '\u2109';
    chrome.action.setBadgeText({
      text: `${temp}${symbol}`,
    });
  });
});
