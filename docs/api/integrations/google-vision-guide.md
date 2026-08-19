# Google Vision API Integration Guide

## Overview

STR Platform uses **Google Cloud Vision API** for:
- **Snap-to-Estimate**: Analyzing waste pile photos to identify item types, estimate volume, and generate pricing.
- **SDS Hazard Detection**: Identifying hazardous materials (batteries, chemicals, paint) in waste photos.

## Setup

### 1. Enable the Vision API

In Google Cloud Console, enable the **Cloud Vision API**.

### 2. Environment Variables

```bash
GOOGLE_VISION_API_KEY=AIza...
# Or use Application Default Credentials (recommended for production):
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## Snap-to-Estimate Analysis

```typescript
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

interface WasteItem {
  name: string;
  quantity: number;
  weightClass: "light" | "medium" | "heavy" | "very_heavy";
}

async function analyzeWasteImages(imageUrls: string[]): Promise<WasteItem[]> {
  const requests = imageUrls.map((imageUri) => ({
    image: { source: { imageUri } },
    features: [
      { type: "OBJECT_LOCALIZATION" as const, maxResults: 20 },
      { type: "LABEL_DETECTION" as const, maxResults: 30 },
    ],
  }));

  const [batchResult] = await client.batchAnnotateImages({ requests });
  const items: WasteItem[] = [];

  for (const result of batchResult.responses ?? []) {
    for (const obj of result.localizedObjectAnnotations ?? []) {
      if ((obj.score ?? 0) > 0.6) {
        items.push(mapObjectToWasteItem(obj.name ?? "unknown"));
      }
    }
  }

  return deduplicateAndCount(items);
}

function mapObjectToWasteItem(label: string): WasteItem {
  const heavy = ["sofa", "refrigerator", "mattress", "washing machine", "bed frame"];
  const medium = ["chair", "table", "monitor", "microwave"];
  const name = label.toLowerCase();

  return {
    name: label,
    quantity: 1,
    weightClass: heavy.some((h) => name.includes(h))
      ? "heavy"
      : medium.some((m) => name.includes(m))
      ? "medium"
      : "light",
  };
}
```

## SDS Hazard Detection

```typescript
async function detectHazards(imageUrls: string[]): Promise<string[]> {
  const hazardKeywords = [
    "battery", "paint can", "gasoline", "motor oil", "chemical container",
    "propane tank", "aerosol", "fluorescent lamp", "mercury",
  ];

  const requests = imageUrls.map((imageUri) => ({
    image: { source: { imageUri } },
    features: [
      { type: "LABEL_DETECTION" as const, maxResults: 50 },
      { type: "TEXT_DETECTION" as const },
    ],
  }));

  const [batchResult] = await client.batchAnnotateImages({ requests });
  const detected: string[] = [];

  for (const result of batchResult.responses ?? []) {
    for (const label of result.labelAnnotations ?? []) {
      const name = label.description?.toLowerCase() ?? "";
      if (hazardKeywords.some((kw) => name.includes(kw))) {
        detected.push(label.description ?? name);
      }
    }
  }

  return [...new Set(detected)];
}
```

## Volume Estimation

Volume is estimated from the detected items using a lookup table:

```typescript
const VOLUME_TABLE: Record<string, number> = {
  sofa: 1.2,          // cubic yards
  mattress: 0.8,
  refrigerator: 0.7,
  chair: 0.3,
  bagged_waste: 0.15,
  default: 0.2,
};

function estimateVolume(items: WasteItem[]): number {
  return items.reduce((total, item) => {
    const vol = VOLUME_TABLE[item.name.toLowerCase().replace(/\s/g, "_")]
      ?? VOLUME_TABLE.default;
    return total + vol * item.quantity;
  }, 0);
}
```

## Common Gotchas

| Issue | Solution |
|---|---|
| Low detection accuracy | Request at least 2 photos from different angles |
| `PERMISSION_DENIED` | Verify service account has `Vision API User` role |
| Slow response | Use `batchAnnotateImages` for multiple images in one call |
| False hazard positives | Set a confidence threshold of 0.7 for hazard labels |

## Useful Links

- [Vision API Documentation](https://cloud.google.com/vision/docs)
- [Object Localization](https://cloud.google.com/vision/docs/object-localizer)
- [Node.js Client Library](https://www.npmjs.com/package/@google-cloud/vision)
