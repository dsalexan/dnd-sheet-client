import Vue from 'vue'

import { NotifyLevel, NotifySettings } from './types'


export const Bus = new Vue()

// @ts-ignore
Bus.notifications = {}

export const notify = (settings: NotifySettings ): Promise<Function> => {
    return new Promise((resolve) => {
        Bus.$emit('notify', settings, resolve)
    })
}

export const watch = (path: string, callback: (newValue: string, oldValue: string) => void) => {
    Bus.$emit('watch', path, callback)
}
