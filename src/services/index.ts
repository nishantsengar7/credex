// API services configuration and external calls
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`/api${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },
  post: async (endpoint: string, data: unknown) => {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },
};
