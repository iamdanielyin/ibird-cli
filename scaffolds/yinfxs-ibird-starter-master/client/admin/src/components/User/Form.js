/**
 * 完全自定义表单页面-模板
 */
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Breadcrumb, Button, Card, Form, Input, message, Popconfirm, Row } from "antd";
import { mapStateToProps, renderFormItems } from "../../utils/component";
import _ from "lodash";
import moment from "moment";
import fields from "../../constants/fields";
const ButtonGroup = Button.Group;
const key = 'user';

function ModelForm({ dispatch, formData: record, token, form: { getFieldDecorator, validateFieldsAndScroll } }) {
  const _formItems = renderFormItems({
    fields: fields[key],
    getFieldDecorator: getFieldDecorator,
    initialValue: record,
    options: {
      password: {
        control: <Input type='password' placeholder={`请输入密码`}/>
      }
    }
  });

  let back = false;

  /**
   * 新增操作
   */
  function createHandler(values) {
    if (token && token.user) {
      const { _org, _id } = token.user;
      values._creator = _id || null;
      if (_org) values._org = _org._id || _org || null;
    }
    values._created = moment().unix();
    dispatch({
      type: 'model/create',
      payload: {
        key,
        doc: values,
        backup: back ? () => {
          successMessage();
          backHandler();
        } : () => {
          refreshHandler();
          successMessage();
        }
      }
    });
  }

  /**
   * 修改操作
   */
  function updateHandler(id, values) {
    if (token && token.user) {
      const { _org, _id } = token.user;
      values._modifier = _id || null;
      if (_org) values._org = _org._id || _org || null;
    }
    values._modified = moment().unix();
    dispatch({
      type: 'model/update',
      payload: {
        key,
        cond: { _id: id },
        doc: values,
        backup: back ? () => {
          successMessage();
          backHandler();
        } : () => {
          refreshHandler();
          successMessage();
        }
      },
    });
  }

  /**
   * 提交操作
   */
  function submitHandler() {
    validateFieldsAndScroll(function (errors, values) {
      if (errors) return;
      values = _.omit(values, '_created', '_modified', '_creator', '_modifier', '_dr');
      if (record._id) {
        updateHandler(record._id, values);
      } else {
        createHandler(values);
      }
    });
  }

  /**
   * 删除操作
   */
  function deleteHandler() {
    if (!record || !record._id) return;
    dispatch({ type: 'model/remove', payload: { key, cond: { _id: record._id }, backup: backHandler } });
  }

  /**
   * 刷新操作
   */
  function refreshHandler() {
    if (!record || !record._id) return;
    dispatch({ type: 'model/id', payload: { key, id: record._id, action: `${key}/formData` } });
  }

  /**
   * 删除操作
   */
  function backHandler() {
    dispatch(routerRedux.push({
      pathname: `/${key}`
    }));
  }

  /**
   * 全局提示
   */
  function successMessage() {
    message.success('保存成功！');
  }

  /**
   * 保存并返回
   */
  function saveAndBackHandler() {
    back = true;
    submitHandler();
  }

  return (
    <div className='ibird-form'>
      <Breadcrumb style={{ margin: '12px 0' }}>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
        <Breadcrumb.Item>用户</Breadcrumb.Item>
      </Breadcrumb>
      <Card title="编辑用户" bordered={false}
            extra={
              <div>
                <ButtonGroup>
                  <Button type='primary' icon='reload' onClick={refreshHandler}>刷新</Button>
                  <Popconfirm title="确认删除吗？删除后无法撤销！" onConfirm={deleteHandler}>
                    <Button type='danger' icon='close'>删除</Button>
                  </Popconfirm>
                </ButtonGroup>
              </div>
            }>
        <Row gutter={8}>
          <Form onSubmit={submitHandler}>
            {Object.values(_formItems)}
          </Form>
        </Row>
        <Row>
          <ButtonGroup>
            <Button type='primary' icon='save' onClick={submitHandler}>保存</Button>
            <Button type='primary' icon='rollback' onClick={saveAndBackHandler}>保存并返回</Button>
          </ButtonGroup>
          <ButtonGroup style={{ marginLeft: '5px' }}>
            <Button type='primary' icon='left' onClick={backHandler}>返回</Button>
          </ButtonGroup>
        </Row>
      </Card>
    </div>
  )
}

export default connect(mapStateToProps(key))(Form.create()(ModelForm));
