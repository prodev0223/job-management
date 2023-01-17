import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { persistor, store } from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from "./contexts/ThemeContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { LayoutProvider } from "./contexts/LayoutContext";

import reportWebVitals from "./utils/reportWebVitals";
import App from "./App";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <ThemeProvider>
          <SidebarProvider>
            <LayoutProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </LayoutProvider>
          </SidebarProvider>
        </ThemeProvider>
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
