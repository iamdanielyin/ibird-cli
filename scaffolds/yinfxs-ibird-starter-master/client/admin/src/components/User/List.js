/**
 * 完全自定义列表页面-模板
 */

import { connect } from "dva";
import { assign } from "../../utils/utility";
import { routerRedux } from "dva/router";
import { Breadcrumb, Button, message, Popconfirm, Table } from "antd";
import { calcAllColumnsWidth, mapStateToProps, renderColumns } from "../../utils/component";
import fields from "../../constants/fields";
import styles from "./List.less";
import moment from "moment";
const ButtonGroup = Button.Group;
const key = 'user';

function ModelList(props) {
  const { dispatch, loading, totalrecords } = props;
  let { page, size, range, sort, cond, list } = props;
  const _cols = renderColumns(fields[key], ['password']);
  assign(_cols,
    {
      avatar: {
        render: (text, record) => {
          return text ? <img src={text} style={{ height: '40px' }}/> : text;
        }
      },
      COLUMN_OPERATION: {
        title: '操作',
        width: 120,
        key: 'COLUMN_OPERATION',
        render: (text, record) => (
          <div>
            <Button size="small" onClick={editHandler.bind(null, record._id)}>编辑</Button>
            <Popconfirm title="确认删除吗？删除后不可恢复！" onConfirm={rowDeleteHandler.bind(null, record._id)}>
              <Button size="small" type='danger'>删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  );


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
   * 行删除
   * @param _id
   */
  function rowDeleteHandler(_id) {
    deleteHandler({ _id });
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
      // 选择行后回调事件
      // selectedRowKeys：选择行的Key组合，英文逗号分隔
      // selectedRows：选择行数据，数组
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

  const columns = Object.values(_cols);

  return (
    <div>
      <Breadcrumb style={{ margin: '12px 0' }}>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
        <Breadcrumb.Item>用户</Breadcrumb.Item>
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
               onChange={onChangeHandler}/>
      </div>
    </div>
  );
}

export default connect(mapStateToProps(key))(ModelList);
