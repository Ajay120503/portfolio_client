import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import ThemeController from "./components/ui/ThemeController";

function App() {
  return (
    <BrowserRouter>
      <ThemeController />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
