import { connect } from "dva";

import { Button, Checkbox, Form, Input } from "antd";
import { mapStateToProps } from "../utils/component";
import { LOGO, NAME } from "../constants/config";
import styles from "./Login.less";
const FormItem = Form.Item;

function Login(props) {
  const { username, password, remember, loading = false, dispatch } = props;
  const { form: { getFieldDecorator, validateFieldsAndScroll } } = props;
  // 处理验证
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      // 触发接口调用
      dispatch({ type: 'login/signin', payload: values })
    })
  }

  return (
    <div className={styles.login}>
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt={'logo'} src={LOGO}/>
          <span>{NAME}</span>
        </div>
        <form>
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '账号不能为空'
                },
              ],
              initialValue: username
            })(<Input size="large" onPressEnter={handleOk} placeholder="账号"/>)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '密码不能为空'
                },
              ],
              initialValue: password
            })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码"/>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: remember || true,
            })(
              <Checkbox>记住我</Checkbox>
            )}
            <Button type="primary" size="large" onClick={handleOk} loading={loading}>登录</Button>
          </FormItem>
        </form>
      </div>
    </div>
  );
}

const LoginForm = Form.create()(Login);
export default connect(mapStateToProps('login'))(LoginForm);

