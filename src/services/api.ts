export const SetDataApiStorage = async (apiKey: string) => {
  localStorage.setItem("apiKey", apiKey);
};

export const GetDataApiStorage = async () => {
  const apiKey = localStorage.getItem("apiKey");
  return { apiKey } as { apiKey: string | null };
};

export const GetAllInstances = async () => {
  const { apiKey } = await GetDataApiStorage();
  if (!apiKey) {
    throw new Error("Credenciais da API não encontradas");
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch(`${apiUrl}/instance/fetchInstances`, {
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
