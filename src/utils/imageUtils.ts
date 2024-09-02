import { createWorker } from 'tesseract.js';

export async function extractIngredientsFromImage(file: File): Promise<string[]> {
  const worker = await createWorker('eng');

  try {
    const { data: { text } } = await worker.recognize(file);
    
    // Split the text into lines and filter out empty lines
    const ingredients = text.split('\n').filter((line: string) => line.trim() !== '');
    
    await worker.terminate();
    return ingredients;
  } catch (error) {
    console.error('Error performing OCR:', error);
    await worker.terminate();
    throw new Error('Failed to extract ingredients from the image');
  }
}