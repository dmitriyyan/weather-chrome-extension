import { useEffect, useState } from 'react';
import WeatherCard from '../components/WeatherCard';
import { Messages } from '../utils/messages';
import './contentScript.css';
import { useOptions } from '../hooks/useOptions';
import { Card } from '@mui/material';

export default function App() {
  const { options } = useOptions();
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (options) {
      setIsActive(options.hasAutoOverlay);
    }
  }, [options]);

  const handleMessages = (msg: Messages) => {
    if (msg === Messages.TOGGLE_OVERLAY) {
      setIsActive((prev) => !prev);
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessages);
    return () => {
      // clean up event listener, bug fix from: https://www.udemy.com/course/chrome-extension/learn/#questions/14694484/
      chrome.runtime.onMessage.removeListener(handleMessages);
    };
  }, [isActive]);

  if (!options) {
    return null;
  }

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard
            city={options.homeCity}
            tempScale={options.tempScale}
            onDelete={() => setIsActive(false)}
          />
        </Card>
      )}
    </>
  );
}
