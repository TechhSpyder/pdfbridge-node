import { z } from 'zod';

interface PDFBridgeOptions {
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
declare class PDFBridgeError extends Error {
    statusCode?: number;
    metadata?: any;
    constructor(message: string, statusCode?: number, metadata?: any);
}
declare class PDFBridgeClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly maxRetries;
    constructor(options?: PDFBridgeOptions);
    protected request<T = any>(path: string, options?: RequestInit): Promise<T>;
}

declare const PdfOptionsSchema: z.ZodObject<{
    format: z.ZodOptional<z.ZodEnum<["A4", "Letter", "Legal", "Tabloid", "Ledger", "A3"]>>;
    landscape: z.ZodOptional<z.ZodBoolean>;
    printBackground: z.ZodOptional<z.ZodBoolean>;
    scale: z.ZodOptional<z.ZodNumber>;
    margin: z.ZodOptional<z.ZodString>;
    marginTop: z.ZodOptional<z.ZodString>;
    marginBottom: z.ZodOptional<z.ZodString>;
    marginLeft: z.ZodOptional<z.ZodString>;
    marginRight: z.ZodOptional<z.ZodString>;
    displayHeaderFooter: z.ZodOptional<z.ZodBoolean>;
    headerTemplate: z.ZodOptional<z.ZodString>;
    footerTemplate: z.ZodOptional<z.ZodString>;
    preferCSSPageSize: z.ZodOptional<z.ZodBoolean>;
    width: z.ZodOptional<z.ZodString>;
    height: z.ZodOptional<z.ZodString>;
    waitDelay: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    waitForSelector: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        subject: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        author?: string | undefined;
        subject?: string | undefined;
        keywords?: string | undefined;
    }, {
        title?: string | undefined;
        author?: string | undefined;
        subject?: string | undefined;
        keywords?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
    landscape?: boolean | undefined;
    printBackground?: boolean | undefined;
    scale?: number | undefined;
    margin?: string | undefined;
    marginTop?: string | undefined;
    marginBottom?: string | undefined;
    marginLeft?: string | undefined;
    marginRight?: string | undefined;
    displayHeaderFooter?: boolean | undefined;
    headerTemplate?: string | undefined;
    footerTemplate?: string | undefined;
    preferCSSPageSize?: boolean | undefined;
    width?: string | undefined;
    height?: string | undefined;
    waitDelay?: string | undefined;
    userAgent?: string | undefined;
    waitForSelector?: string | undefined;
    metadata?: {
        title?: string | undefined;
        author?: string | undefined;
        subject?: string | undefined;
        keywords?: string | undefined;
    } | undefined;
}, {
    format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
    landscape?: boolean | undefined;
    printBackground?: boolean | undefined;
    scale?: number | undefined;
    margin?: string | undefined;
    marginTop?: string | undefined;
    marginBottom?: string | undefined;
    marginLeft?: string | undefined;
    marginRight?: string | undefined;
    displayHeaderFooter?: boolean | undefined;
    headerTemplate?: string | undefined;
    footerTemplate?: string | undefined;
    preferCSSPageSize?: boolean | undefined;
    width?: string | undefined;
    height?: string | undefined;
    waitDelay?: string | undefined;
    userAgent?: string | undefined;
    waitForSelector?: string | undefined;
    metadata?: {
        title?: string | undefined;
        author?: string | undefined;
        subject?: string | undefined;
        keywords?: string | undefined;
    } | undefined;
}>;
declare const ConvertRequestSchema: z.ZodEffects<z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    filename: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    ghostMode: z.ZodOptional<z.ZodBoolean>;
    tailwind: z.ZodOptional<z.ZodBoolean>;
    extractMetadata: z.ZodOptional<z.ZodBoolean>;
    templateId: z.ZodOptional<z.ZodString>;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    options: z.ZodOptional<z.ZodObject<{
        format: z.ZodOptional<z.ZodEnum<["A4", "Letter", "Legal", "Tabloid", "Ledger", "A3"]>>;
        landscape: z.ZodOptional<z.ZodBoolean>;
        printBackground: z.ZodOptional<z.ZodBoolean>;
        scale: z.ZodOptional<z.ZodNumber>;
        margin: z.ZodOptional<z.ZodString>;
        marginTop: z.ZodOptional<z.ZodString>;
        marginBottom: z.ZodOptional<z.ZodString>;
        marginLeft: z.ZodOptional<z.ZodString>;
        marginRight: z.ZodOptional<z.ZodString>;
        displayHeaderFooter: z.ZodOptional<z.ZodBoolean>;
        headerTemplate: z.ZodOptional<z.ZodString>;
        footerTemplate: z.ZodOptional<z.ZodString>;
        preferCSSPageSize: z.ZodOptional<z.ZodBoolean>;
        width: z.ZodOptional<z.ZodString>;
        height: z.ZodOptional<z.ZodString>;
        waitDelay: z.ZodOptional<z.ZodString>;
        userAgent: z.ZodOptional<z.ZodString>;
        waitForSelector: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            subject: z.ZodOptional<z.ZodString>;
            keywords: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        }, {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
        landscape?: boolean | undefined;
        printBackground?: boolean | undefined;
        scale?: number | undefined;
        margin?: string | undefined;
        marginTop?: string | undefined;
        marginBottom?: string | undefined;
        marginLeft?: string | undefined;
        marginRight?: string | undefined;
        displayHeaderFooter?: boolean | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        width?: string | undefined;
        height?: string | undefined;
        waitDelay?: string | undefined;
        userAgent?: string | undefined;
        waitForSelector?: string | undefined;
        metadata?: {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        } | undefined;
    }, {
        format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
        landscape?: boolean | undefined;
        printBackground?: boolean | undefined;
        scale?: number | undefined;
        margin?: string | undefined;
        marginTop?: string | undefined;
        marginBottom?: string | undefined;
        marginLeft?: string | undefined;
        marginRight?: string | undefined;
        displayHeaderFooter?: boolean | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        width?: string | undefined;
        height?: string | undefined;
        waitDelay?: string | undefined;
        userAgent?: string | undefined;
        waitForSelector?: string | undefined;
        metadata?: {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    url?: string | undefined;
    html?: string | undefined;
    filename?: string | undefined;
    webhookUrl?: string | undefined;
    ghostMode?: boolean | undefined;
    tailwind?: boolean | undefined;
    extractMetadata?: boolean | undefined;
    templateId?: string | undefined;
    options?: {
        format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
        landscape?: boolean | undefined;
        printBackground?: boolean | undefined;
        scale?: number | undefined;
        margin?: string | undefined;
        marginTop?: string | undefined;
        marginBottom?: string | undefined;
        marginLeft?: string | undefined;
        marginRight?: string | undefined;
        displayHeaderFooter?: boolean | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        width?: string | undefined;
        height?: string | undefined;
        waitDelay?: string | undefined;
        userAgent?: string | undefined;
        waitForSelector?: string | undefined;
        metadata?: {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        } | undefined;
    } | undefined;
    variables?: Record<string, any> | undefined;
}, {
    url?: string | undefined;
    html?: string | undefined;
    filename?: string | undefined;
    webhookUrl?: string | undefined;
    ghostMode?: boolean | undefined;
    tailwind?: boolean | undefined;
    extractMetadata?: boolean | undefined;
    templateId?: string | undefined;
    options?: {
        format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
        landscape?: boolean | undefined;
        printBackground?: boolean | undefined;
        scale?: number | undefined;
        margin?: string | undefined;
        marginTop?: string | undefined;
        marginBottom?: string | undefined;
        marginLeft?: string | undefined;
        marginRight?: string | undefined;
        displayHeaderFooter?: boolean | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        width?: string | undefined;
        height?: string | undefined;
        waitDelay?: string | undefined;
        userAgent?: string | undefined;
        waitForSelector?: string | undefined;
        metadata?: {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        } | undefined;
    } | undefined;
    variables?: Record<string, any> | undefined;
}>, {
    url?: string | undefined;
    html?: string | undefined;
    filename?: string | undefined;
    webhookUrl?: string | undefined;
    ghostMode?: boolean | undefined;
    tailwind?: boolean | undefined;
    extractMetadata?: boolean | undefined;
    templateId?: string | undefined;
    options?: {
        format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
        landscape?: boolean | undefined;
        printBackground?: boolean | undefined;
        scale?: number | undefined;
        margin?: string | undefined;
        marginTop?: string | undefined;
        marginBottom?: string | undefined;
        marginLeft?: string | undefined;
        marginRight?: string | undefined;
        displayHeaderFooter?: boolean | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        width?: string | undefined;
        height?: string | undefined;
        waitDelay?: string | undefined;
        userAgent?: string | undefined;
        waitForSelector?: string | undefined;
        metadata?: {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        } | undefined;
    } | undefined;
    variables?: Record<string, any> | undefined;
}, {
    url?: string | undefined;
    html?: string | undefined;
    filename?: string | undefined;
    webhookUrl?: string | undefined;
    ghostMode?: boolean | undefined;
    tailwind?: boolean | undefined;
    extractMetadata?: boolean | undefined;
    templateId?: string | undefined;
    options?: {
        format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
        landscape?: boolean | undefined;
        printBackground?: boolean | undefined;
        scale?: number | undefined;
        margin?: string | undefined;
        marginTop?: string | undefined;
        marginBottom?: string | undefined;
        marginLeft?: string | undefined;
        marginRight?: string | undefined;
        displayHeaderFooter?: boolean | undefined;
        headerTemplate?: string | undefined;
        footerTemplate?: string | undefined;
        preferCSSPageSize?: boolean | undefined;
        width?: string | undefined;
        height?: string | undefined;
        waitDelay?: string | undefined;
        userAgent?: string | undefined;
        waitForSelector?: string | undefined;
        metadata?: {
            title?: string | undefined;
            author?: string | undefined;
            subject?: string | undefined;
            keywords?: string | undefined;
        } | undefined;
    } | undefined;
    variables?: Record<string, any> | undefined;
}>;
declare const BulkConvertRequestSchema: z.ZodObject<{
    jobs: z.ZodArray<z.ZodEffects<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        html: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
        ghostMode: z.ZodOptional<z.ZodBoolean>;
        tailwind: z.ZodOptional<z.ZodBoolean>;
        extractMetadata: z.ZodOptional<z.ZodBoolean>;
        templateId: z.ZodOptional<z.ZodString>;
        variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        options: z.ZodOptional<z.ZodObject<{
            format: z.ZodOptional<z.ZodEnum<["A4", "Letter", "Legal", "Tabloid", "Ledger", "A3"]>>;
            landscape: z.ZodOptional<z.ZodBoolean>;
            printBackground: z.ZodOptional<z.ZodBoolean>;
            scale: z.ZodOptional<z.ZodNumber>;
            margin: z.ZodOptional<z.ZodString>;
            marginTop: z.ZodOptional<z.ZodString>;
            marginBottom: z.ZodOptional<z.ZodString>;
            marginLeft: z.ZodOptional<z.ZodString>;
            marginRight: z.ZodOptional<z.ZodString>;
            displayHeaderFooter: z.ZodOptional<z.ZodBoolean>;
            headerTemplate: z.ZodOptional<z.ZodString>;
            footerTemplate: z.ZodOptional<z.ZodString>;
            preferCSSPageSize: z.ZodOptional<z.ZodBoolean>;
            width: z.ZodOptional<z.ZodString>;
            height: z.ZodOptional<z.ZodString>;
            waitDelay: z.ZodOptional<z.ZodString>;
            userAgent: z.ZodOptional<z.ZodString>;
            waitForSelector: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodObject<{
                title: z.ZodOptional<z.ZodString>;
                author: z.ZodOptional<z.ZodString>;
                subject: z.ZodOptional<z.ZodString>;
                keywords: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            }, {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            }>>;
        }, "strict", z.ZodTypeAny, {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        }, {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        html?: string | undefined;
        filename?: string | undefined;
        webhookUrl?: string | undefined;
        ghostMode?: boolean | undefined;
        tailwind?: boolean | undefined;
        extractMetadata?: boolean | undefined;
        templateId?: string | undefined;
        options?: {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        } | undefined;
        variables?: Record<string, any> | undefined;
    }, {
        url?: string | undefined;
        html?: string | undefined;
        filename?: string | undefined;
        webhookUrl?: string | undefined;
        ghostMode?: boolean | undefined;
        tailwind?: boolean | undefined;
        extractMetadata?: boolean | undefined;
        templateId?: string | undefined;
        options?: {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        } | undefined;
        variables?: Record<string, any> | undefined;
    }>, {
        url?: string | undefined;
        html?: string | undefined;
        filename?: string | undefined;
        webhookUrl?: string | undefined;
        ghostMode?: boolean | undefined;
        tailwind?: boolean | undefined;
        extractMetadata?: boolean | undefined;
        templateId?: string | undefined;
        options?: {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        } | undefined;
        variables?: Record<string, any> | undefined;
    }, {
        url?: string | undefined;
        html?: string | undefined;
        filename?: string | undefined;
        webhookUrl?: string | undefined;
        ghostMode?: boolean | undefined;
        tailwind?: boolean | undefined;
        extractMetadata?: boolean | undefined;
        templateId?: string | undefined;
        options?: {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        } | undefined;
        variables?: Record<string, any> | undefined;
    }>, "many">;
    ghostMode: z.ZodOptional<z.ZodBoolean>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    extractMetadata: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    jobs: {
        url?: string | undefined;
        html?: string | undefined;
        filename?: string | undefined;
        webhookUrl?: string | undefined;
        ghostMode?: boolean | undefined;
        tailwind?: boolean | undefined;
        extractMetadata?: boolean | undefined;
        templateId?: string | undefined;
        options?: {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        } | undefined;
        variables?: Record<string, any> | undefined;
    }[];
    webhookUrl?: string | undefined;
    ghostMode?: boolean | undefined;
    extractMetadata?: boolean | undefined;
}, {
    jobs: {
        url?: string | undefined;
        html?: string | undefined;
        filename?: string | undefined;
        webhookUrl?: string | undefined;
        ghostMode?: boolean | undefined;
        tailwind?: boolean | undefined;
        extractMetadata?: boolean | undefined;
        templateId?: string | undefined;
        options?: {
            format?: "A4" | "Letter" | "Legal" | "Tabloid" | "Ledger" | "A3" | undefined;
            landscape?: boolean | undefined;
            printBackground?: boolean | undefined;
            scale?: number | undefined;
            margin?: string | undefined;
            marginTop?: string | undefined;
            marginBottom?: string | undefined;
            marginLeft?: string | undefined;
            marginRight?: string | undefined;
            displayHeaderFooter?: boolean | undefined;
            headerTemplate?: string | undefined;
            footerTemplate?: string | undefined;
            preferCSSPageSize?: boolean | undefined;
            width?: string | undefined;
            height?: string | undefined;
            waitDelay?: string | undefined;
            userAgent?: string | undefined;
            waitForSelector?: string | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
                subject?: string | undefined;
                keywords?: string | undefined;
            } | undefined;
        } | undefined;
        variables?: Record<string, any> | undefined;
    }[];
    webhookUrl?: string | undefined;
    ghostMode?: boolean | undefined;
    extractMetadata?: boolean | undefined;
}>;
type PdfOptions = z.infer<typeof PdfOptionsSchema>;
type ConvertRequest = z.infer<typeof ConvertRequestSchema>;
type BulkConvertRequest = z.infer<typeof BulkConvertRequestSchema>;
interface ConvertResponse {
    message: string;
    jobId: string;
    statusUrl: string;
}
interface JobStatusResponse {
    id: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    pdfUrl?: string | null;
    error?: string | null;
    createdAt: string;
    updatedAt: string;
    metadata?: any;
}
interface BulkConvertResponse {
    message: string;
    jobs: Array<{
        jobId: string;
        statusUrl: string;
    }>;
}

