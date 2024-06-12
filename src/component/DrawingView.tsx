import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Link } from "react-router-dom";
import "../css/DrawingView.css";
import Todo from "../component/Commons/Interface";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { uploadImageToFirebase, db } from "../firebaeConfig";
import html2canvas from "html2canvas";
import { useNoteProvider } from "./Commons/GetNotes";
import { useTableName } from "./Provider/ChangeTableName";

interface PickerList {
  data: string | number;
  selectd?: true | false;
}

interface DropDownList {
  icon: string;
  list: PickerList[];
  list2: PickerList[];
  dropdownVisible?: false | true;
}
const numList: PickerList[] = [
  { data: 3 },
  { data: 6, selectd: true },
  { data: 9 },
  { data: 12 },
  { data: 15 },
  { data: 18 },
  { data: 21 },
  { data: 24 },
];
const gridList: PickerList[] = [
  { data: "Square" },
  { data: "Dots" },
  { data: "Rules" },
  { data: "None", selectd: true },
];
const colors: PickerList[] = [
  { data: "var(--secondary-color)", selectd: true },
  { data: "blue" },
  { data: "green" },
  { data: "yellow" },
  { data: "grey" },
  { data: "purple" },
  { data: "orange" },
  { data: "pink" },
  { data: "teal" },
  { data: "lime" },
  { data: "aqua" },
  { data: "maroon" },
  { data: "olive" },
  { data: "navy" },
  { data: "magenta" },
  { data: "tan" },
  { data: "cyan" },
  { data: "salmon" },
  { data: "beige" },
  { data: "lavender" },
  { data: "coral" },
  { data: "indigo" },
  { data: "plum" },
  { data: "silver" },
  { data: "sienna" },
  { data: "gold" },
  { data: "skyblue" },
  { data: "red" },
];
const listOfDropDown: DropDownList[] = [
  {
    icon: "bi-eraser-fill",
    list: [{ data: "Clear Page" }],
    list2: [],
  },
  {
    icon: "bi-pen-fill",
    list: colors,
    list2: numList,
  },
  {
    icon: "bi-brush-fill",
    list: colors,
    list2: numList,
  },
  {
    icon: "bi-pencil-fill",
    list: colors,
    list2: numList,
  },
  {
    icon: "bi-grid-3x3",
    list: gridList,
    list2: [],
  },
];

