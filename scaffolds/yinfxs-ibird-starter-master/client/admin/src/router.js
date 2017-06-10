import { Route, Router } from "dva/router";
import IndexPage from "./routes/IndexPage";
import Login from "./routes/Login";


function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage}/>
      <Route path="/login" component={Login}/>
      <Route path="/:code" component={IndexPage}/>
      <Route path="/:code/form" component={IndexPage}/>
    </Router>
  );
}

export default RouterConfig;
