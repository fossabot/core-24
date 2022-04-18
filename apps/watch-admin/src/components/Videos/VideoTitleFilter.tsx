import { ReactElement } from 'react'
import TextField from '@mui/material/TextField'

export function VideoTitleFilter({ onChange }): ReactElement {
  return (
    <TextField
      sx={{ width: 200 }}
      onChange={onChange}
      variant="outlined"
      label="Video Titles"
    />
  )
}
