import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { t } from "@lingui/macro"
import { Trans } from "@lingui/macro"
import { Link } from 'umi'
import moment from 'moment'
import styles from './List.less'

const { confirm } = Modal

class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props

    if (e.key === '1') {
      onEditItem(record)
      // confirm({
      //   title: t`Are you sure update this record?`,
      //   onOk() {
      //     onDeleteItem(record.id)
      //   },
      // })
    } else if (e.key === '2') {
      confirm({
        title: t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>pageID</Trans>,
        dataIndex: 'id',
        key: 'id',
        width: '7%',
      },
      {
        title: <Trans>文章名字</Trans>,
        dataIndex: 'title',
        width: '20%',
        key: 'title',
      },
      {
        title: <Trans>URL</Trans>,
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: <Trans>article Type</Trans>,
        dataIndex: 'articleType',
        key: 'articleType',
        width: '7%',
        render: text => <span>{text == 1 ? 'Article' :text == 1 ?'Video':'无' }</span>
      },
      {
        title: <Trans>文章分类</Trans>,
        dataIndex: 'category',
        width: '20%',
        key: 'category',
      },
      {
        title: <Trans>创建时间</Trans>,
        dataIndex: 'ts',
        key: 'ts',
        width: 180,
        render:(record) =>{
          return moment(record).format('YYYY-MM-DD HH:mm')
        }
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        fixed: 'right',
        width: '8%',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: t`Update` },
                { key: '2', name: t`Delete` },
              ]}
            />
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
