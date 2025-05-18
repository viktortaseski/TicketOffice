const API_BASE_URL = 'http://88.200.63.148:8000';

export default API_BASE_URL;

export async function apiFetch(path, opts = {}) {
    const url = `${API_BASE_URL}${path}`;
    const defaults = {
        credentials: 'include',          // send cookies
        headers: { 'Content-Type': 'application/json' }
    };
    const finalOpts = { ...defaults, ...opts };

    if (opts.body && typeof opts.body === 'object') {
        finalOpts.body = JSON.stringify(opts.body);
    }

    return fetch(url, finalOpts);
}

