import { Modal, Dropdown } from "react-bootstrap";
import "../css/AddNotes.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/colors.scss";
import Todo from "./Commons/Interface";
import { useEffect, useRef, useState } from "react";
import { updateDoc, doc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { useNoteProvider } from "./Commons/GetNotes";
import { db } from "../firebaeConfig";
import { useTableName } from "./Provider/ChangeTableName";
import DateTimePicker from "./DatePicker";

interface ModalComponentProps {
  showModal: boolean;
  handleClose: () => void;
  todo: Todo | null;
}

const TodoModal = ({ showModal, handleClose, todo }: ModalComponentProps) => {
  const dotDropDownList = [
    "Delete note",
    "Add label",
    "Add drawing",
    "Make a copy",
    "Show tick boxes",
    "Copy to google docs",
    "Version history",
  ];
  const onTapDropsItem = (index: number, deleteId: string) => {
    if (index === 0) {
      handleClose();
      deleteDocFromFirestore(todo?.id!);
    }
    if (index === 2) {
      tableName === "todos"
        ? navigate(`/notes/${deleteId}`)
        : navigate(`/reminders/${deleteId}`);
    }
  };

  const navigate = useNavigate();

  const { getAllNotes } = useNoteProvider();
  // const { getAllReminders } = useReminderProvider();
  const [note, setNote] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const minHeight = "50px";
  const { tableName } = useTableName();

  const searchRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const adjustTextAreaHeightAndScroll = () => {
    const textarea = document.getElementById(
      "note01"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const container = document.querySelector(".modal-container");
    const scrollTop = container ? container.scrollTop : 0;
    ``;
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

  useEffect(() => {
    adjustTextAreaHeightAndScroll();
  });

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDate(todo.reminder);
      setNote(todo.note);
    }
  }, [todo]);
  async function deleteImageFromDocument(id: string) {
    try {
      const docRef = doc(db, tableName, id);
      await updateDoc(docRef, {
        image: null,
      });

      toast.error("Image deleted successfully");
      getAllNotes(tableName);

      handleClose();
    } catch (error) {
      console.error("Error deleting image from document: ", error);
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setNote(e.target.value);
    adjustTextAreaHeightAndScroll();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setNote((prevValue) => (prevValue ? prevValue + "\n" : "\n"));
      adjustTextAreaHeightAndScroll();
    }
  };

  const editDoc = async (id: string) => {
    if (
      note !== todo?.note ||
      title !== todo?.title ||
      date !== todo?.reminder
    ) {
      if ((note || title || date) && id) {
        try {
          await updateDoc(doc(db, tableName, id), {
            note: note,
            title: title,
            image: todo?.image,
            timestamp: todo?.timestamp,
            reminder: date ?? todo?.reminder,
            updateAt: serverTimestamp(),
          });
          getAllNotes(tableName);

          setNote("");
          setTitle("");
          adjustTextAreaHeightAndScroll();
          toast.success("Note updated successfully!");

          console.log("Document updated successfully");
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }
    }
  };

  const deleteDocFromFirestore = async (id: string) => {
    try {
      await deleteDoc(doc(db, tableName, id));
      toast.error(<div>Note deleted successfully</div>);
      getAllNotes(tableName);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        handleClose();
        editDoc(todo?.id ?? "");
      }}
      centered
    >
      <Modal.Body
        style={{
          margin: "auto",
          padding: "0px",
          overflowY: "auto",
          borderRadius: "10px 10px 0px 0px",
          background: "var(--primary-color)",
        }}
      >
        <div
          style={{
            width: "40rem",
            margin: "auto",

            alignContent: "center",
            textAlign: "center",
            outline: "none",
            borderRadius: "8px",
          }}
          ref={searchRef}
        >
          {todo?.image !== null && (
            <div
              style={{ position: "relative" }}
              onClick={() => {
                handleClose();

                tableName === "todos"
                  ? navigate(`/notes/${todo?.id}`)
                  : navigate(`/reminders/${todo?.id}`);
              }}
            >
              <img
                src={todo?.image}
                style={{
                  background: "#f4f4f4",
                  width: "100%",
                  height: "200px",
                }}
                alt=""
              />
              <div
                className="short-icon-container"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                }}
              >
                <i className="bi bi-pin short-icon"></i>
              </div>
              <div
                className="short-icon-container"
                onClick={(e) => {
                  e.stopPropagation();

                  deleteImageFromDocument(todo?.id!);
                }}
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                }}
              >
                <i className="bi bi-trash short-icon"></i>
              </div>
            </div>
          )}

          <div className="modal-container" style={{ padding: "0px 10px" }}>
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
                    e.preventDefault();
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <textarea
                value={note}
                id="note01"
                autoComplete="off"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{
                  border: "none",
                  resize: "none",
                  overflowY: "hidden",
                  outline: "none",
                  paddingBottom: "10px",
                  color: "var(--secondary-color)",
                  background: "var(--primary-color)",
                }}
                className="search-inputs"
                placeholder="Take a note..."
                autoFocus
              />
            </div>
          </div>
        </div>
        <div>
          <div>
            {tableName !== "todos" && (
              <div style={{ marginLeft: "10px" }}>
                {" "}
                <DateTimePicker
                  date={date ?? todo?.reminder}
                  handleDateChange={handleDateChange}
                  removeDate={() => {
                    setDate("");
                  }}
                />
              </div>
            )}
            <span
              style={{
                display: "flex",
                justifyContent: "end",
                fontSize: "12px",
                marginRight: "10px",
              }}
            >
              Edited{" "}
              {new Date(
                (todo?.updateAt.seconds ?? todo?.timestamp.seconds!) * 1000
              ).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
            </span>
          </div>

          <div
            className="d-flex"
            style={{
              width: "40rem",
              padding: "0px 10px",
              position: "fixed",
              borderRadius: "0px 0px 10px 10px",
              background: "var(--primary-color)",
            }}
          >
            <div
              className="flex-grow-1"
              style={{ display: "inline-flex", textAlign: "left" }}
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
              <Dropdown>
                <Dropdown.Toggle
                  className="short-icon-container"
                  id="dropdown-basic"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    color: "var(--secondary-color)",
                  }}
                >
                  <i className="bi bi-three-dots-vertical short-icon"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {dotDropDownList.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => onTapDropsItem(index, todo?.id!)}
                    >
                      {item}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <div className="short-icon-container">
                <i className="bi bi-arrow-return-left short-icon"></i>
              </div>
              <div className="short-icon-container">
                <i className="bi bi-arrow-return-right short-icon"></i>
              </div>
            </div>
            <span
              onClick={() => {
                setTitle(todo?.title);
                setNote(todo?.note);
                handleClose();
              }}
              className="close-text"
            >
              Close
            </span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TodoModal;
