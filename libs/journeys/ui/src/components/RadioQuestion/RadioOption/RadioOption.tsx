import { ReactElement, MouseEvent } from 'react'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useRouter } from 'next/router'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import { TreeBlock, handleAction, useEditor, ActiveTab } from '../../..'
import { RadioOptionFields } from './__generated__/RadioOptionFields'

export interface RadioOptionProps extends TreeBlock<RadioOptionFields> {
  className?: string
  selected?: boolean
  disabled?: boolean
  onClick?: (selected: string) => void
}

export function RadioOption({
  className,
  label,
  action,
  id,
  disabled = false,
  selected = false,
  onClick,
  ...props
}: RadioOptionProps): ReactElement {
  const theme = useTheme()
  const router = useRouter()

  const handleClick = (): void => {
    handleAction(router, action)
    onClick?.(id)
  }

  const {
    state: { selectedBlock },
    dispatch
  } = useEditor()

  const handleSelectBlock = (e: MouseEvent<HTMLElement>): void => {
    const block: TreeBlock<RadioOptionFields> = {
      id,
      label,
      action,
      ...props
    }

    const parentSelected = selectedBlock?.id === block.parentBlockId
    const siblingSelected = selectedBlock?.parentBlockId === block.parentBlockId

    if (parentSelected || siblingSelected) {
      e.stopPropagation()
      dispatch({ type: 'SetSelectedBlockAction', block })
      dispatch({ type: 'SetActiveTabAction', activeTab: ActiveTab.Properties })
      dispatch({ type: 'SetSelectedAttributeIdAction', id: undefined })
    }
  }

  const selectedAction: React.MouseEventHandler =
    label === 'Add new item'
      ? handleClick
      : selectedBlock === undefined
      ? handleClick
      : handleSelectBlock

  const selectedIcon: ReactElement =
    label === 'Add new item' ? (
      <AddCircleRoundedIcon
        sx={{
          fontSize: 24, // BUG: something is overriding this style
          color: '#C52D3A'
        }}
      />
    ) : selected ? (
      <CheckCircleIcon data-testid="RadioOptionCheckCircleIcon" />
    ) : (
      <RadioButtonUncheckedIcon data-testid="RadioOptionRadioButtonUncheckedIcon" />
    )

  return (
    <Button
      variant="contained"
      className={className}
      disabled={disabled}
      onClick={selectedAction}
      startIcon={selectedIcon}
      sx={{
        fontFamily: theme.typography.body2.fontFamily,
        fontSize: theme.typography.body2.fontSize,
        fontWeight: 600,
        lineHeight: theme.typography.body2.lineHeight,
        textAlign: 'start',
        justifyContent: 'flex-start',
        borderRadius: '8px',
        padding: '14px 10px 14px 14px',
        outline: selectedBlock?.id === id ? '3px solid #C52D3A' : 'none',
        outlineOffset: '5px',
        zIndex: selectedBlock?.id === id ? 1 : 0
      }}
    >
      {label}
    </Button>
  )
}
