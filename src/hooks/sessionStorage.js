import { useEffect, useState } from 'react';

const useToggleSessionStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        // Check if window is defined
        if (typeof window !== 'undefined') {
            const storedValue = sessionStorage.getItem(key);
            return storedValue !== null ? JSON.parse(storedValue) : initialValue;
        }
        return initialValue; // Return initial value if window is undefined
    });

    const toggleValue = () => {
        const newValue = !value;
        setValue(newValue);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(key, JSON.stringify(newValue));
        }
    };

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key) {
                setValue(event.newValue !== null ? JSON.parse(event.newValue) : initialValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [value, toggleValue];
};

export default useToggleSessionStorage;