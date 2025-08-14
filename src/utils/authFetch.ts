const server = import.meta.env.VITE_SERVER_URL;

export const authFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
) => {
  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) || undefined),
  };
  headers["X-User-ID"] = `${localStorage.getItem("userId")}`;
  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const opts: RequestInit = {
    ...init,
    headers: {
      ...(init.headers as any),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    credentials: "include",
  };
  let res = await fetch(input, opts);
  if (res.status === 401) {
    const r = await fetch(`${server}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (r.ok) {
      res = await fetch(input, opts);
    }
  }
  return res;
};
