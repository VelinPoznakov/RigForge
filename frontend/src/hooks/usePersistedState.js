import {useState} from "react";

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        const persistedState = localStorage.getItem(key);

        if (persistedState) {
            return JSON.parse(persistedState);
        }

        return initialState
    });

    const setPersistedState = (value) => {
        let resultState = value;

        localStorage.setItem(key, JSON.stringify(resultState));

        setState(resultState);
    }

    return [state, setPersistedState];
}