import vision from '@google-cloud/vision';
import { config } from './config';

let visionClient: vision.ImageAnnotatorClient | null = null;

export function getVisionClient(): vision.ImageAnnotatorClient {
  if (!visionClient) {
    visionClient = new vision.ImageAnnotatorClient({
      apiKey: config.google.visionApiKey,
    });
  }
  return visionClient;
}

export interface VisionObjectResult {
  name: string;
  score: number;
  boundingPoly?: object;
}

export async function detectObjects(imageBase64: string): Promise<VisionObjectResult[]> {
  const client = getVisionClient();
  const [result] = await client.objectLocalization({
    image: { content: imageBase64 },
  });
  const objects = result.localizedObjectAnnotations || [];
  return objects.map((obj) => ({
    name: obj.name || 'Unknown',
    score: obj.score || 0,
    boundingPoly: obj.boundingPoly || undefined,
  }));
}

export async function detectLabels(imageBase64: string): Promise<{ description: string; score: number }[]> {
  const client = getVisionClient();
  const [result] = await client.labelDetection({
    image: { content: imageBase64 },
  });
  const labels = result.labelAnnotations || [];
  return labels.map((label) => ({
    description: label.description || 'Unknown',
    score: label.score || 0,
  }));
}
