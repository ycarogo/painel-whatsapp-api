export const SetDataApiStorage = async (apiUrl: string, apiKey: string) => {
  localStorage.setItem("apiUrl", apiUrl);
  localStorage.setItem("apiKey", apiKey);
};

export const GetDataApiStorage = async () => {
  const apiUrl = localStorage.getItem("apiUrl");
  const apiKey = localStorage.getItem("apiKey");
  return { apiUrl, apiKey };
};

export const GetAllInstances = async () => {
  const { apiUrl, apiKey } = await GetDataApiStorage();
  if (!apiUrl || !apiKey) {
    throw new Error("Credenciais da API não encontradas");
  }

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
