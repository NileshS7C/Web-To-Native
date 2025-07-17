import { Toaster } from "react-hot-toast";
import "./App.css";
import AllRoutes from "./Routes/AllRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMobileConfig } from "./redux/WebToNative/webToNativeSlice";

function App() {
  // const platform = useSelector((state) => state.wtn.platform);
  const APP_SECRET = import.meta.env.VITE_APP_SECRET;
  console.log("app secret", APP_SECRET)
  const dispatch = useDispatch();
  useEffect(() => {
    window.handleMobileConfig = (secret = "", platform = "browser") => {
      if (secret !== APP_SECRET) {
        alert('Unauthorized config attempt!');
        return false;
      }
      const validPlatforms = ['android', 'ios'];
      if (
        validPlatforms.includes((platform || '').toLowerCase())
      ) {
        dispatch(setMobileConfig({
          platform: platform.toLowerCase(),
        }));
        return true;
      } else {
        alert('Invalid config: platform must be "android" or "ios" and isMobileApp must be a boolean.');
        return false;
      }
    };
    return () => {
      delete window.handleMobileConfig;
      console.log("Script loaded")
    };
  }, []);

  // useEffect(() => {
  //   if (platform === 'ios' || platform === 'android') {
  //     console.log("Script loaded successfully")
  //   }
  // }, [platform]);

  return (
    <div className="App">
      <Toaster position="bottom-center" />
      <AllRoutes />
    </div>
  );
}

export default App;
