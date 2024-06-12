import { ReactNode, useEffect, useRef, useState } from "react";
import "../css/SideMenu.css";
import { useMenu } from "../component/Contexts/MenuContext";
import useMediaWidth from "../component/Commons/CustoMediaWidth";
import { useTableName } from "./Provider/ChangeTableName";
import { useNoteProvider } from "./Commons/GetNotes";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./Provider/ThemeProvider";
interface NavItem {
  text: string;
  icon: string;
}

const SideView = () => {
  const { toggleTableName, tableName } = useTableName();
  const { getAllNotes } = useNoteProvider();
  const { theme } = useTheme();

  const { onMenuTap, toggleSelectMenu } = useMenu();

  const [selectHover, onSelectHover] = useState(false);
  const listOfNavs: NavItem[] = [
    {
      text: "Notes",
      icon: "bi-lightbulb-fill",
    },
    {
      text: "Reminders",
      icon: "bi-bell",
    },
    {
      text: "Label",
      icon: "bi-signpost",
    },
    {
      text: "Edit Lable",
      icon: "bi-pencil",
    },
    {
      text: "Archive",
      icon: "bi-archive",
    },
    {
      text: "Bin",
      icon: "bi-trash",
    },
  ];
  const [selected, setSelected] = useState<NavItem>(listOfNavs[0]);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const mediaWidth = useMediaWidth();

  const navigate = useNavigate();
  const handleMouseEnter = () => {
    if (sideMenuRef.current) {
      onSelectHover(true);
      sideMenuRef.current.classList.add("show");
    }
  };

  const handleMouseLeave = () => {
    if (sideMenuRef.current) {
      onSelectHover(false);
      sideMenuRef.current.classList.remove("show");
    }
  };

  useEffect(() => {
    console.log("selected", selected);
    setSelected(
      tableName === "todos"
        ? listOfNavs[0]
        : tableName === "reminder-notes"
        ? listOfNavs[1]
        : selected
    );
    if (tableName === "todos") navigate("/");
  }, [tableName]);

  useEffect(() => {
    if (onMenuTap && mediaWidth < 600) {
      toggleSelectMenu();
    }
  }, [mediaWidth < 600]);

  function CommonView(): ReactNode {
    return (
      <div
        style={{
          background: theme == "dark" ? "#000000" : "white",
          height: "100vh",
        }}
      >
        {listOfNavs.map((item, index) => (
          <div
            key={index}
            className={`side-menu-content ${
              selected.text === item.text ? "selected" : "none"
            }`}
            onClick={() => {
              setSelected(item);

              toggleTableName(
                item.text === "Notes" ? "todos" : "reminder-notes"
              );
              console.log(item.text);
              navigate(item.text === "Reminders" ? "/reminders" : "/");

              getAllNotes(tableName);
            }}
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {onMenuTap ? (
        <div className={mediaWidth < 600 ? "side-menu-hover" : "side-menu"}>
          <CommonView />
        </div>
      ) : (
        <>
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {!selectHover && (
              <div>
                {listOfNavs.map((item, index) => (
                  <div
                    key={index}
                    className={`side-menu-icon ${
                      selected.text === item.text ? "selected" : "none"
                    }`}
                    onClick={() => setSelected(item)}
                  >
                    <i className={`bi ${item.icon}`} />
                  </div>
                ))}
              </div>
            )}
            <div ref={sideMenuRef}>
              {selectHover && (
                <div className={`side-menu-hover`}>
                  <CommonView />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideView;
