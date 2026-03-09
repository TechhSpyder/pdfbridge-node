import { z } from "zod";

export const PdfOptionsSchema = z
  .object({
    format: z
      .enum(["A4", "Letter", "Legal", "Tabloid", "Ledger", "A3"])
      .optional(),
    landscape: z.boolean().optional(),
    printBackground: z.boolean().optional(),
    scale: z.number().min(0.1).max(2).optional(),
    margin: z.string().optional(),
    marginTop: z.string().optional(),
    marginBottom: z.string().optional(),
    marginLeft: z.string().optional(),
    marginRight: z.string().optional(),
    displayHeaderFooter: z.boolean().optional(),
    headerTemplate: z.string().optional(),
    footerTemplate: z.string().optional(),
    preferCSSPageSize: z.boolean().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    waitDelay: z.string().optional(),
    userAgent: z.string().optional(),
    waitForSelector: z.string().optional(),
    metadata: z
      .object({
        title: z.string().optional(),
        author: z.string().optional(),
        subject: z.string().optional(),
        keywords: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export const ConvertRequestSchema = z
  .object({
    url: z.string().url().optional(),
    html: z.string().optional(),
    filename: z.string().optional(),
    webhookUrl: z.string().url().optional(),
    ghostMode: z.boolean().optional(),
    tailwind: z.boolean().optional(),
    extractMetadata: z.boolean().optional(),
    templateId: z.string().optional(),
    variables: z.record(z.any()).optional(),
    options: PdfOptionsSchema.optional(),
    idempotencyKey: z.string().optional(),
  })
  .refine((data) => data.url || data.html || data.templateId, {
    message: "You must provide either 'url', 'html', or 'templateId'",
    path: ["url", "html", "templateId"],
  });

export const BulkConvertRequestSchema = z.object({
  jobs: z.array(ConvertRequestSchema).min(1).max(1000),
  ghostMode: z.boolean().optional(),
  webhookUrl: z.string().url().optional(),
  extractMetadata: z.boolean().optional(),
});

export interface LineItem {
  description: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
}

export interface InvoiceExtractionResult {
  documentType: string;
  totalAmount: number | null;
  taxAmount: number | null;
  currency: string | null;
  date: string | null;
  vendorName: string | null;
  customerName: string | null;
  invoiceNumber: string | null;
  lineItems: LineItem[];
  summary: string;
  tags: string[];
  extractionVersion: string;
  requiresReview: boolean;
  processedAt: string;
}

export interface NormalizeRequest extends ConvertRequest {
  templateId?: string;
}

export type PdfOptions = z.infer<typeof PdfOptionsSchema>;
export type ConvertRequest = z.infer<typeof ConvertRequestSchema>;
export type BulkConvertRequest = z.infer<typeof BulkConvertRequestSchema>;

export interface ConvertResponse {
  message: string;
  jobId: string;
  statusUrl: string;
}

export interface JobStatusResponse {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  pdfUrl?: string | null;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
  aiMetadata?: InvoiceExtractionResult | null;
  result?: {
    url?: string;
    aiMetadata?: InvoiceExtractionResult;
    error?: string;
  };
}

export interface BulkConvertResponse {
  message: string;
  jobs: Array<{
    jobId: string;
    statusUrl: string;
  }>;
}

export interface GenerateTemplateResponse {
  html: string;
  templateId?: string;
  previewUrl?: string;
}
