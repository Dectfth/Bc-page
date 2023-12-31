import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Layout, Avatar, Popover, Badge, List } from 'antd'
import { Ellipsis } from 'components'
import {
  BellOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Trans } from "@lingui/macro"
import { getLocale, setLocale } from 'utils'
import dayjs from 'dayjs'
import classnames from 'classnames'
import config from 'config'
import styles from './Header.less'

const { SubMenu } = Menu

class Header extends PureComponent {
  handleClickMenu = e => {
    e.key === 'SignOut' && this.props.onSignOut()
  }
  render() {
    const {
      fixed,
      avatar,
      username,
      collapsed,
      notifications,
      onCollapseChange,
      onAllNotificationsRead,
    } = this.props

    const rightContent = [
      <Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
        <SubMenu
          title={
            <Fragment>
              <span style={{ color: '#999', marginRight: 4 }}>
                <Trans>Hi,</Trans>
              </span>
              <span>{username}</span>
              <Avatar style={{ marginLeft: 8 }} src={avatar} />
            </Fragment>
          }
        >
          <Menu.Item key="SignOut">
            <Trans>Sign out</Trans>
          </Menu.Item>
        </SubMenu>
      </Menu>,
    ]

    if (config.i18n) {
      const { languages } = config.i18n
      const language = getLocale()
      const currentLanguage = languages.find(
        item => item.key === language
      )

    }


    return (
      <Layout.Header
        className={classnames(styles.header, {
          [styles.fixed]: fixed,
          [styles.collapsed]: collapsed,
        })}
        style={{height: 72, backgroundColor: 'white', paddingInline: 0}}
        id="layoutHeader"
      >
        <div
          className={styles.button}
          onClick={onCollapseChange.bind(this, !collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <div className={styles.rightContainer}>{rightContent}</div>
      </Layout.Header>
    )
  }
}

Header.propTypes = {
  fixed: PropTypes.bool,
  user: PropTypes.object,
  menus: PropTypes.array,
  collapsed: PropTypes.bool,
  onSignOut: PropTypes.func,
  notifications: PropTypes.array,
  onCollapseChange: PropTypes.func,
  onAllNotificationsRead: PropTypes.func,
}

export default Header
