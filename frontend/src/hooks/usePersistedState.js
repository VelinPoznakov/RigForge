import {useState} from "react";

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        const persistedState = localStorage.getItem(key);

        if (persistedState) {
            const parsedState = JSON.parse(persistedState);

            if (parsedState === null)
                localStorage.removeItem(key);

            return parsedState ?? initialState;
        }

        return initialState
    });

    const setPersistedState = (value) => {
        let resultState = value;

        if (resultState === null || resultState === undefined)
            localStorage.removeItem(key);
        else
            localStorage.setItem(key, JSON.stringify(resultState));

        setState(resultState);
    }

    return [state, setPersistedState];
}