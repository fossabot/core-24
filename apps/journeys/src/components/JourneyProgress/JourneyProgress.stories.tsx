import { Meta } from '@storybook/react'
import { ReactElement } from 'react'
import type { TreeBlock } from '@core/journeys/ui/block'
import { activeBlockVar, treeBlocksVar } from '@core/journeys/ui/block'
import { journeysConfig, simpleComponentConfig } from '../../libs/storybook'
import { GetJourney_journey_blocks_StepBlock as StepBlock } from '../../../__generated__/GetJourney'
import { JourneyProgress } from '.'

const Demo = {
  ...journeysConfig,
  ...simpleComponentConfig,
  component: JourneyProgress,
  title: 'Journeys/JourneyProgress'
}

const blocks: TreeBlock[] = [
  {
    __typename: 'StepBlock',
    id: 'Step1',
    parentBlockId: null,
    parentOrder: 0,
    locked: true,
    nextBlockId: 'Step2',
    children: []
  },
  {
    __typename: 'StepBlock',
    id: 'Step2',
    parentBlockId: null,
    parentOrder: 1,
    locked: true,
    nextBlockId: 'Step3',
    children: []
  },
  {
    __typename: 'StepBlock',
    id: 'Step3',
    parentBlockId: null,
    parentOrder: 2,
    locked: true,
    nextBlockId: 'Step4',
    children: []
  },
  {
    __typename: 'StepBlock',
    id: 'Step4',
    parentBlockId: null,
    parentOrder: 3,
    locked: true,
    nextBlockId: null,
    children: []
  }
]

export const Start = (): ReactElement => {
  const activeBlock: TreeBlock<StepBlock> = {
    __typename: 'StepBlock',
    id: 'Step1',
    parentBlockId: null,
    parentOrder: 0,
    locked: true,
    nextBlockId: 'Step2',
    children: []
  }
  activeBlockVar(activeBlock)
  treeBlocksVar(blocks)
  return <JourneyProgress />
}

export const Halfway = (): ReactElement => {
  const activeBlock: TreeBlock<StepBlock> = {
    __typename: 'StepBlock',
    id: 'Step2',
    parentBlockId: null,
    parentOrder: 0,
    locked: true,
    nextBlockId: 'Step3',
    children: []
  }
  activeBlockVar(activeBlock)
  treeBlocksVar(blocks)
  return <JourneyProgress />
}

export const End = (): ReactElement => {
  const activeBlock: TreeBlock<StepBlock> = {
    __typename: 'StepBlock',
    id: 'Step4',
    parentBlockId: null,
    parentOrder: 0,
    locked: true,
    nextBlockId: null,
    children: []
  }
  activeBlockVar(activeBlock)
  treeBlocksVar(blocks)
  return <JourneyProgress />
}

export default Demo as Meta
