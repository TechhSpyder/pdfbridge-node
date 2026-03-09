export interface PDFBridgeOptions {
  /**
   * Your PDFBridge Secret API Key. Starts with pk_live_ or pk_test_
   * Used for server-to-server communication.
   * If omitted, it will automatically look for process.env.PDFBRIDGE_API_KEY
   */
  apiKey?: string;
  /**
   * For client-side/dashboard usage. Pass a Clerk JWT or other Bearer token.
   * Overrides apiKey if provided.
   */
  bearerToken?: string;
  /**
   * Optional Organization ID for multi-tenant requests.
   * Maps to the 'x-org-id' header.
   */
  organizationId?: string;
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
  /**
   * If true, the client will not require an API key or bearer token in the constructor.
   * Fetch requests will include 'credentials: include' to support session cookies.
   */
  useCookies?: boolean;
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
  private readonly apiKey?: string;
  private readonly bearerToken?: string;
  private readonly organizationId?: string;
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly useCookies: boolean;

  constructor(options: PDFBridgeOptions = {}) {
    const key =
      options.apiKey ||
      (typeof process !== "undefined"
        ? process.env.PDFBRIDGE_API_KEY
        : undefined);

    if (!key && !options.bearerToken && !options.useCookies) {
      throw new PDFBridgeError(
        "API Key or Bearer Token is required to initialize the PDFBridge Client.",
      );
    }

    this.apiKey = key;
    this.bearerToken = options.bearerToken;
    this.organizationId = options.organizationId;
    this.baseUrl = options.baseUrl
      ? options.baseUrl.replace(/\/$/, "")
      : "https://api.pdfbridge.xyz/api/v1";
    this.maxRetries = options.maxRetries ?? 2;
    this.useCookies = options.useCookies ?? false;
  }

  protected async request<T = any>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    const headers: Record<string, string> = {
      "User-Agent": "pdfbridge-node/1.1.1",
    };

    // Safely merge headers
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    // Auto-Idempotency: If it's a mutation and no key provided, generate one.
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(options.method || "GET");
    const idempotencyInHeaders = headers["x-idempotency-key"] || headers["X-Idempotency-Key"];
    if (isMutation && !idempotencyInHeaders) {
      headers["x-idempotency-key"] = `sdk_${Math.random().toString(36).substring(2, 15)}`;
    }

    // Auth Strategy
    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    } else if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    if (this.organizationId) {
      headers["x-org-id"] = this.organizationId;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        const fetchOptions: RequestInit = { ...options, headers };

        // Pass credentials if in cookie mode to support Better-Auth
        if (this.useCookies) {
          fetchOptions.credentials = "include";
        }

        const response = await fetch(url, fetchOptions);

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

  /**
   * Verify that a webhook request was sent by PDFBridge.
   * Uses HMAC-SHA256 with the organization's webhook secret.
   */
  public static async verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
  ): Promise<boolean> {
    if (!payload || !signature || !secret) return false;

    const crypto = await import("crypto");
    const hmac = crypto.createHmac("sha256", secret);
    const expected = hmac.update(payload).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }
}
