import { useEffect, useRef, useState } from "react";
import note from "../assets/note.png";
import search from "../assets/search.png";
import "../css/NavBar.css";
import { useTheme } from "../component/Provider/ThemeProvider";
import MainScreen from "./MainScreen";
import { useMenu } from "../component/Contexts/MenuContext";
import { useListProvider } from "../component/Provider/ListProvider";
import useMediaWidth from "../component/Commons/CustoMediaWidth";
import { useNoteProvider } from "./Commons/GetNotes";
import { ClipLoader } from "react-spinners";
import { useTableName } from "./Provider/ChangeTableName";

const NavBar = () => {
  const { toggleSelectMenu } = useMenu();
  const { isGrid, toggleSelectList } = useListProvider();
  const mediaWidth = useMediaWidth();
  const { getAllNotes, loading } = useNoteProvider();
  const {tableName } = useTableName();

  const { theme, toggleTheme } = useTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [searchTap, setsearchTap] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.screenY > 15);
    });

    function handleResize() {
      setDeviceWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <>
      <div
        className={`${scroll ? "sticky" : "normalView"}`}
        style={{ background: "var(--background-color)", zIndex: 1 }}
      >
        <nav>
          <div className="d-flex">
            <ul className={`list-style`}>
              <div className="main-icon-container" onClick={toggleSelectMenu}>
                <i className="bi bi-list icon-size"></i>
              </div>

              <li>
                <img
                  src={note}
                  style={{
                    width: "35px",
                    height: "37px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
                <div style={{ cursor: "pointer" }} className="keep-text">
                  Notes
                </div>
              </li>
            </ul>
            <div
              style={{
                flexGrow: "1",
                display: "flex",
              }}
            >
              {deviceWidth > 750 && (
                <div
                  className="search-view"
                  style={{
                    display: deviceWidth > 750 ? "flex" : "none",
                    width: deviceWidth < 876 ? "35vw" : "40vw",
                    boxShadow: searchTap
                      ? "0 2px 3px rgb(209, 207, 207)"
                      : "none",
                    backgroundColor: !searchTap
                      ? "var(--darkgrey-search-text)"
                      : "white",
                  }}
                >
                  <div className="close">
                    <i className="bi bi-search icon-size"></i>
                  </div>
                  <input
                    type="text"
                    style={{
                      color: "black",
                      border: "none",
                      outline: "none",
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    value={searchValue}
                    onClick={() => {
                      setsearchTap(true);
                    }}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                    className={`search-input ${
                      isSearchFocused ? "focused" : ""
                    }`}
                    placeholder="Search"
                  />

                  <div
                    className="close"
                    onClick={() => {
                      console.log(searchValue);
                      setSearchValue("");
                      console.log("after" + searchValue);
                      setsearchTap(false);
                      console.log("after2", searchValue);
                    }}
                    style={{
                      visibility: !searchTap ? "hidden" : "unset",
                    }}
                  >
                    <i className="bi bi-x-lg icon-size"></i>
                  </div>
                </div>
              )}
            </div>

            <ul className={`list-style`}>
              {deviceWidth < 750 && (
                <div className="main-icon-container search">
                  <img
                    src={search}
                    className="icon-size"
                    style={{ width: "15px", height: "15px" }}
                  />
                </div>
              )}
              <div
                className="main-icon-container"
                onClick={() => getAllNotes(tableName)}
              >
                {!loading && <i className="bi bi-arrow-clockwise icon-size" />}
                <ClipLoader
                  size={20}
                  color={"var(--secondary-color)"}
                  loading={loading}
                />
              </div>
              <div
                className="main-icon-container"
                style={{ display: mediaWidth < 750 ? "none" : "" }}
                onClick={toggleSelectList}
              >
                <i
                  className={`${
                    isGrid ? "bi bi-list-task" : "bi bi-grid"
                  } icon-size`}
                />
              </div>
              <div className="dropdown" ref={searchRef}>
                <div
                  className="main-icon-container"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownVisible}
                >
                  <i className="bi bi-gear icon-size"></i>
                </div>
                <ul
                  className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}
                  style={{
                    right: "20px",
                  }}
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li
                    onClick={() => {
                      setDropdownVisible(false);
                      toggleTheme();
                    }}
                  >
                    <a className="dropdown-item" href="#">
                      {theme === "light" ? "Dark" : "Light"} Theme
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>

              <div
                className="main-icon-container"
                style={{ marginLeft: "20px" }}
              >
                <i
                  className="bi bi-grid-3x3-gap-fill icon-size"
                  style={{ padding: "2px" }}
                ></i>
              </div>
              <div className="google-button">G</div>
            </ul>
          </div>
        </nav>
        <hr
          style={{
            margin: "0px",
            padding: "0px",
            color: "var(--secondary-color",
          }}
        />
      </div>
      <div>
        <MainScreen scroll={scroll} />
      </div>
    </>
  );
};

export default NavBar;
