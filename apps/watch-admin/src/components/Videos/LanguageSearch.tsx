import React, { ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { GetLanguages } from '../../../__generated__/GetLanguages'

export const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      bcp47
      id
      iso3
      name {
        primary
        value
      }
    }
  }
`

export function LanguageSearch({ onChange }): ReactElement {
  const { data, loading } = useQuery<GetLanguages>(GET_LANGUAGES)

  return (
    <>
      <Autocomplete
        id="language-search"
        sx={{ width: 280 }}
        onChange={onChange}
        isOptionEqualToValue={(option, value) => option.bcp47 === value.bcp47}
        getOptionLabel={(option) =>
          `${option.bcp47 ?? ''} | ${option.name
            .map((name) => ` ${name.value}`)
            .toString()}`
        }
        options={data?.languages ?? []}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Audio Language"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
    </>
  )
}