const DrawingView = () => {
  const { todos, getAllNotes } = useNoteProvider();
  const { tableName } = useTableName();
  let { id } = useParams();

  const [dropdowns, setDropdowns] = useState<DropDownList[]>(listOfDropDown);
  const [fetchTodo, setTodo] = useState<Todo | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | number>("black");
  const [selectedStroke, setSelectedStroke] = useState<string | number>("6");
  const [selectedArea, seSselectedArea] = useState<string | number>("none");
  const [lightPen, setLightPen] = useState<false | true>(false);
  const dropdownRefs = useRef<any>();
  const sketchRef = useRef<any>(null);

  useEffect(() => {
    for (const element of todos) {
      if (element.id === id) {
        setTodo(element);
      }
    }
  });

  const handleClearCanvas = () => {
    if (sketchRef.current) {
      sketchRef.current.clearCanvas();
    }
    setDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown) => {
        return {
          ...dropdown,
          dropdownVisible: false,
        };
      })
    );
  };
  const toggleDropDownSelected = (index: number) => {
    setDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown, i) => ({
        ...dropdown,
        dropdownVisible: i === index ? !dropdown.dropdownVisible : false,
      }))
    );
  };

  const selectedColors = (item: PickerList, parentIndex: number) => {
    if (parentIndex === 3) {
      setLightPen(true);
    } else {
      setLightPen(false);
    }
    setSelectedColor(item.data);
    setDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown, i) => {
        if (i === parentIndex) {
          return {
            ...dropdown,
            dropdownVisible: false,
            list: dropdown.list.map((pItem) => ({
              ...pItem,
              selectd: pItem.data === item.data ? true : false,
            })),
          };
        }
        return dropdown;
      })
    );
  };

  const selectedNumbers = (item: PickerList, parentIndex: number) => {
    setSelectedStroke(item.data);
    setDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown, i) => {
        if (i === parentIndex) {
          const isItemInList2 = dropdown.list2.some(
            (pItem) => pItem.data === item.data
          );

          return {
            ...dropdown,
            dropdownVisible: false,
            list2: dropdown.list2.map((pItem) => ({
              ...pItem,
              selectd: isItemInList2 && pItem.data === item.data ? true : false,
            })),
          };
        }
        return dropdown;
      })
    );
  };

  const saveCanvasAsImage = async () => {
    let found = false;

    if (sketchRef.current) {
      try {
        const canvasContainer: any = document.getElementById("canvas01");
        const canvasImage = await html2canvas(canvasContainer);
        const imageUrl = canvasImage.toDataURL("image/png");

        console.log(imageUrl);
        const uploadedImageUrl = await uploadImageToFirebase(imageUrl);
        console.log("Uploaded image URL:", uploadedImageUrl);

        for (const element of todos) {
          if (element.id === id) {
            await updateDoc(doc(db, tableName, id), {
              note: element.note,
              title: element.title,
              image: uploadedImageUrl,
              timestamp: element.timestamp,
              updateAt: serverTimestamp(),
            });
            found = true;
            break;
          }
        }

        if (!found) {
          await addDoc(collection(db, tableName), {
            userId: id,
            note: "",
            title: "",
            reminder: "",
            image: uploadedImageUrl,
            updateAt: serverTimestamp(),
            timestamp: serverTimestamp(),
          });
          showSuccessToast("Note added successfully!");
        } else {
          showSuccessToast("Note updated successfully!");
        }

        getAllNotes(tableName);
      } catch (error) {
        console.error("Error exporting/uploading image:", error);
      }
    } else {
      console.log("else");
    }
  };

  const showSuccessToast = (message: string) => {
    toast.success(<div>{message}</div>);
  };

  return (
    <>
      <nav className="drawing-nav">
        <div className="nav-item1">
          <div className="d-flex">
            <Link
              to={tableName === "todos" ? `/` : "/reminders"}
              onClick={saveCanvasAsImage}
            >
              <div className="icon-hover">
                <i className="bi bi-arrow-left icon-i" />
              </div>
            </Link>
            <div className="icon-hover">
              <i className="bi bi-arrow-up-left-square-fill icon-i" />
            </div>
            {dropdowns.map((item, pindex) => (
              <div key={pindex} className="dropdown">
                <div
                  className="dropdown-content"
                  onClick={() => toggleDropDownSelected(pindex)}
                  aria-expanded={item.dropdownVisible}
                >
                  <i className={`bi ${item.icon} i-one`} />
                  <div className="arrow-down">
                    <i
                      className="bi bi-caret-down-fill"
                      style={{ background: "var(--primary-color)" }}
                    />
                  </div>
                </div>
                <div
                  ref={dropdownRefs}
                  className={`dropdown-menu  ${
                    item.dropdownVisible ? "show" : ""
                  }`}
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {pindex !== 0 && pindex !== dropdowns.length - 1 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "17vw",
                      }}
                    >
                      <div
                        style={{
                          width: "15.6vw",
                          display: "flex",
                          alignItems: "center",

                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {item.list.map((listItem, itemIndex) => (
                          <div
                            key={itemIndex}
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",

                              width: listItem.selectd ? "28px" : "20px",
                              padding: "0px",
                              height: listItem.selectd ? "28px" : "20px",
                              margin: listItem.selectd ? "6.5px" : "10px",
                              backgroundColor: listItem.data.toString(),
                            }}
                            onClick={() => {
                              selectedColors(listItem, pindex);
                            }}
                            className="dropdown-item"
                          />
                        ))}
                      </div>

                      <i className="bi bi-chevron-down" />

                      <div>
                        <hr
                          style={{
                            width: "17vw",
                            margin: "8px 0px",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {item.list2.map((list2Item, list2Index) => (
                            <div
                              style={{
                                cursor: "pointer",
                                position: "relative",
                                width: "32px",
                                height: "32px",
                                margin: "4px",
                                border: list2Item.selectd
                                  ? "1px solid var(--secondary-color)"
                                  : "none",
                                borderRadius: "50%",
                              }}
                            >
                              <div
                                key={list2Index}
                                onClick={() =>
                                  selectedNumbers(list2Item, pindex)
                                }
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  borderRadius: "50%",
                                  width: `${parseInt(
                                    list2Item.data.toString()
                                  )}px`,
                                  height: `${parseInt(
                                    list2Item.data.toString()
                                  )}px`,
                                  backgroundColor: "var(--secondary-color)",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : pindex === 0 ? (
                    <div>
                      <div
                        className="dropdown-item"
                        onClick={handleClearCanvas}
                      >
                        {item.list[0].data}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {item.list.map((listItem, itemIndex) => (
                        <div
                          key={itemIndex}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            seSselectedArea(
                              itemIndex === 0
                                ? "grid"
                                : itemIndex === 1
                                ? "dots"
                                : itemIndex === 2
                                ? "line"
                                : "none"
                            );
                            setDropdowns((prevDropdowns) =>
                              prevDropdowns.map((dropdown) => {
                                return {
                                  ...dropdown,
                                  dropdownVisible: false,
                                };
                              })
                            );
                          }}
                          className="dropdown-item"
                        >
                          <div
                            className={
                              itemIndex === 0
                                ? "can-grid"
                                : itemIndex === 1
                                ? "can-dots"
                                : itemIndex === 2
                                ? "can-line"
                                : ""
                            }
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              border: listItem.selectd
                                ? "1px solid #4081f5"
                                : "1px solid var(--grey-color)",
                            }}
                          ></div>
                          <div
                            style={{
                              fontWeight: listItem.selectd ? "500" : "400",
                              marginTop: "10px",
                              fontSize: "12px",
                              color: listItem.selectd
                                ? "var(--secondary-color)"
                                : "var(--grey-color)",
                            }}
                          >
                            {listItem.data}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="d-flex">
            <div className="icon-hover">
              <i className="bi bi-arrow-return-left icon-i" />
            </div>
            <div className="icon-hover">
              <i className="bi bi-arrow-return-right icon-i" />
            </div>
            <div className="icon-hover">
              <i className="bi bi-crop icon-i" />
            </div>
            <div className="icon-hover">
              <i className="bi bi-three-dots-vertical icon-i" />
            </div>
          </div>
        </div>
      </nav>
      <hr className="m-0" style={{ color: "var(--secondary-color)" }} />
      <div className="canvas-container" id="canvas01">
        {selectedArea === "grid" && <div className="canvas-grid" />}
        {selectedArea === "dots" && <div className="canvas-dots" />}
        {selectedArea === "line" && <div className="canvas-lines" />}
        {/* {fetchTodo?.image && (
          <div
            style={{
              backgroundImage: fetchTodo?.image,
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          >
            <img
              src={fetchTodo?.image}
              style={{ width: "100%", height: "100%" }}
              alt=""
            />
          </div>
        )} */}
        <ReactSketchCanvas
          width="100%"
          height="100%"
          style={{
            // position: lightPen === true ? "unset" : "relative",
            position: "absolute",
            // opacity: lightPen ? 0.2 : 1,
            backgroundSize: "40px 40px",
          }}
          backgroundImage={
            selectedArea === "none" && fetchTodo?.image
              ? fetchTodo?.image
              : `linear-gradient(
            to right,
            rgba(181, 181, 181, 0.3) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, rgba(181, 181, 181, 0.3) 1px, transparent 1px)`
          }
          strokeWidth={parseInt(selectedStroke.toString())}
          strokeColor={selectedColor.toString()}
          ref={sketchRef}
        />
      </div>
    </>
  );
};

export default DrawingView;
