import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

//---------------------------------------------------------------------
//                            Configuration
//---------------------------------------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(openai);

//---------------------------------------------------------------------
//                             API request
//---------------------------------------------------------------------
export function GET(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  return new NextResponse("GET request processed");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new NextResponse(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    if (prompt.length > 100) {
      return new NextResponse(JSON.stringify({ error: "Prompt is too long" }), {
        status: 400,
      });
    }

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: `Create a motivational message for the following prompt: ${prompt}`,
      max_tokens: 500,
    });

    const quote = completion.choices[0].text;
    return new NextResponse(JSON.stringify({ quote }), { status: 200 });
  } catch (error) {
    console.error("Error fetching quote from OpenAI:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch quote from OpenAI" }),
      { status: 500 }
    );
  }
}
