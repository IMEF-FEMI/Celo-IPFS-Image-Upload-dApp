import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Main from "./components/layout/Main";
import Images from "./components/images/Images";
import UploadImage from "./components/image/UploadImage";
import ImageDetail from "./components/image/ImageDetail";
import NotFound from "./components/notFound/NotFound";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Main>
            <Switch>
              <Route exact path="/" component={Images} />
              <Route exact path="/uploadimage" component={UploadImage} />
              <Route exact path="/images/:index" component={ImageDetail} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
