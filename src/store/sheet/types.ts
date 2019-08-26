export interface Dice {
    quantity?: number // defaults to 1
    value: number // number of sides
}

// RESOURCES
export interface Resource {
    _uuid: string // _uuid stabilished at runtime
    _path: string // path (must be the same both in static or async)
    _origin: string // origins's _uuid
    _source: string // meta (profs, equipment, misc, etc...) source of resource
    _type: string // type inside source (armor, weapons, default)
    _method: string // input, injection, subscription
    _parent?: string // parent's _id/slug (in really strange cases)
    _active: boolean
    [key: string]: any // other resource's database data (indexer)
}

export interface AsyncResource extends Resource {
    // _id: string // resource's database data _id
    _synced_at: Date
}

// STATIC SHEET
export interface Experience {
    points: number
    _timestamp: Date
    desc?: string
}

export interface AbilityScore {
    value?: number
    add?: number
}

export interface Sheet {
    name?: string,
    misc: {
        class?: string // SUBSCRIPTION
        level?: number
        background?: string // SUBSCRIPTION
        player?: string
        race?: string // SUBSCRIPTION
        alignment?: string
        experience_points: Experience[]
        age?: string
        height?: string
        weight?: string
        eye_color?: string
        hair_color?: string
        skin_color?: string
        inspiration: boolean
    },
    attributes: {
        ability_scores: {
            [slug: string]: AbilityScore
        },
        hp: {
            rolls: number[],
            current: number // REST
            temporary: number // REST
        },
        exaustion: number // REST, default is 0
        death_saves: {
            successes: boolean[]
            failures: boolean[]
        }
    },
    stats: Resource[] | AsyncResource[]
    proficiencies: Resource[] | AsyncResource[]
    equipment: Resource[] | AsyncResource[]
    features: Resource[] | AsyncResource[]
    spells: Resource[] | AsyncResource[]
    /*
    example:
    stats: {
        faeform: {
            form: string // [Fae, Humanoid]
        },
        shapechanger: {
            form: string // [True, Hybrid, Full]
        },
        hit_dice: Dice,
        hp: Dice
    }
    */
    _index: {
        subscriptions?: {
            [_uuid: string]: Date
        },
        injections?: {
            [_uuid: string]: Date
        }
    }
}

export interface SheetState {
    static: Sheet // static resources loaded from database/added at runtime
    async: Sheet // async resources derived from static
    // fetching
    _stack: Resource[] // stack with static resources yet to be fetched,
    _target: Resource | null
    _pooling: boolean
    _fetching: string[]
    _nest: {
        _stack: AsyncResource[],
        _nesting: boolean
    }
    // indexing
    _index: {
        static: {
            [_uuid: string]: Resource
        },
        async: {
            [_uuid: string]: AsyncResource
        },
        commands: {
            [_id: string]: string
        },
        answers: {
            [_uuid_command: string]: string[]
        }
    },
    _tree: {
        [_uuid_origin: string]: string[]
    },
    _ui: {
        fetch: {
            working: any
            dismiss?: Function
        }
    },
    _observer: string[]
}
