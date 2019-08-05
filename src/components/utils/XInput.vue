<template>
    <component 
        ref="root"
        :is="tag"
        class="x-input"
        :class="{active: isReactive ? !(value !== 0 && !value) : false, box: isBox, transparent: isTransparent}"
        :data-uid="_uid">

        <template v-if="label != null && label != undefined">
            <template v-if="isBox">
                <div class="label-container">
                    <label :for="name">{{label}}</label>
                </div>

            </template>
            <template v-else>
                <label :for="name">{{label}}</label>
            </template>
        </template>
        
        <template v-if="type == 'mention'">
            <tribute :options="tributeOptions" 
                    :class="{empty: isEmpty}">
                <div
                    v-once
                    ref="input" 
                    class="content-editable"
                    contenteditable="true"
                    :placeholder="placeholder"
                    :disabled="isDisabled"
                    :name="name"

                    v-html="valueModel"
                    @tribute-replaced="handleMention"

                    v-on="inputListeners"  />
            </tribute>
        </template>
        <template v-else>
            <component
                :is="type === 'textarea' ? type : 'input'"
                ref="input"
                class="input"
                :type="type"

                :value.prop="valueModel"
                :checked.prop="valueModel"

                :name="name" 
                :placeholder="placeholder" 
                :disabled="isDisabled"

                v-on="inputListeners"/>
        </template>
    </component>
</template>

<script>
import bus from '@/bus'
import mentions from '@/assets/utils/mentions.js'

import VueTribute from "vue-tribute"

function getLastTextNodeIn(node) {
    while (node) {
        if (node.nodeType == 3) {
            return node;
        } else {
            node = node.lastChild;
        }
    }
}

function isRangeAfterNode(range, node) {
    
    var nodeRange, lastTextNode;
    if (range.compareBoundaryPoints) {
        nodeRange = document.createRange();
        lastTextNode = getLastTextNodeIn(node);
        if(lastTextNode)
            nodeRange.selectNodeContents(lastTextNode);
        nodeRange.collapse(false);
        return range.compareBoundaryPoints(range.START_TO_END, nodeRange) > -1;
    } else if (range.compareEndPoints) {
        if (node.nodeType == 1) {
            nodeRange = document.body.createTextRange();
            nodeRange.moveToElementText(node);
            nodeRange.collapse(false);
            return range.compareEndPoints("StartToEnd", nodeRange) > -1;
        } else {
            return false;
        }
    }
}

