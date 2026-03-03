import { PDFBridgeClient, PDFBridgeOptions, PDFBridgeError } from "./client.js";
import {
  ConvertRequestSchema,
  BulkConvertRequestSchema,
  ConvertRequest,
  ConvertResponse,
  BulkConvertRequest,
  BulkConvertResponse,
  JobStatusResponse,
} from "./types.js";

export * from "./types.js";
export * from "./client.js";

export class PDFBridge extends PDFBridgeClient {
  constructor(options?: PDFBridgeOptions) {
    super(options);
  }

  /**
   * Start a new single URL or HTML to PDF conversion job.
   * By default, this returns a jobId. You must poll or use webhooks to get the result.
   */
  public async generate(
    payload: ConvertRequest & { ghostMode?: false | undefined },
  ): Promise<ConvertResponse>;
  /**
   * **Enterprise Only**: Render the PDF without storing it. Returns the binary ArrayBuffer immediately.
   */
  public async generate(
    payload: ConvertRequest & { ghostMode: true },
  ): Promise<ArrayBuffer>;
  public async generate(
    payload: ConvertRequest,
  ): Promise<ConvertResponse | ArrayBuffer> {
    const validated = ConvertRequestSchema.parse(payload);
    return this.request<ConvertResponse | ArrayBuffer>("/convert", {
      method: "POST",
      body: JSON.stringify(validated),
    });
  }

  /**
   * Start a new single URL or HTML to PDF conversion job, and automatically poll
   * the status endpoint until the job is COMPLETED or FAILED.
   * Returns the final JobStatusResponse containing the PDF URL.
   *
   * Note: This method will block for up to 2-5 minutes depending on PDF complexity.
   * Do not use this method with \`ghostMode: true\`.
   */
  public async generateAndWait(
    payload: ConvertRequest,
    pollIntervalMs: number = 2000,
  ): Promise<JobStatusResponse> {
    if (payload.ghostMode) {
      throw new PDFBridgeError(
        "Cannot use generateAndWait with ghostMode: true. Using ghostMode natively returns the ArrayBuffer immediately on the standard .generate() method.",
      );
    }

    const initResponse = (await this.generate(
      payload as any,
    )) as ConvertResponse;
    const jobId = initResponse.jobId;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      const status = await this.getJob(jobId);

      if (status.status === "COMPLETED") {
        return status;
      }
      if (status.status === "FAILED") {
        throw new PDFBridgeError(`Job failed: ${status.error}`, 400, status);
      }
    }
  }

  /**
   * Start a bulk conversion job for up to 1,000 documents at once.
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
   * Retrieve the status of an existing conversion job.
   */
  public async getJob(jobId: string): Promise<JobStatusResponse> {
    return this.request<JobStatusResponse>(`/jobs/${jobId}`, {
      method: "GET",
    });
  }
}

export default PDFBridge;
