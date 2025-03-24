export const saveToStorage = (key: string, value: any, useSession: boolean = false): void => {
    const storage = useSession ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  };


  export const getFromStorage = (key: string, useSession: boolean = false) => {
    const storage = useSession ? sessionStorage : localStorage;
    const storedValue = storage.getItem(key);
    return storedValue ? (JSON.parse(storedValue)) : null;
  }


export const removeFromStorage = (key: string, useSession: boolean = false): void => {
  const storage = useSession ? sessionStorage : localStorage;
  storage.removeItem(key);
};