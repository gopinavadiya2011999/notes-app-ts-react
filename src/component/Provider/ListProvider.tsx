import  { createContext, useContext, useState, ReactNode } from 'react';

interface ListContextType {
  isGrid: boolean;
  toggleSelectList: () => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [isGrid, setisGrid] = useState(false);

  const toggleSelectList = () => {
    setisGrid(prev => !prev);
  };

  return (
    <ListContext.Provider value={{ isGrid, toggleSelectList }}>
      {children}
    </ListContext.Provider>
  );
};

export const useListProvider = (): ListContextType => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useListProvider must be used within a ListProvider');
  }
  return context;
};
