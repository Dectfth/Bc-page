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

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>文章名字</Trans>,
        dataIndex: 'pageName',
        width: '18s%',
        key: 'pageName',
      },
      {
        title: <Trans>	搜索命中高亮问题</Trans>,
        dataIndex: 'hlQuestion',
        key: 'hlQuestion',
        width: '20%',
      },
      {
        title: <Trans>搜索命中高亮答案</Trans>,
        dataIndex: 'hlAnswer',
        key: 'hlAnswer',
        width: '25%',
      },
      {
        title: <Trans>URL</Trans>,
        dataIndex: 'pageUrl',
        key: 'pageUrl',
        render: text => <a href={`https://www.renogy.com${text}`} key={text} target='_blank'>{text}</a>
      },
      {
        title: <Trans>创建时间</Trans>,
        dataIndex: 'ts',
        key: 'ts',
        width: 150,
        render:(record) =>{
          return moment(record).format('YYYY-MM-DD HH:mm')
        }
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
