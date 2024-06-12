import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaeConfig";
import { v4 as uuidv4 } from "uuid";

import useMediaWidth from "../component/Commons/CustoMediaWidth";
import { useState, useRef, useEffect } from "react";
import "../css/AddNotes.css";
import { useMenu } from "../component/Contexts/MenuContext";
import { useTheme } from "../component/Provider/ThemeProvider";
import { useNoteProvider } from "./Commons/GetNotes";
import { useNavigate } from "react-router-dom";
import { useTableName } from "./Provider/ChangeTableName";
import DateTimePicker from "./DatePicker";

const AddNotes = () => {
  const navigate = useNavigate();
  const { getAllNotes } = useNoteProvider();
  const [title, setTitle] = useState("");
  const [onNoteTap, setOnNoteTap] = useState(true);
  const [note, setNote] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const minHeight = "50px";
  const { theme } = useTheme();
  const mediaWidth = useMediaWidth();
  const { onMenuTap } = useMenu();
  const { tableName } = useTableName();
  const [date, setDate] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const addTodo = async () => {
    if (note || title)
      try {
        const docRef = await addDoc(collection(db, tableName), {
          userId: uuidv4(),
          note: note,
          reminder: date ?? "",
          title: title,
          timestamp: serverTimestamp(),
          updateAt: serverTimestamp(),
        });
        getAllNotes(tableName);
        setNote("");
        setTitle("");
        setDate("");
        adjustTextAreaHeightAndScroll();

        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOnNoteTap(true);
        addTodo();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [note || title]);
  const adjustTextAreaHeightAndScroll = () => {
    const textarea = document.getElementById(
      "note-text"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const container = document.querySelector(".search-container");
    const scrollTop = container ? container.scrollTop : 0;

    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight
      ? `${textarea.scrollHeight}px`
      : minHeight;
    textarea.style.height = newHeight;

    if (textarea.value) {
      textarea.scrollTop = textarea.scrollHeight;
    }
    if (container) {
      container.scrollTop = scrollTop;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    adjustTextAreaHeightAndScroll();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setNote((prevValue) => prevValue + "\n");
      adjustTextAreaHeightAndScroll();
    }
  };

  return (
    <>
      {onNoteTap && (
        <div
          className="note-input-container"
          style={{
            marginTop: "20px",
            width:
              onMenuTap && mediaWidth < 950
                ? "90%"
                : !onMenuTap && mediaWidth < 750
                ? "85%"
                : "40rem",
            boxShadow:
              theme === "light" ? "0 2px 3px rgb(209, 207, 207)" : "none",
          }}
        >
          <input
            onChange={(e) => {
              setNote(e.target.value);
            }}
            onClick={() => setOnNoteTap(false)}
            type="text"
            value={note}
            autoComplete="off"
            id="exampleInputnote"
            className="note-input"
            placeholder="Take a note..."
            aria-describedby="noteHelp"
          />
          <div className="note-icon">
            <i className="bi bi-check-square icon-size"></i>
          </div>

          <div
            className="note-icon"
            onClick={() => {
              tableName === "todos"
                ? navigate(`/notes/${uuidv4()}`)
                : navigate(`/reminders/${uuidv4()}`);
            }}
          >
            <i className="bi bi-brush icon-size"></i>
          </div>

          <div className="note-icon">
            <i className="bi bi-image icon-size"></i>{" "}
          </div>
        </div>
      )}
      {!onNoteTap && (
        <div className="search-main" ref={searchRef}>
          <div className="search-container">
            <div className="input-wrapper">
              <div className="d-flex">
                <input
                  type="text"
                  id="exampleInputnote"
                  autoComplete="off"
                  className="note-input"
                  placeholder="Title"
                  aria-describedby="noteHelp"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <div className="short-icon-container">
                  <i className="bi bi-pin short-icon"></i>
                </div>
              </div>
              <textarea
                value={note}
                id="note-text"
                autoComplete="off"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{
                  border: "none",
                  outline: "none",
                  paddingBottom: "10px",
                }}
                className="search-input"
                placeholder="Take a note..."
                autoFocus
              />
            </div>
          </div>
          {tableName !== "todos" && (
            <div style={{ marginLeft: "10px" }}>
              {" "}
              <DateTimePicker
                date={date}
                handleDateChange={handleDateChange}
                removeDate={() => {
                  setDate("");
                }}
              />
            </div>
          )}
          <div className="d-flex">
            <div
              className="flex-grow-1"
              style={{
                display: "inline-flex",
                textAlign: "left",
              }}
            >
              <div className="short-icon-container">
                <i className="bi bi-bell short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-person-add short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-palette short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-image short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-archive short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-three-dots-vertical short-icon"></i>
              </div>

              <div className="short-icon-container">
                <i className="bi bi-arrow-return-left short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-arrow-return-right short-icon"></i>
              </div>
            </div>
            <span
              onClick={() => {
                setOnNoteTap(true);
                setTitle("");
                setNote("");
              }}
              className="close-text"
            >
              Close
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNotes;
