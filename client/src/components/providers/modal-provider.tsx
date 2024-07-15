'use client';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

interface ModalProviderProps {
  children: ReactNode;
}

type ModalContextType = {
  isOpen: boolean
  setOpen: (modal: ReactNode) => void
  setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  setOpen: (modal: ReactNode) => { },
  setClose: () => { },
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const setOpen = async (modal: ReactNode) => {
    if (modal) {
      setShowingModal(modal);
      setIsOpen(true);
    }
  }

  const setClose = () => {
    setIsOpen(false);
  }

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ setClose, setOpen, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the provider");
  }
  return context;
}

export default ModalProvider;
