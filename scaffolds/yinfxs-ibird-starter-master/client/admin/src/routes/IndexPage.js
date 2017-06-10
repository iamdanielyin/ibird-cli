import { connect } from "dva";
import { Dropdown, Icon, Layout, Menu } from "antd";
import { routerRedux } from "dva/router";
import { mapStateToProps, renderMenu } from "../utils/component";
import styles from "./IndexPage.less";
import { FOOTER, LOGIN_URI } from "../constants/config";
import * as menu from "../constants/menu";
import mapURIToComponents from "../constants/components";
const { Header, Content, Footer, Sider } = Layout;

function IndexPage({ username, pathname, code, collapsed, mode, dispatch }) {
  function onCollapse(collapsed) {
    dispatch({ type: 'index/collapse', payload: { collapsed } });
  }

  function logoutHandler() {
    dispatch({ type: 'login/signout' });
    dispatch(routerRedux.push(LOGIN_URI));
  }

  const Component = mapURIToComponents[pathname];
  const menuItems = renderMenu(menu);
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        breakpoint="lg"
        collapsed={collapsed}
        onCollapse={onCollapse}>
        <div className={styles.logo}/>
        <Menu theme="dark" mode={mode} defaultSelectedKeys={[code]}>{menuItems}</Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <div className={styles.user}>
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <span onClick={logoutHandler}><Icon type="poweroff"/> 退出</span>
                </Menu.Item>
              </Menu>}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="user"/> <span>{username}</span> <Icon type="down"/>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          {Component ? <Component/> : <div></div>}
        </Content>
        <Footer style={{ textAlign: 'center' }}>{FOOTER}</Footer>
      </Layout>
    </Layout>
  );
}

export default connect(mapStateToProps('index'))(IndexPage);
