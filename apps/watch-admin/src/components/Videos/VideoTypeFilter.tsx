import { ReactElement } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { VideoType } from '../../../__generated__/globalTypes'

const options = [VideoType.standalone, VideoType.playlist]

export function VideoTypeFilter({ onChange }): ReactElement {
  return (
    <Autocomplete
      multiple
      id="video-types"
      onChange={onChange}
      options={options}
      getOptionLabel={(option) => option}
      defaultValue={options}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Video Types" />
      )}
    />
  )
}
