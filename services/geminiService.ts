
import { GoogleGenAI, Type } from "@google/genai";
import type { ContentPackage, ContentType } from '../types';

// This function simulates the full backend process for demonstration purposes.
// In a real application, this logic would be on a secure server.
export const generateContentPackage = async (
  topic: string,
  contentType: ContentType
): Promise<ContentPackage> => {
  // IMPORTANT: API key should never be exposed in the frontend.
  // This is a placeholder and assumes the key is available in the environment.
  if (!process.env.API_KEY) {
      // For demonstration, returning mock data if no key is found.
      console.warn("API_KEY environment variable not set. Returning mock data.");
      return getMockData();
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a creative assistant for content creators.
    Based on the following topic and content type, generate a comprehensive content package.

    Topic: "${topic}"
    Content Type: "${contentType}"

    Your response must be a JSON object that strictly follows the provided schema.
    For each script segment, provide detailed talking points.
    For each script segment, also provide 3-5 descriptive keywords for finding relevant royalty-free stock media (images or videos). These keywords should be simple and effective for searching on sites like Pexels or Pixabay.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      titles: {
        type: Type.ARRAY,
        description: "3 catchy and relevant title or hook suggestions.",
        items: { type: Type.STRING },
      },
      script: {
        type: Type.ARRAY,
        description: "An array of script segments, each with a title, talking points, and visual keywords.",
        items: {
          type: Type.OBJECT,
          properties: {
            segmentTitle: {
              type: Type.STRING,
              description: "The title of this script segment (e.g., 'Introduction', 'Main Point 1', 'Conclusion').",
            },
            talkingPoints: {
              type: Type.ARRAY,
              description: "A list of detailed talking points for this segment.",
              items: { type: Type.STRING },
            },
            visualKeywords: {
              type: Type.ARRAY,
              description: "3-5 descriptive keywords for finding stock media for this segment.",
              items: { type: Type.STRING },
            },
          },
          required: ["segmentTitle", "talkingPoints", "visualKeywords"],
        },
      },
    },
    required: ["titles", "script"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    // Post-process the response to create media links
    const processedScript = parsedJson.script.map((segment: any) => {
      const mediaLinks = segment.visualKeywords.map((keyword: string) => ({
        description: `Stock media: ${keyword}`,
        url: `https://www.pexels.com/search/${encodeURIComponent(keyword)}/`,
      }));
      return {
        segmentTitle: segment.segmentTitle,
        talkingPoints: segment.talkingPoints,
        mediaLinks: mediaLinks,
      };
    });

    return {
      titles: parsedJson.titles,
      script: processedScript,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content. The AI model may be overloaded. Please try again later.");
  }
};


const getMockData = (): ContentPackage => {
    return {
        titles: [
            "Mock Title 1: Your Content Journey Begins!",
            "Mock Title 2: The Easiest Content Ever",
            "Mock Title 3: AI-Powered Creativity"
        ],
        script: [
            {
                segmentTitle: "Introduction (Mock Data)",
                talkingPoints: [
                    "This is a mock introduction because the API key is not set.",
                    "It demonstrates the structure of the generated content.",
                    "You can see how talking points and media links are organized."
                ],
                mediaLinks: [
                    { description: "Stock media: welcome sign", url: "https://www.pexels.com/search/welcome%20sign/" },
                    { description: "Stock media: lightbulb idea", url: "https://www.pexels.com/search/lightbulb%20idea/" },
                ]
            },
            {
                segmentTitle: "Conclusion (Mock Data)",
                talkingPoints: [
                    "To see real AI-generated content, please set up your API_KEY.",
                    "This concludes the mock data example."
                ],
                mediaLinks: [
                    { description: "Stock media: thumbs up", url: "https://www.pexels.com/search/thumbs%20up/" }
                ]
            }
        ]
    };
};
