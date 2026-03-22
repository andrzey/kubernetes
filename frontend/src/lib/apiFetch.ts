export async function apiFetch<T>(
  endpoint: string,
  { body, ...customConfig }: { body?: unknown } & RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(customConfig.headers || {}),
  };

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    credentials: "include",
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = body;
  }

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://api.local:8080";
  const response = await fetch(
    `${baseUrl}/${endpoint.replace(/^\//, "")}`,
    config,
  );

  const data = await response.json().catch(() => undefined);

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}
