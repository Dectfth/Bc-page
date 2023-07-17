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
    const {searchQuery} = this.state || {}
    dispatch({
      type: `pagecontrol/query`,
      payload: {
        ...searchQuery,
        ...newQuery,
      },
    })
  }



  get modalProps() {
    const { dispatch, pagecontrol, loading } = this.props
    const { currentItem, modalOpen, modalType } = pagecontrol
    console.log(loading.effects, 'loading.effects')
    return {
      item: modalType === 'create' ? {} : currentItem,
      open: modalOpen,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`pagecontrol/${modalType}`],
      modalType:modalType,
      title: `${
        modalType === 'create' ? t`Add Page ` : t`Update Page`
      }`,
      centered: true,
      //  区分add 和update,因为在保存的时候add是回首页，update是在当前页
      onOk: data => {
        dispatch({
          type: `pagecontrol/${modalType}`,
          payload: data,
        }).then(() => {
          this.handleRefresh(
            {
              currentPage: 1,
              size: 10,
            }
          )
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
            currentPage: pagination.current,
            size: pagination.pageSize,
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
        type: 'radio',
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
        this.setState({
          searchQuery: { ...value },
        }, () => {
          this.handleRefresh({
            currentPage: 1,
            size: 10,
            ...value,
          });
        });
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
