const server = import.meta.env.VITE_SERVER_URL;

export const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers: Record<string, string> = {
        ...(init.headers as Record<string, string> || {})
    };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    headers['X-User-ID'] = `${localStorage.getItem('userId')}`;
    if (init.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
    }
    const opts: RequestInit = {
        ...init, headers, credentials: 'include'
    };
    let res = await fetch(input, opts);
    if (res.status === 401 || res.status === 403) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const r = await fetch(`${server}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
            if (r.ok) {
                const data = await r.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                if (data.user?.id) {
                    localStorage.setItem('userId', String(data.user.id));
                }
                headers['Authorization'] = `Bearer ${data.token}`;
                res = await fetch(input, { ...init, headers, credentials: 'include' });
            }
        }
    }
    return res;
};   