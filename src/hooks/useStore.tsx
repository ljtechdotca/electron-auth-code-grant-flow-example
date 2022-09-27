import { IpcRendererEvent } from "electron";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

const initialStore: StoreProps = {
  isLoggedIn: false,
  isSubmitting: false,
  error: null,
  token: null,
};

export const StoreContext = createContext<{
  store: StoreProps;
  setStore: Dispatch<SetStateAction<StoreProps>>;
}>({ store: initialStore, setStore: () => {} });

export const useStore = () => {
  const { store, setStore } = useContext(StoreContext);

  function updateStore(data: Partial<StoreProps>) {
    setStore((currentData) => ({ ...currentData, ...data }));
  }

  function onStoreEvent(_event: IpcRendererEvent, data: Partial<StoreProps>) {
    updateStore(data);
  }

  return { store, setStore, updateStore, onStoreEvent };
};

export const StoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store, setStore] = useState<StoreProps>(initialStore);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
};
