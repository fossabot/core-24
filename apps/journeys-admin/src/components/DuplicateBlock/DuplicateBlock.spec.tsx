import { render, fireEvent, waitFor } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import { EditorProvider } from '@core/journeys/ui/EditorProvider'
import { JourneyProvider } from '@core/journeys/ui/JourneyProvider'
import type { TreeBlock } from '@core/journeys/ui/block'
import { MockedProvider } from '@apollo/client/testing'
import {
  GetJourney_journey_blocks_TypographyBlock as TypographyBlock,
  GetJourney_journey_blocks_StepBlock as StepBlock,
  GetJourney_journey as Journey
} from '../../../__generated__/GetJourney'
import {
  TypographyVariant,
  TypographyAlign,
  TypographyColor
} from '../../../__generated__/globalTypes'
import { DuplicateBlock, BLOCK_DUPLICATE } from './DuplicateBlock'

describe('DuplicateBlock', () => {
  const block: TreeBlock<TypographyBlock> = {
    id: 'typography0.id',
    __typename: 'TypographyBlock',
    parentBlockId: 'card1.id',
    parentOrder: 0,
    content: 'Title',
    variant: TypographyVariant.h1,
    color: TypographyColor.primary,
    align: TypographyAlign.center,
    children: []
  }

  const step: TreeBlock<StepBlock> = {
    __typename: 'StepBlock',
    id: 'stepId',
    parentBlockId: 'journeyId',
    parentOrder: 0,
    locked: true,
    nextBlockId: null,
    children: [
      {
        id: 'card1.id',
        __typename: 'CardBlock',
        parentBlockId: 'stepId',
        parentOrder: 0,
        coverBlockId: null,
        backgroundColor: null,
        themeMode: null,
        themeName: null,
        fullscreen: false,
        children: [block]
      }
    ]
  }

  const blockOrder = block?.parentOrder != null ? block.parentOrder : 0
  const stepOrder = step?.parentOrder != null ? step.parentOrder : 0

  it('should duplicate a block on button click', async () => {
    const result = jest.fn(() => ({
      data: {
        blockDuplicate: {
          id: 'duplicatedId',
          parentOrder: 1
        }
      }
    }))
    const { getByRole, getByTestId } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: BLOCK_DUPLICATE,
              variables: {
                id: block.id,
                journeyId: 'journeyId',
                parentOrder: blockOrder + 1
              }
            },
            result
          }
        ]}
      >
        <SnackbarProvider>
          <JourneyProvider
            value={{
              journey: { id: 'journeyId' } as unknown as Journey,
              admin: true
            }}
          >
            <EditorProvider initialState={{ selectedBlock: block }}>
              <DuplicateBlock variant="button" />
            </EditorProvider>
          </JourneyProvider>
        </SnackbarProvider>
      </MockedProvider>
    )
    const button = getByRole('button')
    expect(button).toContainElement(getByTestId('ContentCopyRoundedIcon'))
    fireEvent.click(button)
    await waitFor(() => expect(result).toHaveBeenCalled())
  })

  it('should duplicate a block on menu click', async () => {
    const result = jest.fn(() => ({
      data: {
        blockDuplicate: {
          id: 'duplicatedId',
          parentOrder: 1
        }
      }
    }))
    const { getByRole } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: BLOCK_DUPLICATE,
              variables: {
                id: block.id,
                journeyId: 'journeyId',
                parentOrder: blockOrder + 1
              }
            },
            result
          }
        ]}
      >
        <SnackbarProvider>
          <JourneyProvider
            value={{
              journey: { id: 'journeyId' } as unknown as Journey,
              admin: true
            }}
          >
            <EditorProvider initialState={{ selectedBlock: block }}>
              <DuplicateBlock variant="list-item" />
            </EditorProvider>
          </JourneyProvider>
        </SnackbarProvider>
      </MockedProvider>
    )
    fireEvent.click(getByRole('menuitem', { name: 'Duplicate Block' }))
    await waitFor(() => expect(result).toHaveBeenCalled())
  })

  it('should duplicate a card on button click', async () => {
    const result = jest.fn(() => ({
      data: {
        blockDuplicate: {
          id: 'duplicatedId',
          parentOrder: 1
        }
      }
    }))
    const { getByRole, getByTestId } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: BLOCK_DUPLICATE,
              variables: {
                id: step.id,
                journeyId: 'journeyId',
                parentOrder: stepOrder + 1
              }
            },
            result
          }
        ]}
      >
        <SnackbarProvider>
          <JourneyProvider
            value={{
              journey: { id: 'journeyId' } as unknown as Journey,
              admin: true
            }}
          >
            <EditorProvider initialState={{ selectedBlock: step }}>
              <DuplicateBlock variant="button" />
            </EditorProvider>
          </JourneyProvider>
        </SnackbarProvider>
      </MockedProvider>
    )
    const button = getByRole('button')
    expect(button).toContainElement(getByTestId('ContentCopyRoundedIcon'))
    fireEvent.click(button)
    await waitFor(() => expect(result).toHaveBeenCalled())
  })

  it('should duplicate a card on menu click', async () => {
    const result = jest.fn(() => ({
      data: {
        blockDuplicate: {
          id: 'duplicatedId',
          parentOrder: 1
        }
      }
    }))
    const { getByRole } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: BLOCK_DUPLICATE,
              variables: {
                id: step.id,
                journeyId: 'journeyId',
                parentOrder: stepOrder + 1
              }
            },
            result
          }
        ]}
      >
        <SnackbarProvider>
          <JourneyProvider
            value={{
              journey: { id: 'journeyId' } as unknown as Journey,
              admin: true
            }}
          >
            <EditorProvider initialState={{ selectedBlock: step }}>
              <DuplicateBlock variant="list-item" />
            </EditorProvider>
          </JourneyProvider>
        </SnackbarProvider>
      </MockedProvider>
    )
    fireEvent.click(getByRole('menuitem', { name: 'Duplicate Card' }))
    await waitFor(() => expect(result).toHaveBeenCalled())
  })
})
