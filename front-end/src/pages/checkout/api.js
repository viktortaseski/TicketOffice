// src/api.js
const API_BASE_URL = 'http://88.200.63.148:8000';

/**
 * A drop-in replacement for fetch() that:
 *  • prefixes your API_BASE_URL
 *  • always sends session cookies (credentials: 'include')
 *  • auto-JSON-serializes any object `body` you pass
 */
export async function apiFetch(path, opts = {}) {
    const url = `${API_BASE_URL}${path}`;

    // defaults
    const defaultOpts = {
        credentials: 'include',
        headers: {},
    };

    // merge in any overrides
    const finalOpts = { ...defaultOpts, ...opts };

    // if you passed an object body → JSON.stringify + header
    if (opts.body && typeof opts.body === 'object') {
        finalOpts.body = JSON.stringify(opts.body);
        finalOpts.headers['Content-Type'] = 'application/json';
    }

    return fetch(url, finalOpts);
}

export default API_BASE_URL;
