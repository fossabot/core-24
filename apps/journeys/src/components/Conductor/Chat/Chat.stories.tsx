import { Meta, Story } from '@storybook/react'
import { simpleComponentConfig } from '../../../libs/storybook'
import { Chat } from '.'

const Demo = {
  ...simpleComponentConfig,
  component: Chat,
  title: 'Journeys/Conductor/Chat'
}

const Template: Story = () => <Chat />

export const Default: Story = Template.bind({})

export default Demo as Meta
