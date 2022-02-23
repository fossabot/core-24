import { ReactElement, MouseEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Typography from '@mui/material/Typography'
import { useMutation, gql } from '@apollo/client'
import { TreeBlock, useEditor, ActiveTab } from '../..'
import { RadioOption } from './RadioOption'
import { RadioQuestionResponseCreate } from './__generated__/RadioQuestionResponseCreate'
import { RadioOptionBlockCreate } from './__generated__/RadioOptionBlockCreate'
import { RadioQuestionFields } from './__generated__/RadioQuestionFields'

export const RADIO_QUESTION_RESPONSE_CREATE = gql`
  mutation RadioQuestionResponseCreate(
    $input: RadioQuestionResponseCreateInput!
  ) {
    radioQuestionResponseCreate(input: $input) {
      id
      radioOptionBlockId
    }
  }
`

// This mutation needs to be moved into a wrapper, waiting for the pattern to be completed on another PR to continue.
export const RADIO_OPTION_BLOCK_CREATE = gql`
  mutation RadioOptionBlockCreate($input: RadioOptionBlockCreateInput!) {
    radioOptionBlockCreate(input: $input) {
      id
    }
  }
`

interface RadioQuestionProps extends TreeBlock<RadioQuestionFields> {
  uuid?: () => string
}

export function RadioQuestion({
  id: blockId,
  label,
  description,
  children,
  uuid = uuidv4,
  ...props
}: RadioQuestionProps): ReactElement {
  const [radioQuestionResponseCreate, { data }] =
    useMutation<RadioQuestionResponseCreate>(RADIO_QUESTION_RESPONSE_CREATE)
  const [radioOptionBlockCreate] = useMutation<RadioOptionBlockCreate>(
    RADIO_OPTION_BLOCK_CREATE
  )

  const handleClick = async (radioOptionBlockId: string): Promise<void> => {
    const id = uuid()
    await radioQuestionResponseCreate({
      variables: {
        input: {
          id,
          blockId,
          radioOptionBlockId
        }
      },
      optimisticResponse: {
        radioQuestionResponseCreate: {
          id,
          __typename: 'RadioQuestionResponse',
          radioOptionBlockId
        }
      }
    })
  }

  const selectedId = data?.radioQuestionResponseCreate?.radioOptionBlockId

  const {
    state: { selectedBlock },
    dispatch
  } = useEditor()

  const handleSelectBlock = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation()

    const block: TreeBlock<RadioQuestionFields> = {
      id: blockId,
      label,
      description,
      children,
      ...props
    }

    dispatch({ type: 'SetSelectedBlockAction', block })
    dispatch({ type: 'SetActiveTabAction', activeTab: ActiveTab.Properties })
    dispatch({ type: 'SetSelectedAttributeIdAction', id: undefined })
  }

  async function handleAddOption(): Promise<void> {
    const { data } = await radioOptionBlockCreate({
      variables: {
        input: {
          id: uuid(),
          journeyId: '1',
          parentBlockId: blockId,
          label: 'New item'
        }
      },
      update(cache, { data }) {
        if (data?.radioOptionBlockCreate != null) {
          cache.modify({
            id: cache.identify({
              __typename: 'Journey',
              id: '1'
            }),
            fields: {
              blocks(existingBlockRefs = []) {
                const newBlockRef = cache.writeFragment({
                  data: data.radioOptionBlockCreate,
                  fragment: gql`
                    fragment NewBlock on Block {
                      id
                    }
                  `
                })
                return [...existingBlockRefs, newBlockRef]
              }
            }
          })
        }
      }
    })
    // BUG: New optionBlock is not being selected
    if (data?.radioOptionBlockCreate != null) {
      dispatch({
        type: 'SetSelectedBlockByIdAction',
        id: data.radioOptionBlockCreate.id
      })
      dispatch({
        type: 'SetActiveTabAction',
        activeTab: ActiveTab.Properties
      })
    }
  }

  return (
    <Box
      data-testid={`radioQuestion-${blockId}`}
      sx={{
        outline: selectedBlock?.id === blockId ? '3px solid #C52D3A' : 'none',
        outlineOffset: '5px'
      }}
      onClick={selectedBlock === undefined ? undefined : handleSelectBlock}
    >
      <Typography variant="h3" gutterBottom>
        {label}
      </Typography>
      {description != null && (
        <Typography variant="body2" gutterBottom>
          {description}
        </Typography>
      )}
      <ButtonGroup orientation="vertical" variant="contained" fullWidth={true}>
        {children?.map(
          (option) =>
            option.__typename === 'RadioOptionBlock' && (
              <RadioOption
                {...option}
                key={option.id}
                selected={selectedId === option.id}
                disabled={Boolean(selectedId)}
                onClick={handleClick}
              />
            )
        )}
        {/* CHORE: Check case when there are no options in the list */}
        {/* BUG: The add option shows on other RadioQuestion blocks when browsing cards */}
        {selectedBlock?.__typename === 'RadioQuestionBlock' &&
          children?.length < 12 && (
            <RadioOption
              __typename="RadioOptionBlock"
              id={uuid()}
              label="Add new item"
              parentBlockId={blockId}
              parentOrder={children?.length ?? 0}
              key={'add-new-option'}
              action={null}
              onClick={handleAddOption}
              children={[]}
            />
          )}
      </ButtonGroup>
      {/* BUG: Need some padding at the bottom of this element */}
    </Box>
  )
}
