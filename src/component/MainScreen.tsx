import "../styles/colors.scss";
import AddNotes from "./AddNotes";
import FetchTodos from "./FetchTodos";
import SideView from "./SideView";
import { ToastContainer } from "react-toastify";
import { useTheme } from "../component/Provider/ThemeProvider";

interface Pros {
  scroll: boolean;
}

const MainScreen = ({ scroll }: Pros) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        marginTop: scroll ? "80px" : "0px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <SideView />

      <div style={{ flexGrow: "1" }}>
        <AddNotes />
        <FetchTodos />
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        theme={theme === "light" ? "dark" : "light"}
      />
    </div>
  );
};

export default MainScreen;
