import { ReactElement } from 'react'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/system/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ChatBubbleOutlineOutlined from '@mui/icons-material/ChatBubbleOutlineOutlined'

// get confirmation on props later on
// we need:
// user name
// messengerUrl

// if ther eis no mesenger url don't show the chat bar

export function Chat(): ReactElement {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body1">
        This interactive video hosted by Hasim & Dilara
      </Typography>
      <Box>
        <AvatarGroup>
          <Avatar sx={{ backgroundColor: '#FFFFFF' }}>
            <ChatBubbleOutlineOutlined color="primary" />
          </Avatar>
          <Avatar alt="hasim" src={undefined} sx={{}} />
        </AvatarGroup>
      </Box>
    </Stack>
  )
}
