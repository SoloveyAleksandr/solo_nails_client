import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Calendar from "./screens/Calendar/Calendar";
import DayScreen from "./screens/DayScreen/DayScreen";
import FreeTime from "./screens/FreeTime/FreeTime";
import Login from "./screens/Login/Login";
import MyAccount from "./screens/MyAccount/MyAccount";
import Services from "./screens/Services/Services";
import { useAppSelector } from "./store/hooks";

function AppRouter() {
  const appState = useAppSelector(store => store.AppStore);

  if (appState.currentUserInfo.uid) {
    return (
      <Routes>
        <Route path="day" element={<DayScreen />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="free-time" element={<FreeTime />} />
        <Route path="services" element={<Services />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="/*" element={<Navigate to={'/calendar'} />}></Route>
      </Routes>
    )
  } else {
    return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Navigate to={'/login'} />}></Route>
      </Routes>
    )
  }
};

export default AppRouter;
