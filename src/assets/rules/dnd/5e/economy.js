export default {
    money: {
        coins: {
            list: [
                {
                    name: 'Copper Piece',
                    slug: 'cp',
                    base_value: 10**-3
                },{
                    name: 'Silver Piece',
                    slug: 'sp',
                    base_value: 10**-2
                },{
                    name: 'Electrum Piece',
                    slug: 'ep',
                    base_value: 10**-1
                },{
                    name: 'Gold Piece',
                    slug: 'gp',
                    base_value: 10**0
                },{
                    name: 'Platinum Piece',
                    slug: 'pp',
                    base_value: 10**1
                }
            ],
            map: (list) => {
                let m = {}
                for(let i of list){
                    m[i.slug] = i
                }
                return m
            }
        }
    }
}