declare class PDFBridge extends PDFBridgeClient {
    constructor(options?: PDFBridgeOptions);
    /**
     * Start a new single URL or HTML to PDF conversion job.
     * By default, this returns a jobId. You must poll or use webhooks to get the result.
     */
    generate(payload: ConvertRequest & {
        ghostMode?: false | undefined;
    }): Promise<ConvertResponse>;
    /**
     * **Enterprise Only**: Render the PDF without storing it. Returns the binary ArrayBuffer immediately.
     */
    generate(payload: ConvertRequest & {
        ghostMode: true;
    }): Promise<ArrayBuffer>;
    /**
     * Start a new single URL or HTML to PDF conversion job, and automatically poll
     * the status endpoint until the job is COMPLETED or FAILED.
     * Returns the final JobStatusResponse containing the PDF URL.
     *
     * Note: This method will block for up to 2-5 minutes depending on PDF complexity.
     * Do not use this method with \`ghostMode: true\`.
     */
    generateAndWait(payload: ConvertRequest, pollIntervalMs?: number): Promise<JobStatusResponse>;
    /**
     * Start a bulk conversion job for up to 1,000 documents at once.
     */
    generateBulk(payload: BulkConvertRequest): Promise<BulkConvertResponse>;
    /**
     * Retrieve the status of an existing conversion job.
     */
    getJob(jobId: string): Promise<JobStatusResponse>;
}

export { type BulkConvertRequest, BulkConvertRequestSchema, type BulkConvertResponse, type ConvertRequest, ConvertRequestSchema, type ConvertResponse, type JobStatusResponse, PDFBridge, PDFBridgeClient, PDFBridgeError, type PDFBridgeOptions, type PdfOptions, PdfOptionsSchema, PDFBridge as default };
