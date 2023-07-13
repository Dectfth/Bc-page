import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Row, Col, Button, Popconfirm } from 'antd'
import { t } from "@lingui/macro"
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

@connect(({ pagecontrol, loading }) => ({ pagecontrol, loading }))
class User extends PureComponent {
  handleRefresh = newQuery => {
    const { location,dispatch } = this.props
    const { query, pathname } = location

    dispatch({
      type: `pagecontrol/query`,
      payload: {
        ...query,
        ...newQuery,
      },
    })
  }



  get modalProps() {
    const { dispatch, pagecontrol, loading } = this.props
    const { currentItem, modalOpen, modalType } = pagecontrol

    return {
      item: modalType === 'create' ? {} : currentItem,
      open: modalOpen,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`pagecontrol/${modalType}`],
      title: `${
        modalType === 'create' ? t`Create Page ` : t`Update Page`
      }`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `pagecontrol/${modalType}`,
          payload: data,
        }).then(() => {
          this.handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'pagecontrol/hideModal',
        })
      },
    }
  }

  get listProps() {
    const { dispatch, pagecontrol, loading } = this.props
    const { list=[], pagination, selectedRowKeys=[] } = pagecontrol

    return {
      dataSource: list,
      loading: loading.effects['pagecontrol/query'],
      pagination,
      onChange: page => {
        this.handleRefresh({
          currentPage: page.current,
          size: page.pageSize,
        })
      },
      onDeleteItem: id => {
        dispatch({
          type: 'pagecontrol/delete',
          payload: id,
        }).then(() => {
          this.handleRefresh({
            page:
              list.length === 1 && pagination.current > 1
                ? pagination.current - 1
                : pagination.current,
          })
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'pagecontrol/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'pagecontrol/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  }

  get filterProps() {
    const { location, dispatch } = this.props
    const { query } = location

    return {
      filter: {
        ...query,
      },
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
      onAdd() {
        dispatch({
          type: 'pagecontrol/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }
  }

  render() {
    const { pagecontrol } = this.props
    const { selectedRowKeys } = pagecontrol

    return (
      <Page inner>
        <Filter {...this.filterProps} />
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={this.handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

User.propTypes = {
  pagecontrol: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default User
