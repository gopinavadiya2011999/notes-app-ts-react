import  { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  onMenuTap: boolean;
  toggleSelectMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [onMenuTap, setOnMenuTap] = useState(false);

  const toggleSelectMenu = () => {
    setOnMenuTap(prev => !prev);
  };

  return (
    <MenuContext.Provider value={{ onMenuTap, toggleSelectMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
