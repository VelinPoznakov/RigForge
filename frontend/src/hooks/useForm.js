import {useState} from "react";

export default function useForm(initialValues, validate = () => ({})) {
    const [values, setValues] = useState(initialValues);
    const [touched, setTouched] = useState({});

    const changeHandler = (e) => {
        const {name, type, value, checked, files} = e.target;

        setValues((state) => ({
            ...state,
            [name]: type === 'checkbox'
                ? checked
                : type === 'file'
                    ? files[0] ?? null
                    : value,
        }));
    };

    const blurHandler = (e) => {
        setTouched((state) => ({
            ...state,
            [e.target.name]: true,
        }));
    };

    const touchAll = () => {
        setTouched(Object.fromEntries(Object.keys(values).map(field => [field, true])));
    };

    const errors = validate(values);
    const isValid = Object.keys(errors).length === 0;

    return {
        values,
        setValues,
        changeHandler,
        blurHandler,
        errors,
        touched,
        touchAll,
        isValid,
    };
}
