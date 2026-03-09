import { PDFBridge as PDFBridgeBase } from "./index";
import {
  ConvertResponse,
  JobStatusResponse,
  NormalizeRequest,
  ConvertRequestSchema,
} from "./types";
import { PDFBridgeError } from "./client";

export * from "./types";
export * from "./client";
export * from "./index";

/**
 * Node.js specific version of the PDFBridge SDK.
 * Includes file system methods like 'extract' and 'normalizeInvoice' (via file path/buffer).
 */
export class PDFBridge extends PDFBridgeBase {
  /**
   * Extract structured AI metadata from an existing PDF file.
   * Overrides base method to support Node.js Buffers and File paths.
   */
  public override async extract(
    file: Buffer | Uint8Array | Blob | string,
    options: { filename?: string; idempotencyKey?: string } = {},
  ): Promise<ConvertResponse> {
    if (typeof file === "string") {
      const fs = await import("fs");
      const buffer = fs.readFileSync(file);
      const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
      return super.extract(blob, options);
    } else if (typeof Buffer !== "undefined" && file instanceof Buffer) {
      const blob = new Blob([new Uint8Array(file)], { type: "application/pdf" });
      return super.extract(blob, options);
    }
    return super.extract(file as Blob, options);
  }

  /**
   * Extract structured AI metadata and poll for completion.
   */
  public override async extractAndWait(
    file: Buffer | Uint8Array | Blob | string,
    options: { filename?: string; idempotencyKey?: string; pollIntervalMs?: number } = {},
  ): Promise<JobStatusResponse> {
    const pollIntervalMs = options.pollIntervalMs || 2000;
    const initResponse = await this.extract(file, options);
    const jobId = initResponse.jobId;

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
   * Overrides base method to support Node.js Buffers and File paths.
   */
  public override async normalizeInvoice(
    payload: NormalizeRequest | { file: Buffer | Uint8Array | Blob | string; filename?: string; idempotencyKey?: string },
  ): Promise<ConvertResponse> {
    if ("file" in payload) {
      const file = payload.file;
      if (typeof file === "string") {
        const fs = await import("fs");
        const buffer = fs.readFileSync(file);
        const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
        return super.normalizeInvoice({ ...payload, file: blob });
      } else if (typeof Buffer !== "undefined" && file instanceof Buffer) {
        const blob = new Blob([new Uint8Array(file)], { type: "application/pdf" });
        return super.normalizeInvoice({ ...payload, file: blob });
      }
      return super.normalizeInvoice(payload as { file: Blob; filename?: string; idempotencyKey?: string });
    }

    return super.normalizeInvoice(payload);
  }

  /**
   * Alias for generate.
   */
  public override async convert(
    payload: any,
  ): Promise<any> {
    return super.convert(payload);
  }

  /**
   * Alias for generateAndWait.
   */
  public override async convertAndWait(
    payload: any,
    pollIntervalMs: number = 2000,
  ): Promise<any> {
    return super.convertAndWait(payload, pollIntervalMs);
  }
}

export default PDFBridge;
