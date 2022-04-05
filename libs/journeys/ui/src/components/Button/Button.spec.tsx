import { render, fireEvent } from '@testing-library/react'
import {
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  IconColor,
  IconName,
  IconSize
} from '../../../__generated__/globalTypes'
import { handleAction, TreeBlock } from '../..'
import { ButtonFields } from './__generated__/ButtonFields'
import { Button } from '.'

jest.mock('../../libs/action', () => {
  const originalModule = jest.requireActual('../../libs/action')
  return {
    __esModule: true,
    ...originalModule,
    handleAction: jest.fn()
  }
})

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: () => null
    }
  }
}))

const block: TreeBlock<ButtonFields> = {
  __typename: 'ButtonBlock',
  id: 'button',
  parentBlockId: 'question',
  parentOrder: 0,
  label: 'This is a button',
  buttonVariant: ButtonVariant.contained,
  buttonColor: ButtonColor.primary,
  size: ButtonSize.small,
  startIconId: null,
  endIconId: null,
  action: null,
  children: []
}

describe('Button', () => {
  it('should render the button successfully', () => {
    const { getByText, getByRole } = render(<Button {...block} />)
    expect(getByRole('button')).toHaveClass('MuiButton-root')
    expect(getByRole('button')).toHaveClass('MuiButton-contained')
    expect(getByRole('button')).toHaveClass('MuiButton-containedSizeSmall')
    expect(getByText('This is a button')).toBeInTheDocument()
  })

  it('should render with the contained value', () => {
    const { getByRole } = render(
      <Button {...block} buttonVariant={ButtonVariant.contained} />
    )
    expect(getByRole('button')).toHaveClass('MuiButton-contained')
  })

  it('should render with the size value', () => {
    const { getByRole } = render(<Button {...block} size={ButtonSize.small} />)
    expect(getByRole('button')).toHaveClass('MuiButton-containedSizeSmall')
  })

  it('should render the default color value', () => {
    const { getByRole } = render(<Button {...block} buttonColor={null} />)
    expect(getByRole('button')).toHaveClass('MuiButton-containedPrimary')
  })

  it('should render the start icon', () => {
    const iconBlock: TreeBlock<ButtonFields> = {
      ...block,
      startIconId: 'start',
      children: [
        {
          id: 'start',
          __typename: 'IconBlock',
          parentBlockId: 'id',
          parentOrder: 0,
          iconName: IconName.CheckCircleRounded,
          iconColor: null,
          iconSize: IconSize.md,
          children: []
        }
      ]
    }
    const { getByTestId } = render(<Button {...iconBlock} />)
    expect(getByTestId('CheckCircleRoundedIcon')).toHaveClass('MuiSvgIcon-root')
    expect(getByTestId('CheckCircleRoundedIcon').parentElement).toHaveClass(
      'MuiButton-startIcon'
    )
  })
  it('should render the end icon', () => {
    const iconBlock: TreeBlock<ButtonFields> = {
      ...block,
      endIconId: 'end',
      children: [
        {
          id: 'end',
          __typename: 'IconBlock',
          parentBlockId: 'id',
          parentOrder: 0,
          iconName: IconName.CheckCircleRounded,
          iconColor: IconColor.primary,
          iconSize: IconSize.md,
          children: []
        }
      ]
    }
    const { getByTestId } = render(<Button {...iconBlock} />)
    expect(getByTestId('CheckCircleRoundedIcon')).toHaveClass('MuiSvgIcon-root')
    expect(getByTestId('CheckCircleRoundedIcon').parentElement).toHaveClass(
      'MuiButton-endIcon'
    )
  })

  it('should call actionHandler on click', () => {
    const { getByRole } = render(
      <Button
        {...block}
        action={{
          __typename: 'NavigateToBlockAction',
          parentBlockId: block.id,
          gtmEventName: 'gtmEventName',
          blockId: 'def'
        }}
      />
    )
    fireEvent.click(getByRole('button'))
    expect(handleAction).toBeCalledWith(
      expect.objectContaining({
        push: expect.any(Function)
      }),
      false,
      {
        __typename: 'NavigateToBlockAction',
        parentBlockId: block.id,
        gtmEventName: 'gtmEventName',
        blockId: 'def'
      }
    )
  })
})
