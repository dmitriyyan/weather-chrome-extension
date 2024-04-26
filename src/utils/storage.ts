import { OpenWeatherTempScale } from '../api/weather';

export interface LocalStorage {
  cities?: string[];
  options?: LocalStorageOptions;
}

export interface LocalStorageOptions {
  hasAutoOverlay: boolean;
  homeCity: string;
  tempScale: OpenWeatherTempScale;
}

export const defaultOptions: LocalStorageOptions = {
  hasAutoOverlay: false,
  homeCity: '',
  tempScale: 'metric',
};

export type LocalStorageKeys = keyof LocalStorage;

export async function setStoredCities(cities: string[]) {
  const values: LocalStorage = {
    cities,
  };
  await new Promise<void>((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve();
    });
  });
}

export async function getStoredCities() {
  const keys: LocalStorageKeys[] = ['cities'];
  return await new Promise<string[]>((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.cities ?? []);
    });
  });
}

export async function setStoredOptions(options: LocalStorageOptions) {
  const values: LocalStorage = {
    options,
  };
  await new Promise<void>((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve();
    });
  });
}

export async function getStoredOptions() {
  const keys: LocalStorageKeys[] = ['options'];
  const options = await new Promise<LocalStorageOptions | undefined>(
    (resolve) => {
      chrome.storage.local.get(keys, (res: LocalStorage) => {
        resolve(res.options);
      });
    },
  );
  if (options) {
    return options;
  }
  await setStoredOptions(defaultOptions);
  return defaultOptions;
}
