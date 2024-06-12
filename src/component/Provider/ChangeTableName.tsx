import {
    createContext,
    useState,
    useContext,
    ReactNode,
  } from "react";
  interface TableNameProviderProps {
    children: ReactNode;
  }
  const TableNameContext = createContext({
    tableName: "todos",
    toggleTableName: (value:string) => {},
  });
  
  export const useTableName = () => useContext(TableNameContext);
  
  const TableNameProvider = ({ children }: TableNameProviderProps) => {
    const [tableName, setTableName] = useState("todos");
  
    const toggleTableName = (value:string) => {
     setTableName(value);
    };
  
    return (
      <TableNameContext.Provider value={{ tableName, toggleTableName }}>
        {children}
      </TableNameContext.Provider>
    );
  };
  
  export default TableNameProvider;
  