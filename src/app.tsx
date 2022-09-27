import { createRoot } from "react-dom/client";
import { Layout } from "./components/Layout";
import { StoreProvider } from "./hooks/useStore";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

function render() {
  root.render(
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}

render();
