import { ReactElement } from 'react'
import TextFieldsRounded from '@mui/icons-material/TextFieldsRounded'
import { gql, useMutation } from '@apollo/client'
import {
  ActiveTab,
  useEditor,
  TreeBlock,
  TYPOGRAPHY_FIELDS,
  useJourney
} from '@core/journeys/ui'
import { Button } from '../../Button'
import { GetJourney_journey_blocks_CardBlock as CardBlock } from '../../../../../../__generated__/GetJourney'
import { TypographyBlockCreate } from '../../../../../../__generated__/TypographyBlockCreate'

export const TYPOGRAPHY_BLOCK_CREATE = gql`
  ${TYPOGRAPHY_FIELDS}
  mutation TypographyBlockCreate($input: TypographyBlockCreateInput!) {
    typographyBlockCreate(input: $input) {
      id
      parentBlockId
      ...TypographyFields
    }
  }
`

export function NewTypographyButton(): ReactElement {
  const [typographyBlockCreate] = useMutation<TypographyBlockCreate>(
    TYPOGRAPHY_BLOCK_CREATE
  )
  const journey = useJourney()
  const {
    state: { selectedStep },
    dispatch
  } = useEditor()

  const handleClick = async (): Promise<void> => {
    const card = selectedStep?.children.find(
      (block) => block.__typename === 'CardBlock'
    ) as TreeBlock<CardBlock> | undefined
    const checkTypography = card?.children.map((block) =>
      block.children.find((child) => child.__typename === 'TypographyBlock')
    )
    if (card != null && checkTypography !== undefined && journey != null) {
      const { data } = await typographyBlockCreate({
        variables: {
          input: {
            journeyId: journey.id,
            parentBlockId: card.id,
            content: 'Add your text here...',
            variant: checkTypography.length > 0 ? 'body2' : 'h1'
          }
        },
        update(cache, { data }) {
          if (data?.typographyBlockCreate != null) {
            cache.modify({
              id: cache.identify({ __typename: 'Journey', id: journey.id }),
              fields: {
                blocks(existingBlockRefs = []) {
                  const newBlockRef = cache.writeFragment({
                    data: data.typographyBlockCreate,
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
      if (data?.typographyBlockCreate != null) {
        dispatch({
          type: 'SetSelectedBlockByIdAction',
          id: data.typographyBlockCreate.id
        })
        dispatch({
          type: 'SetActiveTabAction',
          activeTab: ActiveTab.Properties
        })
      }
    }
  }

  return (
    <Button icon={<TextFieldsRounded />} value="Text" onClick={handleClick} />
  )
}
