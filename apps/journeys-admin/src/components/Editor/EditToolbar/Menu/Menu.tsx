import { ReactElement, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MoreVert from '@mui/icons-material/MoreVert'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Divider from '@mui/material/Divider'
import { useJourney } from '@core/journeys/ui/JourneyProvider'
import { useEditor } from '@core/journeys/ui/EditorProvider'
import { Theme } from '@mui/material/styles'
import SettingsIcon from '@mui/icons-material/Settings'
import NextLink from 'next/link'
import useMediaQuery from '@mui/material/useMediaQuery'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import { DeleteBlock } from '../DeleteBlock'
import { JourneyStatus } from '../../../../../__generated__/globalTypes'

export function Menu(): ReactElement {
  const {
    state: { selectedBlock },
    dispatch
  } = useEditor()

  const { journey } = useJourney()
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = (): void => {
    setAnchorEl(null)
  }

  function BlockMenu(): ReactElement {
    return (
      <>
        <MenuItem
          disabled={journey?.status === JourneyStatus.draft}
          component="a"
          href={`/api/preview?slug=${journey?.slug ?? ''}`}
          target="_blank"
          rel="noopener"
          onClick={handleCloseMenu}
        >
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>Preview</ListItemText>
        </MenuItem>
        <DeleteBlock variant="list-item" />
        {!smUp && (
          <MenuItem onClick={handleOpenSocial}>
            <ListItemIcon>
              <ShareRoundedIcon />
            </ListItemIcon>
            <ListItemText>Social Settings</ListItemText>
          </MenuItem>
        )}
      </>
    )
  }

  function CardMenu(): ReactElement {
    return (
      <>
        <MenuItem
          disabled={journey?.status === JourneyStatus.draft}
          component="a"
          href={`/api/preview?slug=${journey?.slug ?? ''}`}
          target="_blank"
          rel="noopener"
          onClick={handleCloseMenu}
        >
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>Preview</ListItemText>
        </MenuItem>
        <DeleteBlock variant="list-item" closeMenu={handleCloseMenu} />
        {!smUp && (
          <MenuItem onClick={handleOpenSocial}>
            <ListItemIcon>
              <ShareRoundedIcon />
            </ListItemIcon>
            <ListItemText>Social Settings</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <NextLink
          href={journey != null ? `/journeys/${journey.slug}` : ''}
          passHref
        >
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Journey Settings</ListItemText>
          </MenuItem>
        </NextLink>
      </>
    )
  }

  function handleOpenSocial(): void {
    dispatch({
      type: 'SetDrawerMobileOpenAction',
      mobileOpen: true
    })
    handleCloseMenu()
  }

  return (
    <>
      <IconButton
        id="edit-journey-actions"
        edge="end"
        aria-label="Edit Journey Actions"
        aria-controls="edit-journey-actions"
        aria-haspopup="true"
        aria-expanded={anchorEl != null ? 'true' : undefined}
        onClick={handleShowMenu}
        disabled={journey == null}
      >
        <MoreVert />
      </IconButton>
      <MuiMenu
        id="edit-journey-actions"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'edit-journey-actions'
        }}
      >
        {selectedBlock?.__typename === 'StepBlock' ? (
          <CardMenu />
        ) : (
          <BlockMenu />
        )}
      </MuiMenu>
    </>
  )
}
