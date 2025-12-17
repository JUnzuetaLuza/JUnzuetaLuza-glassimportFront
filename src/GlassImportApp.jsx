import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { AppRouter } from "./router/AppRouter";
import store from "./stores/store";

export const GlassImportApp = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
};
