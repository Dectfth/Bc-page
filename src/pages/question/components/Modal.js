import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col,Upload, Icon, message } from 'antd'
import { Trans } from "@lingui/macro"
import city from 'utils/city'
import styles from './List.less'
import { t } from "@lingui/macro"

const { Dragger } = Upload;
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class UserModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
}
  formRef = React.createRef()

  handleOk = () => {
    const { item = {}, onOk } = this.props
    const { file } = this.state;
    onOk(file)
  }
  handleFileChange = (event) => {
    console.log(event,'..event');
    const file = event.file
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
    console.log(formData,'..');
  };
  render() {
    const { item = {}, onOk,questions,modalType, form, ...modalProps } = this.props
    

    return (
      <Modal {...modalProps} onOk={this.handleOk} layout="horizontal">
        <Dragger
          name="file"
          beforeUpload={() => false}
          onChange={this.handleFileChange}
          showUploadList={true}
        >
          <p className="ant-upload-text">
            <span>点击上传文件</span>
            或者拖拽上传
          </p>
        </Dragger>
      </Modal>
    );
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
