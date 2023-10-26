import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Upload, Modal, message,Button } from 'antd'
import store from 'store'
import { apiPrefix } from 'utils/config'
const { Dragger } = Upload;
class UserModal extends PureComponent {
  handleOk = () => {
    const { onOk } = this.props;
    onOk();
  };

  render() {
    const { dispatch, item = {}, onOk, ...modalProps } = this.props;
    const draggerProps = {
      name: 'file',
      multiple: true,
      headers: {
        Token:  store.get('Token')
      },
      action: `${apiPrefix}/manager/article/import/faq`,
      onChange(info) {
        const { status } = info.file;
        console.log(info,'..info');
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name}上传成功！`)
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败！`)
        }
      },
      onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
      },
    };
    return (
      <Modal {...modalProps} onOk={this.handleOk}
      footer={[
        <Button  onClick={this.handleOk}>
          OK
        </Button>,
      ]}
      layout="horizontal">
        <Dragger
          {...draggerProps}
        >
          <p className="ant-upload-text">
            <span>点击上传文件</span>
            或者拖拽上传
          </p>
          <p className="ant-upload-hint">
            上传成功即已导入
          </p>
        </Dragger>
      </Modal>
    );
  }
}

UserModal.propTypes = {
  item: PropTypes.object,
  onOk: PropTypes.func,
};

export default UserModal;
 