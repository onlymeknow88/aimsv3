import React, { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) {
    const [value, setValue] = useState(initialValue);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChangeRef.current(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, debounce]);

    return React.createElement("input", {
        ...props,
        value: value,
        onChange: e => setValue(e.target.value)
    });
}
