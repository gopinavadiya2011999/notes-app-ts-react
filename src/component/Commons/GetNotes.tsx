import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaeConfig";
import Todo from "./Interface";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";

interface NoteContextType {
  loading: boolean;
  todos: Todo[];
  getAllNotes: (tableName: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllNotes = useCallback(async (tableName: string) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, tableName));
      const todosData: Todo[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      const todosDataSorted = todosData.sort((a, b) => {
        return a.timestamp.seconds - b.timestamp.seconds;
      });
      setTodos(todosDataSorted);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos: ", error);
      setLoading(false);
    }
  }, []);

  return (
    <NoteContext.Provider value={{ todos, loading, getAllNotes }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteProvider = (): NoteContextType => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNoteProvider must be used within a NoteProvider");
  }
  return context;
};
