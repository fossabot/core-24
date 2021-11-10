import { MockedProvider } from '@apollo/client/testing'
import { Story, Meta } from '@storybook/react'
import Conductor, { ConductorProps } from '.'
import { basic, imageBlocks, videoBlock } from './data'
import { journeysConfig } from '../../libs/storybook'

const Demo = {
  ...journeysConfig,
  component: Conductor,
  title: 'Journeys/Conductor',
  parameters: {
    ...journeysConfig.parameters,
    layout: 'fullscreen'
  }
}

const Template: Story<ConductorProps> = ({ ...props }) => (
  <MockedProvider>
    <Conductor {...props} />
  </MockedProvider>
)

export const Default: Story<ConductorProps> = Template.bind({})
Default.args = {
  blocks: basic
}

export const WithContent: Story<ConductorProps> = Template.bind({})
WithContent.args = {
  blocks: imageBlocks
}

export const WithVideoContent: Story<ConductorProps> = Template.bind({})
WithVideoContent.args = {
  blocks: videoBlock
}

export default Demo as Meta
