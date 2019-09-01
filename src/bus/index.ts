import Vue from 'vue'

import { NotifyLevel, NotifySettings, CommandSettings } from './types'


export const Bus = new Vue()

// @ts-ignore
Bus.notifications = {}

export const notify = (settings: NotifySettings ): Promise<Function> => {
    return new Promise((resolve) => {
        Bus.$emit('notify', settings, resolve)
    })
}

export const watch = (_uuid: string, path: string, callback: (newValue: string, oldValue: string) => void) => {
    Bus.$emit('watch', _uuid, path, callback)
}

export const command = (settings: CommandSettings) => {
    return new Promise((resolve) => {
        Bus.$emit('open-command-dialog', {...{icon: 'build'}, ...settings}, resolve)
    })
}
