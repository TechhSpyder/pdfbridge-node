import { describe, it, expect, vi, beforeEach } from "vitest";
import { PDFBridge } from "../src/index.js";

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("PDFBridge SDK", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if initialized without an API key", () => {
    expect(() => new PDFBridge({ apiKey: "" })).toThrow(
      "API Key is required to initialize the PDFBridge Client.",
    );
  });

  it("should correctly initialize with an API key", () => {
    const client = new PDFBridge({ apiKey: "pk_test_123" });
    expect(client).toBeInstanceOf(PDFBridge);
  });

  it("should format the POST /convert request correctly", async () => {
    const client = new PDFBridge({ apiKey: "pk_test_123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        message: "PDF generation started",
        jobId: "job_123",
        statusUrl: "/api/v1/jobs/job_123",
      }),
    });

    const response = await client.generate({ url: "https://example.com" });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.pdfbridge.xyz/api/v1/convert",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": "pk_test_123",
          "Content-Type": "application/json",
          "User-Agent": "pdfbridge-node/1.0.0",
        }),
        body: JSON.stringify({ url: "https://example.com" }),
      }),
    );

    expect(response).toEqual({
      message: "PDF generation started",
      jobId: "job_123",
      statusUrl: "/api/v1/jobs/job_123",
    });
  });

  it("should retry on network failures up to maxRetries", async () => {
    // Override maxRetries to 1 for faster testing
    const client = new PDFBridge({ apiKey: "pk_test_123", maxRetries: 1 });

    // First call fails with network error
    mockFetch.mockRejectedValueOnce(new Error("Network connection lost"));
    // Second call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ jobId: "job_recovered" }),
    });

    const response = await client.generate({ url: "https://example.com" });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect((response as any).jobId).toBe("job_recovered");
  });

  it("should call POST /normalize-invoice correctly", async () => {
    const client = new PDFBridge({ apiKey: "pk_test_123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        message: "Normalization started",
        jobId: "norm_123",
        statusUrl: "/api/v1/jobs/norm_123",
      }),
    });

    const response = await client.normalizeInvoice({
      url: "https://example.com/invoice.pdf",
      idempotencyKey: "idem_123",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.pdfbridge.xyz/api/v1/normalize-invoice",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": "pk_test_123",
          "x-idempotency-key": "idem_123",
        }),
        body: JSON.stringify({
          url: "https://example.com/invoice.pdf",
          idempotencyKey: "idem_123",
        }),
      }),
    );

    expect(response).toEqual({
      message: "Normalization started",
      jobId: "norm_123",
      statusUrl: "/api/v1/jobs/norm_123",
    });
  });

  it("should call extractAndWait and poll correctly", async () => {
    const client = new PDFBridge({ apiKey: "pk_test_123" });

    // 1. Initial POST /extract
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ jobId: "ext_123" }),
    });

    // 2. Poll /jobs/ext_123 (PROCESSING)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ id: "ext_123", status: "PROCESSING" }),
    });

    // 3. Poll /jobs/ext_123 (COMPLETED)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        id: "ext_123",
        status: "COMPLETED",
        aiMetadata: { vendorName: "Test Vendor" },
      }),
    });

    const response = await client.extractAndWait(Buffer.from("%PDF"), {
      pollIntervalMs: 10,
    });

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(response.status).toBe("COMPLETED");
    expect(response.aiMetadata?.vendorName).toBe("Test Vendor");
  });

  it("should support file upload in normalizeInvoice", async () => {
    const client = new PDFBridge({ apiKey: "pk_test_123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ jobId: "norm_file_123" }),
    });

    await client.normalizeInvoice({
      file: Buffer.from("%PDF"),
      filename: "inv.pdf",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.pdfbridge.xyz/api/v1/normalize-invoice",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );
  });
});
