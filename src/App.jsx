import { Toaster } from "react-hot-toast";
import "./App.css";
import AllRoutes from "./Routes/AllRoutes";

function App() {
  return (
    <div className="App">
       <Toaster position="bottom-center" />
      <AllRoutes />
    </div>
  );
}

export default App;
