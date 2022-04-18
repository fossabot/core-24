import React, { ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { GetTags } from '../../../__generated__/GetTags'

export const GET_TAGS = gql`
  query GetTags {
    videoTags {
      id
      title {
        value
      }
    }
  }
`

export function TagSearch({ onChange }): ReactElement {
  const { data, loading } = useQuery<GetTags>(GET_TAGS)

  return (
    <>
      <Autocomplete
        id="language-search"
        sx={{ width: 280 }}
        onChange={onChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) =>
          `${option.id} - ${option.title
            .map((title) => `${title.value}`)
            .toString()}`
        }
        options={data?.videoTags ?? []}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Tag"
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
