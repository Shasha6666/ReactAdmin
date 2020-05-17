import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Editor} from 'react-draft-wysiwyg'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html' 
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/* 用来指定商品详情信息的富文本编程器组件*/
export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    constructor(props) {
        super(props)
        const html = this.props.detail
        let editorState
        if(html) { // 如果有值，根据html格式创建一个
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            editorState = EditorState.createWithContent(contentState)
        } else {
            editorState = EditorState.createEmpty()
        }
        this.state = {
            editorState
        }
    }
    // 输入过程中实时回调
    onEditorStateChange = (editorState) => { 
        this.setState({ 
            editorState 
        }) 
    }
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.open('POST', '/manage/img/upload')
              const data = new FormData()
              data.append('image', file)
              xhr.send(data)
              xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText)
                const url = response.data.url
                resolve({data:{link:url}})
              })
              xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText)
                reject(error)
              })
            }
          )
    }
    render() {
        const {editorState} = this.state
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },}}
            />
        )
    }
}
