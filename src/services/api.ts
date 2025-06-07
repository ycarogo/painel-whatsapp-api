export const SetDataApiStorage = async (apiKey: string) => {
  localStorage.setItem("apiKey", apiKey);
};

export const GetDataApiStorage = async () => {
  const apiUrl = localStorage.getItem("apiUrl");
  const apiKey = localStorage.getItem("apiKey");
  return { apiUrl, apiKey } as { apiUrl: string | null; apiKey: string | null };
};

export const GetAllInstances = async () => {
  const { apiUrl, apiKey } = await GetDataApiStorage();
  if (!apiUrl || !apiKey) {
    throw new Error("Credenciais da API não encontradas");
  }

  try {
    // Em produção, usa a URL completa da API
    const baseUrl = import.meta.env.PROD ? apiUrl : "/api";

    const response = await fetch(`${baseUrl}/instance/fetchInstances`, {
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar instâncias:", error);
    throw error;
  }
};
