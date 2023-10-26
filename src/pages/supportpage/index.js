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

@connect(({ supportpage, loading }) => ({ supportpage, loading }))
class User extends PureComponent {
  handleRefresh = newQuery => {
    const { location,dispatch } = this.props
    const {searchQuery} = this.state || {}
    dispatch({
      type: `supportpage/query`,
      payload: {
        contentType:'support',
        ...searchQuery,
        ...newQuery,
      },
    })
  }


  get modalProps() {
    const { dispatch, supportpage, loading } = this.props
    const { currentItem, modalOpen, modalType, pagination } = supportpage
    return {
      item: modalType === 'create' ? {} : currentItem,
      open: modalOpen,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`supportpage/${modalType}`],
      modalType:modalType,
      title: `${
        modalType === 'create' ? t`Add support Page ` : t`Update Page`
      }`,
      centered: true,
      //  区分add 和update,因为在保存的时候add是回首页，update是在当前页
      onOk: data => {
        dispatch({
          type: `supportpage/${modalType}`,
          payload: {
            contentType:'support',
            articleType:0,
            ...data
          },
        }).then(() => {
          let curtpage =  modalType === 'create' ? 1 : pagination.current
          let curtsize  = modalType === 'create' ? 10 : pagination.pageSize
          this.handleRefresh(
            {
              currentPage: curtpage,
              size: curtsize,
            }
          )
        })
      },
      onCancel() {
        dispatch({
          type: 'supportpage/hideModal',
        })
      },
    }
  }

  get listProps() {
    const { dispatch, supportpage, loading } = this.props
    const { list=[], pagination, selectedRowKeys=[] } = supportpage
    return {
      dataSource: list,
      loading: loading.effects['supportpage/query'],
      pagination,
      onChange: page => {
        this.handleRefresh({
          currentPage: page.current,
          size: page.pageSize,
        })
      },
      onDeleteItem: id => {
        dispatch({
          type: 'supportpage/delete',
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
          type: 'supportpage/showModal',
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
            type: 'supportpage/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  }

  get filterProps() {
    const { location,supportpage, dispatch } = this.props
    const { pagination } = supportpage
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
          type: 'supportpage/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
      onInitPage: () => {
        dispatch({
          type: 'pagecontrol/init',
          payload:  {
            contentType:'support',
            parentPageIds:[392]
          },
        }).then(() => {
          this.handleRefresh({
            currentPage: 1,
            size: pagination.pageSize,
          })
        })
      },
    }
  }

  render() {
    const { supportpage } = this.props
    const { selectedRowKeys } = supportpage
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>

          </Row>
        )}
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

User.propTypes = {
  supportpage: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default User
