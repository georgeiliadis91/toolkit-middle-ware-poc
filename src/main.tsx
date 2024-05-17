import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";

const domNode = document.getElementById("root");

if (domNode) {
  createRoot(domNode).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
