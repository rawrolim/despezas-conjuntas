import { useState } from "react";

export default function useLocalStorage(key = '', defaultValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = localStorage.getItem(key);

            if (value) {
                return JSON.parse(value);
            } else {
                localStorage.setItem(key, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (erro) {
            return defaultValue;
        }
    });

    function setValue(newValue = '') {
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (erro) {
            console.log(erro);
        }
        setStoredValue(newValue);
    }

    return [storedValue, setValue];
}