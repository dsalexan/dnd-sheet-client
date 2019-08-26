import axios from 'axios'
import _ from 'lodash'

// @ts-ignore
import utils from '@/utils/resources'


function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export default class Mention {
    public static async search(text: string, meta: string = '', max?: number, query?: string): Promise<object[]> {
        console.log('SEARCH', text, meta)
        const response = await axios.get(`http://localhost:3000/${meta}?q=${text}${max ? '&max=' + max : ''}${query ? '&query=' + query : ''}`)
        return response.data
    }

    public static async sheet(id: string) {
        if (id === undefined) {
            return undefined
        }

        try {
            return (await axios.get(`http://localhost:3000/sheets?q=${id}`)).data[0]
        } catch (err) {
            throw err
        }
    }

    public static options(type: string = 'default') {
        if (type === 'default') {
            return {
                menuItemTemplate(item: any) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                },
                selectTemplate(item: any) {
                    return `<span class="mention" data-value="${JSON.stringify(item.original).replace(/\"/gmi, '\'')}">${item.original.name.en || item.original.name['pt-BR'] || item.original.name}</span>`
                },
                requireLeadingSpace: false
            }
        }
    }

    public static resolve(mention: string, state: any, reference: boolean = false) {
        if (mention.substr(0, 4) === '@me/') {
            mention = mention.substr(4)
            mention = mention.replace(/\/+/, '.')

            const paths = _.toPath(mention)
            const final = paths.pop()

            let _static = state.static
            for (const p of paths) {
                _static = _static[p]
            }

            let _async = state.async
            for (const p of paths) {
                _async = _async[p]
            }

            if (!reference) {
                if (_static === undefined && _async === undefined) return undefined
                return _async === undefined ? _static : _async
            } else {
                // @ts-ignore
                if (_static[final] === undefined && _async[final] === undefined) return undefined
                // @ts-ignore
                return [_async[final] === undefined ? _static : _async, final, mention]
            }
        } else if (mention[0] === '@') {
            return Mention.search(mention.substr(1))
        } else {
            throw new Error(`Unimplemented resolve mention for <${mention}>`)
        }
    }
}
