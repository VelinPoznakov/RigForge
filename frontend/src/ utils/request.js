import {useCallback, useEffect, useState} from "react";

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function baseRequest(method='GET', path='/', data=null, includeFile=false, opt={}) {

    const fullUrl = `${BASE_URL}${path}`;

    const options = {
        ...opt,
        headers: {
            ...opt.headers,
            ...getAuthHeaders()
        }
    }

    if(method !== 'GET')
        options.method = method;

    if(data && includeFile){
        options.body = data;
    }
    else if(data){
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }

    let response;

    try {
        response = await fetch(fullUrl, options);
    }
    catch {
        throw formatErrors(null, null, true);
    }

    const result = await response.json().catch(() => null);

    if (!response.ok)
        throw formatErrors(response.status, result);

    return result;
}

export default function useFetchData(initialState, path='/'){

    const [data, setData] = useState(initialState);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setLoading(true);
        setErrors(null);

        const abortController = new AbortController();

        baseRequest('GET', path, null, false, { signal: abortController.signal })
            .then(result => setData(result))
            .catch(err => setErrors(err))
            .finally(() => setLoading(false));

        return () => {
            abortController.abort();
        }

    }, [path, refresh])

    const onRefresh = () => setRefresh(!refresh);

    return {data, setData, errors, loading, onRefresh};
}

export async function mutate(method, path, data = null, includeFile = false, opt = {}) {
    return baseRequest(method, path, data, includeFile, opt);
}

function formatErrors(status, body = null, isInternalError = false){

    const result = {
        status: status,
        isInternalError: isInternalError,
        general: body?.message ?? null,
        messages: {}
    };

    if(isInternalError)
        return result;

    for (const field in body?.errors)
        result.messages[field] = body.errors[field][0];

    return result;
}

function getAuthHeaders(){
    const data = localStorage.getItem('auth');
    const token = data ? JSON.parse(data).token : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function toQueryString(params) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== '' && value !== null && value !== undefined)
            query.append(key, value);
    }

    return query.toString();
}

