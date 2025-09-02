import { useState, useEffect } from 'react';

export default function usePersistedState<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            console.log(key, storedValue);
            if (key === "day" && storedValue === "0") {
                return 1;
            }
            return storedValue ? JSON.parse(storedValue) : initialState;
        } catch (error) {
            console.error("Error parsing stored state: ", error);
            return initialState;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error saving state to local storage: ", error);
        }
    }, [key, state]);

    return [state, setState];
}