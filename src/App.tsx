import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NoteProvider } from "./component/Commons/GetNotes";
import { MenuProvider } from "./component/Contexts/MenuContext";
import NavBar from "./component/NavBar";
import { ListProvider } from "./component/Provider/ListProvider";
import ThemeProvider from "./component/Provider/ThemeProvider";
import "./styles/colors.scss";
import DrawingView from "./component/DrawingView";
import TableNameProvider from "./component/Provider/ChangeTableName";
function App() {
  return (
    <>
      <ThemeProvider>
        <NoteProvider>
          <TableNameProvider>
            <MenuProvider>
              <ListProvider>
                <div style={{ background: "var(--background-color)" }}>
                  <BrowserRouter>
                    <Routes>
                      <Route path={`/`} element={<NavBar />} />
                      <Route path={`/reminders`} element={<NavBar />} />
                      <Route path={"/notes/:id"} element={<DrawingView />} />
                      <Route
                        path={"/reminders/:id"}
                        element={<DrawingView />}
                      />

                      <Route
                        path="*"
                        element={
                          <div
                            style={{
                              height: "100vh",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            No Page Found
                          </div>
                        }
                      />
                    </Routes>
                  </BrowserRouter>
                </div>
              </ListProvider>
            </MenuProvider>
          </TableNameProvider>
        </NoteProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
