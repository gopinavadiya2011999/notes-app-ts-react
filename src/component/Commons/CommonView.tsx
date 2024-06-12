import { toast } from "react-toastify";
import { useNoteProvider } from "../../component/Commons/GetNotes";
import ProgressBars from "react-bootstrap/ProgressBar";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { serverTimestamp, updateDoc, doc } from "firebase/firestore";
import "../../css/FetchTodo.css";
import { deleteDoc } from "firebase/firestore";
import { db, storage } from "../../firebaeConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Todo from "./Interface";
import { useTableName } from "../Provider/ChangeTableName";
import DateTimePicker from "../DatePicker";
interface PickerList {
  data: string | number;
  selectd?: true | false;
}
const colors: PickerList[] = [
  { data: "var(--primary-color)" },
  { data: "lightblue" },
  { data: "lightgreen" },
  { data: "lightyellow" },
  { data: "lightgrey" },
  { data: "lavender" },
  { data: "lightpink" },
  { data: "wheat" },
  { data: "lightcyan" },
  { data: "lightsalmon" },
  { data: "thistle" },
  { data: "lightcoral" },
  { data: "skyblue" },
  { data: "orange" },
  { data: "gainsboro" },
  { data: "burlywood" },
  { data: "rgb(78, 168, 207)" },
  { data: "rgb(134, 209, 184)" },
];

interface Pros {
  index: number;
  todo: Todo;
}

const CommonView = ({ index, todo }: Pros) => {
  const [selectedBg, setBg] = useState<string>("--var(--primary-color)");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { tableName } = useTableName();

  const { getAllNotes } = useNoteProvider();
  const navigate = useNavigate();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownColor, setDropdownColor] = useState(false);
  const dotDropDownList = [
    "Delete note",
    "Add label",
    "Add drawing",
    "Make a copy",
    "Show tick boxes",
    "Copy to google docs",
    "Version history",
  ];

  const [uploadProgress, setUploadProgress] = useState(0);

  const deleteDocFromFirestore = async (id: string) => {
    try {
      await deleteDoc(doc(db, tableName, id));
      toast.error(<div>Note deleted successfully</div>);

      getAllNotes(tableName);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const toggleDropdown = () => {
    setDropdownColor(false);
    setDropdownVisible(!dropdownVisible);
  };
  const toggleColorDropdown = () => {
    setDropdownVisible(false);
    setDropdownColor(!dropdownColor);
  };

  const onTapDropsItem = (index: number, deleteId: string) => {
    setDropdownVisible(false);
    setDropdownColor(false);
    if (index === 0) {
      deleteDocFromFirestore(deleteId);
    }
    if (index === 2) {
      tableName === "todos"
        ? navigate(`/notes/${deleteId}`)
        : navigate(`/reminders/${deleteId}`);
    }
  };
  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;

    try {
      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              updateDoc(doc(db, tableName, todo.id), {
                note: todo.note,
                title: todo.title,
                image: downloadURL,
                timestamp: todo.timestamp,
                updateAt: serverTimestamp(),
              })
                .then(() => {
                  console.log("Document updated successfully!");
                  setUploadProgress(0);

                  getAllNotes(tableName);
                })
                .catch((error) => {
                  console.error("Error updating document:", error);
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  return (
    <div
      className="note-card"
      onMouseEnter={(e) => {
        e.stopPropagation();
        setDropdownColor(false);
        handleMouseEnter(index);
      }}
      onMouseLeave={handleMouseLeave}
      style={{ background: selectedBg }}
    >
      {todo.image && (
        <>
          <img
            src={todo.image}
            style={{ height: "100px", background: "#f4f4f4" }}
            alt=""
          />
        </>
      )}
      {uploadProgress !== 0 && (
        <ProgressBars
          animated
          now={uploadProgress}
          striped
          variant="success"
          style={{ height: "10px", marginTop: "5px" }}
        />
      )}

      {todo.title && <div className="note-title">{todo.title}</div>}
      {todo.note && (
        <div
          className="note-content"
          dangerouslySetInnerHTML={{
            __html: todo.note.replace(/\n/g, "<br>"),
          }}
        ></div>
      )}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "-8px",
          visibility: hoverIndex === index ? "visible" : "hidden",
        }}
      >
        <i
          className="bi bi-check-circle-fill short-icon"
          style={{ fontSize: "16px" }}
        ></i>
      </div>
      <div
        className="short-icon-container"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          visibility: hoverIndex === index ? "visible" : "hidden",
        }}
      >
        <i className="bi bi-pin short-icon"></i>
      </div>
      {todo.reminder && (
        <DateTimePicker
          date={todo.reminder}
          handleDateChange={() => {}}
          removeDate={() => {}}
        />
      )}
      <div
        className="d-flex icon-row"
        style={{
          visibility: hoverIndex === index ? "visible" : "hidden",
        }}
      >
        <div className="short-icon-container">
          <i className="bi bi-bell short-icon"></i>
        </div>
        <div className="short-icon-container">
          <i className="bi bi-person-add short-icon"></i>
        </div>
        <div className="dropdown">
          <div
            className="short-icon-container"
            onClick={(e) => {
              e.stopPropagation();
              toggleColorDropdown();
            }}
            aria-expanded={dropdownColor === true ? true : false}
          >
            <i className="bi bi-palette short-icon"></i>
          </div>

          {dropdownColor === true && (
            <ul
              className={`dropdown-menu`}
              style={{
                width: "300px",
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              {colors.map((item, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBg(item.data.toString());
                    setDropdownColor(false);
                  }}
                >
                  {index === 0 ? (
                    <a
                      className="dropdown-item hover-color"
                      style={{
                        background: "var(--primary-color)",
                        width: "30px",
                        margin: "5px",
                        padding: "0px",
                        textAlign: "center",

                        height: "30px",
                        border: "2px solid grey",
                        borderRadius: "50%",
                      }}
                      href="#"
                    >
                      /
                    </a>
                  ) : (
                    <a
                      className="dropdown-item hover-color"
                      style={{
                        background: item.data,
                        width: "30px",
                        margin: "5px",
                        height: "30px",
                        border:
                          selectedBg === item.data ? "1px solid blue" : "",
                        borderRadius: "50%",
                      }}
                      href="#"
                    ></a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="short-icon-container">
          <input
            type="file"
            onClick={(e) => e.stopPropagation()}
            className="file-input"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                console.log("File selected:", file);
                handleImageUpload(file!);
              }
            }}
          />

          <i className="bi bi-image"></i>
        </div>

        <div className="short-icon-container">
          <i className="bi bi-archive short-icon"></i>
        </div>
        <div className="dropdown">
          <div
            className="short-icon-container"
            aria-expanded={dropdownVisible === true ? true : false}
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
          >
            <i className="bi bi-three-dots-vertical short-icon"></i>
          </div>

          <ul
            className={`dropdown-menu ${
              dropdownVisible === true ? "show" : ""
            }`}
            style={{
              right: "20px",
            }}
          >
            {dotDropDownList.map((item, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onTapDropsItem(index, todo.id);
                }}
              >
                <a className="dropdown-item" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CommonView;
