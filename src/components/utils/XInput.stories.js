import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import XInput from './XInput'

storiesOf('XInput', module)
    .add('As a component', () => ({
        components: { XInput },
        template: '<XInput />'
    }))
    .add('I dont work', () => '<Xinput />')