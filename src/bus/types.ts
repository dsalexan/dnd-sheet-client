export enum NotifyLevel {
    SUCCESS,
    INFO,
    WARNING,
    ERROR,
}

export interface NotifySettings {
    message: string
    title?: string
    level?: NotifyLevel // defaults to INFO
    timeout?: number

    icon?: string
    classes?: string
    html?: boolean
}
