import { Link, routerRedux } from "dva/router";
import { Breadcrumb, Button, message, Popconfirm, Table } from "antd";
import styles from "./List.less";
import moment from "moment";
const ButtonGroup = Button.Group;

export function ModelList(key, name, columns, tableOptions = {}) {
  return function (props) {
    const { dispatch, loading, totalrecords } = props;
    let { page, size, range, sort, cond, list } = props;

    /**
     * 刷新页面
     * @param query
     */
    function pushHanlder(query) {
      const _default = { page, size, range, sort, cond: JSON.stringify(cond, null, 0) };
      dispatch(routerRedux.push({
        pathname: `/${key}`,
        query: query ? Object.assign(_default, query) : _default,
      }));
    }

    /**
     * 过滤或者排序变更
     * @param pagination
     * @param filters
     * @param sorter
     */
    function onChangeHandler(pagination, filters, sorter) {
      const { current, pageSize } = pagination;
      const { field, order } = sorter;
      sort = { ascend: field, descend: `-${field}` }[order];
      pushHanlder({ sort, page: current, size: pageSize });
    }

    let selectedRowKeysCache = null;

    /**
     * 选择框事件
     * @type
     */
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selectedRowKeysCache = selectedRowKeys;
      },
      getCheckboxProps: record => {
        // 选择框是否可用
        return { disabled: false }
      },
    };


    /**
     * 批量按钮
     */
    function batchDeleteHandler() {
      if (!selectedRowKeysCache || selectedRowKeysCache.length === 0) return message.warn('请先选中需要删除的行');
      deleteHandler({ _id: { $in: selectedRowKeysCache } });
    }

    /**
     * 删除处理
     */
    function deleteHandler(cond) {
      dispatch({
        type: 'model/remove',
        payload: { key, cond, action: `${key}/reload`, backup: () => message.success('删除成功') }
      });
    }

    /**
     * 跳转编辑页面
     */
    function editHandler(_id) {
      dispatch(routerRedux.push({
        pathname: `/${key}/form`,
        query: _id ? { _id } : {},
      }));
    }

    /**
     * 跳转新增页面
     */
    function createHandler() {
      dispatch(routerRedux.push({
        pathname: `/${key}/form`
      }));
    }

    /**
     * 刷新按钮
     */
    function refreshHandler() {
      pushHanlder();
    }

    let lastime = null, lastindex = 0;

    /**
     * 行点击时间
     */
    function rowClickHandler(record, index) {
      let now = moment().unix();
      if (!lastime || lastindex !== index || (now - lastime) > 1) {
        lastime = now;
        lastindex = index;
        return;
      }
      lastime = now;
      lastindex = index;

      if (!record || !record._id) return;
      editHandler(record._id);
    }

    return (
      <div>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>
            <Link to={{ pathname: '/' }}>主页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{name}</Breadcrumb.Item>
        </Breadcrumb>

        <div className={styles.normal}>
          <div className={styles.buttons}>
            <ButtonGroup>
              <Button type="primary" onClick={createHandler}>新增</Button>
              <Popconfirm title="确认删除所有选中行吗？删除后不可恢复！" onConfirm={batchDeleteHandler}>
                <Button type="primary">删除</Button>
              </Popconfirm>
              <Button type="primary" onClick={refreshHandler}>刷新</Button>
            </ButtonGroup>
          </div>
          <Table dataSource={list}
                 rowKey={record => record._id}
                 rowSelection={rowSelection}
                 columns={columns}
                 size="small"
                 bordered
                 onRowClick={rowClickHandler}
                 pagination={{
                   total: totalrecords,
                   current: page,
                   pageSize: size
                 }}
                 loading={loading}
                 scroll={tableOptions.scroll}
                 onChange={onChangeHandler}/>
        </div>
      </div>
    );
  }
}
