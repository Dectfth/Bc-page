import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Row, Col } from 'antd'
import { Trans } from "@lingui/macro"
import city from 'utils/city'
import styles from './List.less'
import { t } from "@lingui/macro"

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

console.log(styles,'.styles');
class UserModal extends PureComponent {
  formRef = React.createRef()

  handleOk = () => {
    const { item = {}, onOk } = this.props
    this.formRef.current.validateFields()
      .then(values => {
        const data = {
          ...values,
          key: item.key,
        }
        onOk(data)
      })
      .catch(errorInfo => {
        console.log(errorInfo)
      })
  }

  render() {
    const { item = {}, onOk,pagecontrol,modalType, form, ...modalProps } = this.props
    

    return (
      (<Modal {...modalProps} onOk={this.handleOk} layout="horizontal">
        <Form className={styles['modalpopup']}   ref={this.formRef} name="control-ref" initialValues={{ ...item, pageId: item.id, address: item.address && item.address.split(' ') }} layout="horizontal">
          <FormItem name='pageId' rules={[{ required: true }]}
            label={t`pageId`} hasFeedback {...formItemLayout}>
            <InputNumber  />
          </FormItem>
        {modalType === 'update'?
          <>
            <FormItem name='title' rules={[{ required: true }]}
            label={t`title`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
  
          </>:''
        }
        </Form>
      </Modal>)
    );
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
