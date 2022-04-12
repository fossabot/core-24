import React, { ReactElement, useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { VideoType } from '../../../__generated__/globalTypes'
import { VideoList } from './VideoList/VideoList'

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
]

export function Videos(): ReactElement {
  const [languageIds, setLanguageIds] = useState('529')
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async ():Promise<void> => {
      if (active) {
        setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
      <Autocomplete
        id="asynchronous-demo"
        sx={{ width: 300, marginTop: '2rem' }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={(e) => {
          console.log(e)
          setOpen(false);
        }}
        onChange={(e, option) => {
          setLanguageIds(option.title)
        }}
        groupBy={(option) => option.bcp47}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asynchronous"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      <VideoList
        filter={{
          availableVariantLanguageIds: [languageIds],
          types: [VideoType.playlist, VideoType.standalone]
        }}
        layout="grid"
      />
    </>
  )
}
