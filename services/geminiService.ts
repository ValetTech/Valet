
import { GoogleGenAI } from "@google/genai";
import { Location } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const findNearbyParking = async (location: Location, query: string) => {
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find available parking spots based on this user query: "${query}"`,
            config: {
                tools: [{googleMaps: {}}],
            },
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }
                }
            }
        });

        const text = result.text;
        const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        // In a real application, you would process these chunks to find actual listings.
        // For this MVP, we'll return the generated text and the grounding data for display.
        return {
            summary: text,
            locations: groundingChunks.map((chunk: any) => ({
                title: chunk.maps?.title || 'Unknown Location',
                uri: chunk.maps?.uri || '#',
            })),
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to find parking spots. Please try again.");
    }
};
