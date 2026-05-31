import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import ThemeController from "./components/ui/ThemeController";
import GeometricDragon from "./pages/public/GeometricDragon";
import FloatingObjects from "./pages/public/FloatingObjects";

function App() {
  return (
    <BrowserRouter>
      <ThemeController />
      <GeometricDragon />
      <FloatingObjects />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