export default {
    name: 'x-input',
    components: {
        'tribute': VueTribute
    },
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        name: String,
        label: String,
        placeholder: String,

        value: {
            type: [String, Number, Boolean, Date],
            default: undefined
        },
        checked: {
            default: undefined
        },

        type: {
            type: String,
            default: 'text'
        },

        box: {
            type: [Boolean, String],
            default: false
        },
        disabled: {
            type: [Boolean, String],
            default: false
        },
        reactive: {
            type: [String, Boolean],
            default: true
        },
        transparent: {
            type: [String, Boolean],
            default: false
        },
        mentionOptions: {
            type: Object,
            default: () => ({})
        },
        source: undefined
    },
    data() {
        class Container{
            constructor(uid){
                this.uid = uid
            }

            get element(){
                return window.document.querySelector(`[data-uid="${this.uid}"]`)
            }

            appendChild(node){
                this.element.appendChild(node)
                return node
            }

            getBoundingClientRect(){
                return this.element.getBoundingClientRect()
            }

            get offsetHeight(){
                return this.element.offsetHeight
            }
        }

        let container
        if(this.type == 'mention') {
            container = new Container(this._uid)
        }

        return {
            uid: this._uid,
            tributeOptions: !this.type == 'mention' ? {} : Object.assign({}, {
                trigger: "@",
                positionMenu: true,
                values: (text, callback) => {
                    this.source(text, callback)
                },
                fillAttr: 'name',
                selectTemplate: mentions.template,
                lookup: function(entry, value){
                    return entry.name + ',' + entry.path.filter(i => i == 0 || !!i).join(',')
                },
                menuContainer: container
            }, this.mentionOptions || {}),
            isEmpty: this.value !== 0 && !this.value
        }
    },
    computed: {
        isReactive() {
            if(typeof this.reactive == 'boolean') return this.reactive
            else if(typeof this.reactive == 'string') return !!eval(this.reactive)
        },
        isDisabled() {
            if(typeof this.disabled == 'boolean') return this.disabled
            else if(typeof this.disabled == 'string') return !!eval(this.disabled)
        },
        isBox() {
            if(typeof this.box == 'boolean') return this.box
            else if(typeof this.box == 'string') return !!eval(this.box)
        },
        isTransparent() {
            if(typeof this.transparent == 'boolean') return this.transparent
            else if(typeof this.transparent == 'string') return this.transparent.toLowerCase() != 'false'
        },
        valueModel: {
            get () { 
                return mentions.parse(this.value, this.source)
            },
            set (value) {
                if(this.$props.type == 'checkbox'){
                    this.$emit('change', value)
                }else if(this.$props.type == 'text' || this.$props.type == 'textarea' || this.$props.type == 'mention'){
                    let v = value == "" ? undefined : value
                    this.isEmpty = !v

                    this.$emit('input', v)
                }
            },
        },
        inputListeners: function () {
            var vm = this
            // `Object.assign` mescla objetos para formar um novo objeto
            return Object.assign({},
                // Nós adicionamos todas as escutas do pai
                this.$listeners,
                // Então podemos adicionar escutas personalizadas ou substituir
                // comportamento de algumas escutas.
                {
                    // Isso garante que o componente funcione com o v-model
                    input: function (event) {
                        if(vm.$props.type == 'mention'){
                            vm.handleContentInput(event)
                        }else if(vm.$props.type == 'text' || vm.$props.type == 'textarea'){
                            vm.handleInput(event)
                        }
                    },
                    change: function(event){
                        if(vm.$props.type == 'checkbox'){
                            vm.handleChange(event)
                        }
                    }
                }
            )
        }
    },
    methods: {
        focus(){
            this.$refs.input.focus()
        },
        handleInput(event){
            this.valueModel = event.target.value
        },
        handleContentInput(event){
            this.valueModel = event.target.innerText
        },
        handleChange(event){
            this.valueModel = event.target.checked
        },
        handleMention(event){
            this.valueModel = event.target.innerText
            this.$emit('mention', event)
        },
        handleMentionClick(event){
            this.$emit('mention-click', event)
        },
        handleDelete(event){
            // console.log('DELETE', event)

            var sel, range, node, nodeToDelete, nextNode, nodeRange;
            if (event.keyCode == 8 || event.keyCode == 46) {
                event.preventDefault()

                // Get the DOM node containing the start of the selection
                if (window.getSelection && window.getSelection().getRangeAt) {
                    range = window.getSelection().getRangeAt(0);
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                }

                // console.log('RANGE', range)s
                
                if (range) {
                    node = event.target.lastChild;

                    if( node && node.nodeValue == ""){
                        node = node.previousSibling;
                    }

                    // console.log('LAST CHILD', event.target, node)

                    if( node && node.nodeType != 3 ){ // se não for um texto, se for uma tag
                        while (node) {
                            if ( isRangeAfterNode(range, node) ) { // ?
                                nodeToDelete = node;
                                break;
                            } else {
                                node = node.previousSibling;
                            }
                        }
                        
                        if (nodeToDelete) {                            
                            let sibling = nodeToDelete.previousSibling

                            console.log('DELETAR TAG NODE', nodeToDelete, range)
                            event.target.removeChild(nodeToDelete)

                            if(sibling.nodeType == 3 && sibling.length == 0)
                                event.target.removeChild(sibling)
                        }		 		 	 		         
                    }
                    else if(node){
                        var index = node.length-1;
                        if(index > 0){
                            console.log('DELETE CHAR', `[${node.data}] -> [${node.data.substr(0, node.data.length-1)}]`, `[${node.data[index]}]`)
                            node.deleteData(index,1);
                        }else if(index == 0){
                            // para o length == 1, então quer dizer que o texto é só um caractere
                            console.log('DELETE CHAR/TEXT NODE', node, `[${node.data}] -> [${node.data.substr(0, node.data.length-1)}]`, `[${node.data[index]}]`)
                            node.deleteData(index, 1)
                            event.target.removeChild(node);
                        }else{
                            console.log('DELETE TEXT NODE', node)
                            event.target.removeChild(node)
                        }
                    }
                    return false;
                }
                
            }
        },
        empty(){
            this.isEmpty = true
            if(this.$props.type == 'mention'){
                this.$refs.input.innerText = ''
            }else{
                this.$refs.input.value = ''
                this.$refs.input.checked = false
            }
        }
    },
    watch: {
        value: function(val){
            this.isEmpty = this.value !== 0 && !this.value
        }
    }
}
</script>

