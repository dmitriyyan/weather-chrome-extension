import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useOptions } from '../hooks/useOptions';
import { LocalStorageOptions, setStoredOptions } from '../utils/storage';
import { useEffect, useState } from 'react';

export default function App() {
  const { options, mutateOptions, isValidating } = useOptions();
  const [localOptions, setLocalOptions] = useState<LocalStorageOptions>();

  useEffect(() => {
    if (options && !localOptions) {
      setLocalOptions(options);
    }
  }, [options, localOptions]);

  const handleSaveButtonClick = async () => {
    if (localOptions) {
      await setStoredOptions(localOptions);
      await mutateOptions(localOptions);
    }
  };

  const handleHomeCityChange = (homeCity: string) => {
    setLocalOptions((prev) => {
      if (prev) {
        return {
          ...prev,
          homeCity,
        };
      }
      return prev;
    });
  };

  const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
    setLocalOptions((prev) => {
      if (prev) {
        return {
          ...prev,
          hasAutoOverlay,
        };
      }
      return prev;
    });
  };

  if (!options) {
    return null;
  }

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Home city name</Typography>
              <TextField
                fullWidth
                placeholder="Enter a home city name"
                value={localOptions?.homeCity || ''}
                onChange={(event) => {
                  handleHomeCityChange(event.target.value);
                }}
                disabled={isValidating}
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">
                Auto toggle overlay on webpage load
              </Typography>
              <Switch
                color="primary"
                checked={localOptions?.hasAutoOverlay || false}
                onChange={(_, checked) => handleAutoOverlayChange(checked)}
                disabled={isValidating}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveButtonClick}
                disabled={isValidating}
              >
                {isValidating ? 'Saving...' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
