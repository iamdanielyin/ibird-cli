import { Col, DatePicker, Form, Icon, Input, InputNumber, Menu, Switch } from "antd";
import moment from "moment";
import { Link } from "dva/router";
import _ from "lodash";
;
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;

/**
 * 转换状态值为属性值
 * @param key
 * @returns {function(*, *)}
 */
export function mapStateToProps(key) {
  return (state, ownProps) => {
    const loading = state.loading.models[key];
    let result = { loading };
    if (ownProps) {
      if (ownProps.location && ownProps.location.pathname) {
        result.pathname = ownProps.location.pathname;
      }
      if (ownProps.params && ownProps.params.code) {
        result.code = ownProps.params.code;
      }
    }
    result = state[key] ? Object.assign(state[key], result) : result;
    if (key === 'login') {
      console.log('mapStateToProps...', JSON.stringify(result, null, 2));
    }
    return result;
  }
}

/**
 * 根据服务端菜单配置数据渲染菜单
 * @param data
 * @returns {Array}
 */
export function renderMenu(data) {
  const result = [];
  for (const key in data) {
    const item = data[key];
    const { icon, name, uri } = item;
    if (item.children) {
      result.push(
        <SubMenu
          key={key} title={<span><Icon type={icon}/><span className="nav-text">{name}</span></span>}>
          {renderMenu(item.children)}
        </SubMenu>
      )
    } else {
      result.push(
        <Menu.Item key={key}>
          <Link to={{ pathname: uri }}><Icon type={icon}/><span
            className="nav-text">{name}</span></Link>
        </Menu.Item>
      );
    }
  }
  return result;
}

/**
 * 渲染表格列
 * @param fields
 * @param skip
 * @returns {Array}
 */
export function renderColumns(fields, skip = []) {
  skip = skip.concat(['_id', '__v', '_created', '_modified', '_creator', '_modifier', '_org', '_dr']);
  const time_format = 'YYYY-MM-DD HH:mm:ss';
  const columns = {};
  if (fields === null || typeof fields !== 'object' || Object.keys(fields).length === 0) return columns;
  for (const key in fields) {
    if (Array.isArray(skip) && skip.indexOf(key) >= 0) continue;
    const item = fields[key];
    if (!item.displayName) continue;
    const column = {
      title: item.displayName,
      // width: 150,
      dataIndex: key,
      key: key,
      sorter: (a, b) => {
        switch (item.type) {
          case 'number':
            return a - b;
          default:
            return a.length - b.length;
        }
      }
    };
    switch (key) {
      case '_created':
        column.render = (text, record) => text ? moment(text, 'X').format(time_format) : text;
        break;
      case '_modified':
        column.render = (text, record) => text ? moment(text, 'X').format(time_format) : text;
        break;
      case '_creator':
        column.render = (text, record) => (text && typeof text === 'object') ? `${text.username}${text.name ? `（${text.name}）` : ''}` : text;
        break;
      case '_modifier':
        column.render = (text, record) => (text && typeof text === 'object') ? `${text.username}${text.name ? `（${text.name}）` : ''}` : text;
        break;
      case '_org':
        column.render = (text, record) => (text && typeof text === 'object') ? `${text.code}${text.name ? `（${text.name}）` : ''}` : text;
        break;
    }
    columns[key] = column;
  }
  return columns;
}


/**
 * 计算所有列的宽度
 * @param columns
 * @returns {number}
 */
export function calcAllNotFixedColumnsWidth(columns) {
  if (!Array.isArray(columns) || columns.length === 0) return 0;
  let sum = 0;
  for (const column of columns) {
    if (!column || !column.width || column.fixed || (typeof column.width !== 'number')) continue;
    sum += column.width;
  }
  return sum;
}

/**
 * 对所有列重新排序
 * @param columns
 * @returns {*}
 */
export function resortAllColumns(columns) {
  if (!Array.isArray(columns) || columns.length === 0) return columns;
  const group = _.groupBy(columns, 'fixed');
  const left = group['left'] || [];
  const right = group['right'] || [];

  let others = [];
  for (const array of Object.values(_.omit(group, 'left', 'right'))) {
    others = others.concat(array);
  }

  const result = left.concat(others).concat(right);
  return result;
}
/**
 * 渲染表单项
 * @param fields
 * @param skip
 * @returns {Array}
 */
export function renderFormItems({ fields, skip = [], getFieldDecorator, initialValue, options = {} }) {
  skip = skip.concat(['_id', '__v']);
  if (!initialValue || !initialValue._id) {
    skip = skip.concat(['_created', '_modified', '_creator', '_modifier', '_org', '_dr']);
  }
  const time_format = 'YYYY-MM-DD HH:mm:ss';
  const items = {};
  if (fields === null || typeof fields !== 'object' || Object.keys(fields).length === 0) return items;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  for (const key in fields) {
    if (Array.isArray(skip) && skip.indexOf(key) >= 0) continue;
    const field = fields[key];
    const option = options[key] || {};
    const { control: _control, min, max } = option;
    const { displayName, required, type } = field;

    let disabled = option.disabled || false;
    if (!displayName) continue;
    const rules = [];
    if (required === true) {
      rules.push({
        required: true,
        message: `${displayName}不能为空`
      });
    }

    let placeholder = `请输入${displayName}`;
    let control = _control;
    if (['_creator', '_modifier', '_dr'].indexOf(key) >= 0) {
      disabled = true;
      placeholder = null;
    }
    if (['_created', '_modified'].indexOf(key) >= 0) {
      disabled = true;
      placeholder = null;
      control = <DatePicker showTime format={time_format} disabled={disabled} style={{ width: '100%' }}
                            placeholder={placeholder}/>;
      initialValue[key] = initialValue[key] ? moment(initialValue[key], 'X') : initialValue[key];
    }
    if (!control) {
      switch (type) {
        case 'number':
          placeholder = `请填写${displayName}`;
          control = <InputNumber min={min || field.minimum} max={max || field.maximum} disabled={disabled}
                                 style={{ width: '100%' }}
                                 placeholder={placeholder}/>;
          break;
        case 'boolean':
          control = <Switch disabled={disabled}
                            defaultChecked={initialValue[key]}/>;
          break;
        default:
          control = <Input placeholder={placeholder} disabled={disabled} style={{ width: '100%' }}/>;
          break;
      }
    }
    const item = (
      <Col span={8} key={key} xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 6 }}>
        <FormItem
          {...formItemLayout}
          label={displayName}
          size='small'
          hasFeedback>
          {
            getFieldDecorator(key, {
              initialValue: initialValue[key],
              rules: rules,
            })(control)
          }
        </FormItem>
      </Col>
    );
    items[key] = item;
  }
  return items;
}
