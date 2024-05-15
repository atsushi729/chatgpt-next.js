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

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a motivational assistant." },
          {
            role: "user",
            content: `Create a motivational message for the following prompt: ${prompt}`,
          },
        ],
        max_tokens: 500,
      });

      console.log("OpenAI API response:", JSON.stringify(completion, null, 2));

      if (
        !completion.choices ||
        !completion.choices[0] ||
        !completion.choices[0].message ||
        !completion.choices[0].message.content
      ) {
        throw new Error("Invalid response from OpenAI");
      }

      const quote = completion.choices[0].message.content.trim();
      return new NextResponse(JSON.stringify({ quote }), { status: 200 });
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 429 &&
        attempt < maxRetries
      ) {
        // Log the retry attempt
        console.warn(
          `Rate limit exceeded, retrying attempt ${attempt} after ${retryDelay}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      console.error("Error fetching quote from OpenAI:", error);
      if (error.response) {
        const errorDetails = await error.response.json();
        console.error("OpenAI API error response:", errorDetails);
        return new NextResponse(
          JSON.stringify({
            error: "Failed to fetch quote from OpenAI",
            details: errorDetails,
          }),
          { status: 500 }
        );
      } else {
        return new NextResponse(
          JSON.stringify({
            error: "Failed to fetch quote from OpenAI",
            details: error.message,
          }),
          { status: 500 }
        );
      }
    }
  }

  // Fallback return statement in case of unexpected flow
  return new NextResponse(
    JSON.stringify({ error: "Unexpected error occurred" }),
    { status: 500 }
  );
}
