import { PDFBridgeClient, PDFBridgeOptions, PDFBridgeError } from "./client";
import {
  ConvertRequestSchema,
  BulkConvertRequestSchema,
  ConvertRequest,
  ConvertResponse,
  BulkConvertRequest,
  BulkConvertResponse,
  JobStatusResponse,
  NormalizeRequest,
  GenerateTemplateResponse,
} from "./types";

export * from "./types";
export * from "./client";

/**
 * Browser-safe version of the PDFBridge SDK.
 * Excludes Node-specific file system methods to ensure compatibility with all bundlers.
 */
export class PDFBridge extends PDFBridgeClient {
  constructor(options?: PDFBridgeOptions) {
    super(options);
  }

  /**
   * Start a new single URL or HTML to PDF conversion job.
   */
  public async generate(
    payload: ConvertRequest & { ghostMode?: false | undefined },
  ): Promise<ConvertResponse>;
  public async generate(
    payload: ConvertRequest & { ghostMode: true },
  ): Promise<ArrayBuffer>;
  public async generate(
    payload: ConvertRequest,
  ): Promise<ConvertResponse | ArrayBuffer> {
    const validated = ConvertRequestSchema.parse(payload);
    const headers: Record<string, string> = {};
    if (validated.idempotencyKey) {
      headers["x-idempotency-key"] = validated.idempotencyKey;
    }

    return this.request<ConvertResponse | ArrayBuffer>("/convert", {
      method: "POST",
      body: JSON.stringify(validated),
      headers,
    });
  }

  /**
   * Start a new conversion job and poll until completion.
   */
  public async generateAndWait(
    payload: ConvertRequest,
    pollIntervalMs: number = 2000,
  ): Promise<JobStatusResponse> {
    const initResponse = (await this.generate(payload as any)) as ConvertResponse;
    const jobId = initResponse.jobId;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      const status = await this.getJob(jobId);
      if (status.status === "COMPLETED") return status;
      if (status.status === "FAILED") {
        throw new PDFBridgeError(`Job failed: ${status.error}`, 400, status);
      }
    }
  }

  /**
   * Extract structured AI metadata from an existing PDF file.
   * (Browser version - supports Blob/File/Uint8Array)
   */
  public async extract(
    file: Blob | File | Uint8Array,
    options: { filename?: string; idempotencyKey?: string } = {},
  ): Promise<ConvertResponse> {
    const formData = new FormData();
    const blob = file instanceof Uint8Array ? new Blob([file] as any, { type: "application/pdf" }) : file;
    formData.append("file", blob, options.filename || (file as File).name || "file.pdf");

    return this.request<ConvertResponse>("/extract", {
      method: "POST",
      body: formData as any,
      headers: options.idempotencyKey ? { "x-idempotency-key": options.idempotencyKey } : {},
    });
  }

  /**
   * Extract structured AI metadata and poll for completion.
   */
  public async extractAndWait(
    file: Blob | File | Uint8Array,
    options: { filename?: string; idempotencyKey?: string; pollIntervalMs?: number } = {},
  ): Promise<JobStatusResponse> {
    const initResponse = await this.extract(file, options);
    const jobId = initResponse.jobId;
    const pollIntervalMs = options.pollIntervalMs || 2000;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      const status = await this.getJob(jobId);
      if (status.status === "COMPLETED") return status;
      if (status.status === "FAILED") {
        throw new PDFBridgeError(`Extraction failed: ${status.error}`, 400, status);
      }
    }
  }

  /**
   * Ingests a raw document, extracts data, and regenerates a normalized PDF.
   * (Browser version - supports Blob/File/Uint8Array)
   */
  public async normalizeInvoice(
    payload: NormalizeRequest | { file: Blob | File | Uint8Array; filename?: string; idempotencyKey?: string },
  ): Promise<ConvertResponse> {
    if ("file" in payload) {
      const formData = new FormData();
      const blob = payload.file instanceof Uint8Array ? new Blob([payload.file] as any, { type: "application/pdf" }) : payload.file;
      formData.append("file", blob, payload.filename || (payload.file as File).name || "file.pdf");

      return this.request<ConvertResponse>("/normalize-invoice", {
        method: "POST",
        body: formData as any,
        headers: payload.idempotencyKey ? { "x-idempotency-key": payload.idempotencyKey } : {},
      });
    }

    const validated = ConvertRequestSchema.parse(payload);
    return this.request<ConvertResponse>("/normalize-invoice", {
      method: "POST",
      body: JSON.stringify(validated),
      headers: validated.idempotencyKey ? { "x-idempotency-key": validated.idempotencyKey } : {},
    });
  }

  /**
   * Alias for generate.
   */
  public async convert(
    payload: ConvertRequest & { ghostMode?: false | undefined },
  ): Promise<ConvertResponse>;
  public async convert(
    payload: ConvertRequest & { ghostMode: true },
  ): Promise<ArrayBuffer>;
  public async convert(
    payload: ConvertRequest,
  ): Promise<ConvertResponse | ArrayBuffer> {
    return this.generate(payload as any);
  }

  /**
   * Alias for generateAndWait.
   */
  public async convertAndWait(
    payload: ConvertRequest,
    pollIntervalMs: number = 2000,
  ): Promise<JobStatusResponse> {
    return this.generateAndWait(payload, pollIntervalMs);
  }

  /**
   * Start a bulk conversion job.
   */
  public async generateBulk(
    payload: BulkConvertRequest,
  ): Promise<BulkConvertResponse> {
    const validated = BulkConvertRequestSchema.parse(payload);
    return this.request<BulkConvertResponse>("/convert/bulk", {
      method: "POST",
      body: JSON.stringify(validated),
    });
  }

  /**
   * Perform a raw API request.
   */
  public async rawRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, options);
  }

  /**
   * Retrieve the status of an existing conversion job.
   */
  public async getJob(jobId: string): Promise<JobStatusResponse> {
    return this.request<JobStatusResponse>(`/jobs/${jobId}`, {
      method: "GET",
    });
  }

  // --- Integration Management ---
  public async getIntegrations(): Promise<any[]> {
    return this.request<any[]>("/integrations/connected", { method: "GET" });
  }

  public async getConnectUrl(provider: string): Promise<{ url: string }> {
    return this.request<{ url: string }>(`/integrations/${provider}/connect`, { method: "GET" });
  }

  public async disconnectIntegration(provider: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/integrations/${provider}/disconnect`, { method: "DELETE" });
  }

  /**
   * Generate a new PDF template using AI.
   * Part of the AI Template Lab.
   */
  public async generateTemplate(prompt: string): Promise<GenerateTemplateResponse> {
    return this.request<GenerateTemplateResponse>("/templates/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
  }
}

export default PDFBridge;
