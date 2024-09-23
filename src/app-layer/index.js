import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./store";
import buildConfig from "./util/buildConfig";

const appLayerWrapper = document.querySelector('[data-app-layer="main"]');
const config = buildConfig(appLayerWrapper.dataset);
export const store = configureStore(config);

const initAppLayer = () => {
  const appLayerWrapper = document.querySelector('[data-app-layer="main"]');
  const config = buildConfig(appLayerWrapper.dataset);
  const store = configureStore(config);

  // Render some shit
  ReactDOM.render(
    <Provider store={store}>
      <App />
      {/* <App config={{ ...config.config }}/> */}
    </Provider>,
    appLayerWrapper,
  );
};

initAppLayer();
