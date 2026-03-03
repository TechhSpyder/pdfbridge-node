# @techhspyder/pdfbridge-node

The official Node.js SDK for [PDFBridge](https://pdfbridge.xyz) - Generate pixel-perfect PDFs from HTML/URLs with advanced AI and security features.

## Installation

```bash
npm install @techhspyder/pdfbridge-node
# or
yarn add @techhspyder/pdfbridge-node
# or
pnpm add @techhspyder/pdfbridge-node
```

## Setup

Initialize the client with your API key from the dashboard:

```typescript
import { PDFBridge } from "@techhspyder/pdfbridge-node";

const pdf = new PDFBridge({
  apiKey: process.env.PDFBRIDGE_API_KEY, // Starts with pk_live_ or pk_test_
});
```

## Quick Start

### 1. Simple URL to PDF

Generate a PDF asynchronously. You will receive a \`jobId\` representing the background queued task.

```typescript
const response = await pdf.generate({
  url: "https://example.com/invoice/123",
});
console.log(response.jobId);
```

### 2. Ghost Mode Rendering (Enterprise)

Bypass S3 bucket storage entirely. The rendered PDF is piped directly back to you as an \`ArrayBuffer\`.

```typescript
const buffer = await pdf.generate({
  html: "<h1>Super Secret Financial Report</h1>",
  ghostMode: true, // Requires Enterprise/Pro plan
});

// Optionally write the buffer to your own storage
import fs from "fs/promises";
await fs.writeFile("report.pdf", Buffer.from(buffer as ArrayBuffer));
```

### 3. Smart Templates & Tailwind

Inject arbitrary variables into saved templates and compile Tailwind classes on the fly.

```typescript
const response = await pdf.generate({
  templateId: "tmpl_9u2j34...",
  tailwind: true,
  variables: {
    customer_name: "Acme Corp",
    total_due: "$5,000.00",
  },
});
```

### 4. Bulk Generation & AI Parsing

Convert up to 1,000 documents simultaneously, and optionally let our internal LLM extract structured JSON from the visual output.

```typescript
const response = await pdf.generateBulk({
  extractMetadata: true, // Get AI-extracted JSON sent to your webhook
  webhookUrl: "https://your-api.com/pdf-webhook",
  jobs: [
    { url: "https://...", filename: "doc1.pdf" },
    { url: "https://...", filename: "doc2.pdf" },
  ],
});
```
