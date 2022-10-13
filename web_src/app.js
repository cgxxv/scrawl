import React from "react";
import {Routes, Route} from "react-router-dom";

import {axiosWrapper} from "./utils";
import {SWRConfig} from "swr";
import {AppContextProvider} from "./context";
import Welcome from "./welcome";
import Todo from "./todo";

const swrConfig = {
  fetcher: async (url) => axiosWrapper(url, { method: 'GET' }),
  shouldRetryOnError: false,
  revalidateOnFocus: false,
};

const App = () => {
  return (
    <React.StrictMode>
      <SWRConfig value={swrConfig}>
        <AppContextProvider>
          <Routes>
            <Route path="/" element={<Todo />} />
            <Route path="/hello" element={<p>Hello world.</p>} />
            <Route path="/welcome" element={<Welcome />} />
          </Routes>
        </AppContextProvider>
      </SWRConfig>
    </React.StrictMode>
  );
};

export default App;
