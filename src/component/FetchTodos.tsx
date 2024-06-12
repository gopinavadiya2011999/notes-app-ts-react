import { useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import "../css/FetchTodo.css";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import useMediaWidth from "../component/Commons/CustoMediaWidth";
import { useMenu } from "../component/Contexts/MenuContext";
import { useListProvider } from "../component/Provider/ListProvider";
import { useNoteProvider } from "../component/Commons/GetNotes";
import Todo from "../component/Commons/Interface";
import TodoModal from "./TodoModal";
import CommonView from "./Commons/CommonView";
import { useTableName } from "./Provider/ChangeTableName";

const FetchTodos = () => {
  const { tableName } = useTableName();
  const { isGrid } = useListProvider();
  const { todos, loading, getAllNotes } = useNoteProvider();
  const { onMenuTap } = useMenu();
  const mediaWidth = useMediaWidth();
  const [orderedTodos, setOrderedTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<Todo | null>(null);
  const [showModal, setShowModal] = useState<true | false>(false);

  useEffect(() => {
    setOrderedTodos(todos);
  }, [todos]);

  useEffect(() => {
    getAllNotes(tableName);
  }, [getAllNotes, tableName]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedTodos(items);
  };

  return (
    <>
      <div style={{ marginTop: "30px" }}>
        {!loading && orderedTodos.length === 0 && (
          <div
            style={{
              width: "100%",
              height: "78vh",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            No Notes Found
          </div>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          {isGrid ? (
            <Droppable droppableId="todos" direction="vertical">
              {(provided) => (
                <div
                  className="list-view"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {orderedTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            width:
                              onMenuTap && mediaWidth < 950
                                ? "90%"
                                : !onMenuTap && mediaWidth < 750
                                ? "85%"
                                : "40rem",
                          }}
                          onClick={() => {
                            setSelectedTodos(todo);
                            setShowModal(true);
                          }}
                        >
                          <CommonView index={index} todo={todo} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ) : (
            <Droppable droppableId="todos-masonry" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    margin: mediaWidth < 1230 ? "0px 20px" : "0px 4rem",
                  }}
                >
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      400: 1,
                      750: onMenuTap ? 2 : 2,
                      940: onMenuTap ? 3 : 3,
                      1430: onMenuTap ? 4 : 5,
                      1650: onMenuTap ? 5 : 6,
                      1830: onMenuTap ? 6 : 7,
                    }}
                  >
                    <Masonry>
                      {orderedTodos.map((todo, index) => (
                        <Draggable
                          key={todo.id}
                          draggableId={todo.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                              onClick={() => {
                                setSelectedTodos(todo);
                                setShowModal(true);
                              }}
                            >
                              <CommonView index={index} todo={todo} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </DragDropContext>
      </div>

      <TodoModal
        handleClose={() => setShowModal(false)}
        showModal={showModal}
        todo={selectedTodos}
      />
    </>
  );
};
export default FetchTodos;
