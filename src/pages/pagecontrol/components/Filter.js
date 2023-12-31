import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { FilterItem } from 'components'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"
import { Button, Row, Col, DatePicker, Form, Input, Cascader } from 'antd'
import city from 'utils/city'
import styles from './List.less'

const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

class Filter extends Component {
  formRef = React.createRef()

  handleFields = fields => {
    const { createTime } = fields
    if (createTime && createTime.length) {
      fields.createTime = [
        dayjs(createTime[0]).format('YYYY-MM-DD'),
        dayjs(createTime[1]).format('YYYY-MM-DD'),
      ]
    }
    return fields
  }

  handleSubmit = () => {
    const { onFilterChange } = this.props
    const values = this.formRef.current.getFieldsValue()
    const fields = this.handleFields(values)
    onFilterChange(fields)
  }

  handleReset = () => {
      // 重置current 1
    const fields = this.formRef.current.getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    this.formRef.current.setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { onFilterChange } = this.props
    let fields = this.formRef.current.getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }
  render() {
    const { onAdd, onInitPage, filter } = this.props
    const { title, id } = filter

    let initialCreateTime = []
    if (filter.createTime && filter.createTime[0]) {
      initialCreateTime[0] = dayjs(filter.createTime[0])
    }
    if (filter.createTime && filter.createTime[1]) {
      initialCreateTime[1] = dayjs(filter.createTime[1])
    }

    return (
      <Form ref={this.formRef} name="control-ref" initialValues={{ title,id }} className={styles.prmodel} >
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <Form.Item name="title">
              <Search
                placeholder={t`Search title`}
                onSearch={this.handleSubmit}
              />
            </Form.Item>
          </Col>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <Form.Item name="pageId">
              <Search
                placeholder={t`Search pageId`}
                onSearch={this.handleSubmit}
              />
            </Form.Item>
          </Col>
         
          <Col
            {...TwoColProps}
            xl={{ span: 16 }}
            md={{ span: 8 }}
            sm={{ span: 24 }}
          >
            <Row type="flex" align="middle" justify="space-between">
              <div>
                <Button
                  type="primary" htmlType="submit"
                  className="margin-right"
                  onClick={this.handleSubmit}
                >
                  <Trans>Search</Trans>
                </Button>
                <Button
                  className="margin-right"
                  onClick={this.handleReset}>
                  <Trans>Reset</Trans>
                </Button>
          
              </div>
              <div>
                <Button
                  className="margin-right"
                  onClick={onInitPage}>
                 <Trans>InitAllArticle</Trans>
                </Button>
                <Button type="primary" onClick={onAdd}>
                  <Trans>Create</Trans>
                </Button>
              </div>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
