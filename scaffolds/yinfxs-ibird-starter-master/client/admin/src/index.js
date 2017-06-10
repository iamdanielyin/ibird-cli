import dva from "dva";
import createLoading from "dva-loading";
import { message } from "antd";
import { cache } from "./utils/app";
import moment from "moment";
import "./index.less";
import { ERROR_MSG_DURATION } from "./constants/config";
moment.locale('zh-cn');

// 1. 系统初始化
const app = dva({
  // history: browserHistory,
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
});

// 2. 挂载应用中间件
app.use(createLoading());

// 3. 挂载前端模型
app.model(require("./models/login"));
app.model(require("./models/index"));
app.model(require("./models/model"));

app.model(require("./models/stds/user"));

// 4. 挂载前端路由
app.router(require('./router'));

// 5. 启动应用
app.start('#root');

cache(app);
