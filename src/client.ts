export interface PDFBridgeOptions {
  /**
   * Your PDFBridge Secret API Key. Starts with pk_live_ or pk_test_
   * If omitted, it will automatically look for process.env.PDFBRIDGE_API_KEY
   */
  apiKey?: string;
  /**
   * Override the default API base URL
   * @default "https://api.pdfbridge.xyz/api/v1"
   */
  baseUrl?: string;
  /**
   * Maximum number of retries for network errors
   * @default 2
   */
  maxRetries?: number;
}

export class PDFBridgeError extends Error {
  public statusCode?: number;
  public metadata?: any;

  constructor(message: string, statusCode?: number, metadata?: any) {
    super(message);
    this.name = "PDFBridgeError";
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
}

export class PDFBridgeClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly maxRetries: number;

  constructor(options: PDFBridgeOptions = {}) {
    const key =
      options.apiKey ||
      (typeof process !== "undefined"
        ? process.env.PDFBRIDGE_API_KEY
        : undefined);

    if (!key) {
      throw new PDFBridgeError(
        "API Key is required to initialize the PDFBridge Client. Pass it explicitly or set PDFBRIDGE_API_KEY in your environment.",
      );
    }

    this.apiKey = key;
    this.baseUrl = options.baseUrl
      ? options.baseUrl.replace(/\/$/, "")
      : "https://api.pdfbridge.xyz/api/v1";
    this.maxRetries = options.maxRetries ?? 2;
  }

  protected async request<T = any>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
      "User-Agent": "pdfbridge-node/1.0.0",
      ...(options.headers || {}),
    };

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        const response = await fetch(url, { ...options, headers });

        if (response.status === 204) return null as T;

        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");

        if (!isJson && response.ok) {
          return (await response.arrayBuffer()) as unknown as T;
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new PDFBridgeError(
            data.message ||
              data.error ||
              `Request failed with status ${response.status}`,
            response.status,
            data,
          );
        }

        return data as T;
      } catch (error: any) {
        if (error instanceof PDFBridgeError || attempt === this.maxRetries) {
          throw error;
        }
        attempt++;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 500),
        );
      }
    }

    throw new PDFBridgeError("Unknown network error occurred.");
  }
}