<style lang="sass" scoped>
    $box-width: 30px
    $radius: 10px

    .active
        label
            color: lightgray

    
    .box
        display: flex
        flex-direction: row-reverse
        justify-content: flex-end
        
        div.label-container
            position: relative
            width: 100%
            height: $box-width - $radius - 2px
            margin-top: $radius / 2 + 1px
            border: 1px solid black
            border-left: 0
            text-align: center

            > label
                position: absolute
                left: 0
                top: 1px
                transform: translate(0%, 50%)
                width: 100%
                font-size: 8px
                                       
        & > input
            &[type="checkbox"]
                appearance: none
                border: 1px solid black
                padding: $box-width / 2
                border-radius: $radius

                &:checked
                    background-color: black

            &[type="text"]
                width: $box-width
                height: $box-width - 2
                border: 1px solid black
                text-align: center
                border-radius: $radius

    
    .clean
        input:disabled
            background-color: white

    .transparent
        input::placeholder, input, label
            color: transparent !important

    .v-tribute
        &.empty 
            .content-editable
                &:before
                    content: attr(placeholder)
                    cursor: text
                    color: #bbb

                &:focus:before
                    opacity: 0

                &:focus
                    // padding-top: 15px

        .content-editable
            border: 1px lightgray solid

            font: inherit
            font-style: inherit
            font-variant-ligatures: inherit
            font-variant-caps: inherit
            font-variant-numeric: inherit
            font-variant-east-asian: inherit
            font-weight: inherit
            font-stretch: inherit
            font-size: inherit
            line-height: inherit
            font-family: inherit
                
            -webkit-writing-mode: horizontal-tb !important
            text-rendering: auto
            color: initial
            letter-spacing: normal
            word-spacing: normal
            text-transform: none
            text-indent: 0px
            text-shadow: none
            display: inline-block
            text-align: start
            -webkit-appearance: textfield
            -webkit-rtl-ordering: logical
            cursor: text

            display: flex
            align-items: center

            & /deep/ .mention
                background: rgba(green, 0.1)
                font-weight: bold
                cursor: pointer
                padding: 0 3px

    .x-input
        > /deep/ .tribute-container
                // position: absolute
                // top: 0
                // left: 0
                // height: auto
                // max-height: 300px
                // overflow-y: scroll
                // display: block
                // z-index: 999999
                // text-align: left

                > ul
                    background: white
                    text-align: left

                    > li
                        padding: 7.5px 10px
                        cursor: pointer
                        background: rgba(lightgray, 0.25)
                        text-align: left

                        span
                            font-size: 0.75em
                            opacity: 0.75

                            &::before
                                content: '@'

                        &.highlight
                            background: rgba(green, 0.2)
                            font-weight: bold

                            span
                                font-weight: 300

                            &:before
                                font-weight: bold

</style>

