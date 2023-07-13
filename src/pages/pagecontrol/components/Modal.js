import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import { Trans } from "@lingui/macro"
import city from 'utils/city'
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
        data.address = data.address.join(' ')
        onOk(data)
      })
      .catch(errorInfo => {
        console.log(errorInfo)
      })
  }

  render() {
    const { item = {}, onOk, form, ...modalProps } = this.props

    return (
      (<Modal {...modalProps} onOk={this.handleOk}>
        <Form ref={this.formRef} name="control-ref" initialValues={{ ...item, address: item.address && item.address.split(' ') }} layout="horizontal">
          <FormItem name='title' rules={[{ required: true }]}
            label={t`title`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name='url' rules={[{ required: true }]}
            label={t`url`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name='type' rules={[{ required: true }]}
            label={t`article`} hasFeedback {...formItemLayout}>
            <Radio.Group>
              <Radio value>
                <Trans>video</Trans>
              </Radio>
              <Radio value={false}>
                <Trans>article</Trans>
              </Radio>
            </Radio.Group>
          </FormItem>
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
