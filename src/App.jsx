import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import ThemeController from "./components/ui/ThemeController";
import GeometricDragon from "./pages/public/GeometricDragon";

function App() {
  return (
    <BrowserRouter>
      <ThemeController />
      <GeometricDragon />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
