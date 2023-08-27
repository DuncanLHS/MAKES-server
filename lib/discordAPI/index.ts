const discordApiBaseUrl = "https://discord.com/api";

const cache = new Map<string, unknown>();

type Method = "GET" | "POST" | "PUT" | "DELETE";

const discordAPICall = async <T>(
  endpointUrl: string,
  method: Method,
  cacheKey: string
): Promise<T | undefined> => {
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData as T;
  }

  try {
    if (!process.env.DISCORD_BOT_TOKEN) {
      throw new Error("DISCORD_BOT_TOKEN environment variable not set");
    }

    const response = await fetch(`${discordApiBaseUrl}${endpointUrl}`, {
      method,
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after")) * 1000;
      await new Promise((resolve) => setTimeout(resolve, retryAfter));
      return discordAPICall(endpointUrl, method, cacheKey);
    }

    if (!response.ok) {
      throw new Error(
        `Discord API call failed with status ${response.status} - ${response.statusText}`
      );
    }

    const responseData = (await response.json()) as T;

    cache.set(cacheKey, responseData);
    setTimeout(() => cache.delete(cacheKey), 120000); // Cache for 2 minutes
    return responseData;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Discord API call failed: ${errMessage}`);
  }
};

export default discordAPICall;
