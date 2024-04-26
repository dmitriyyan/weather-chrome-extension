import { Box, Grid, IconButton, InputBase, Paper } from '@mui/material';
import {
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@mui/icons-material';
import './popup.css';
import { useState } from 'react';
import {
  LocalStorageOptions,
  getStoredCities,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';
import { Messages } from '../utils/messages';
import WeatherCard from '../components/WeatherCard';
import useSWR from 'swr';
import { useOptions } from '../hooks/useOptions';

export default function App() {
  const { data: cities, mutate: mutateCities } = useSWR(
    'cities',
    getStoredCities,
    { fallbackData: [] },
  );
  const { mutateOptions, options } = useOptions();
  const [cityInput, setCityInput] = useState<string>('');

  const handleCityButtonClick = async () => {
    if (cityInput === '') {
      return;
    }
    const updatedCities = cities ? [...cities, cityInput] : [cityInput];
    await setStoredCities(updatedCities);
    mutateCities(updatedCities);
    setCityInput('');
  };

  const handleCityDeleteButtonClick = async (index: number) => {
    if (cities) {
      const updatedCities = [...cities];
      updatedCities.splice(index, 1);
      await setStoredCities(updatedCities);
      mutateCities(updatedCities);
    }
  };

  const handleTempScaleButtonClick = async () => {
    if (options) {
      const updateOptions: LocalStorageOptions = {
        ...options,
        tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
      };
      await setStoredOptions(updateOptions);
      mutateOptions(updateOptions);
    }
  };

  const handleOverlayButtonClick = () => {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
        }
      },
    );
  };

  if (!options) {
    return null;
  }

  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box px="15px" py="5px">
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          key={index}
          tempScale={options.tempScale}
          onDelete={() => handleCityDeleteButtonClick(index)}
        />
      ))}
      <Box height="16px" />
    </Box>
  );
}
