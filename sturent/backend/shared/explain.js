import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { buildDeterministicExplanation } from "./matching.js";

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

export async function explainMatch({ property, preferences, matchBreakdown }) {
  const fallback = buildDeterministicExplanation(property, preferences, matchBreakdown);

  try {
    const client = new BedrockRuntimeClient({});
    const prompt = [
      "You write short, honest housing match explanations for students in India.",
      "Use ONLY the supplied property and matching information. Never invent amenities, prices, distances, verification status or policies.",
      "Do not change numerical values. Do not claim a home is safe or unsafe unless the data says so.",
      "Mention trade-offs. Keep the explanation under 100 words.",
      "Never say this is the best property. The student decides.",
      "",
      `Preferences: ${JSON.stringify(preferences)}`,
      `Property: ${JSON.stringify({
        name: property.name,
        area: property.area,
        rent: property.rent,
        deposit: property.deposit,
        distance: property.distance,
        roomType: property.roomType,
        amenities: property.amenities,
        lockIn: property.lockIn,
        noticePeriod: property.noticePeriod,
        verified: property.verified,
        ownerProvided: property.ownerProvided,
        estimated: property.estimated
      })}`,
      `Match breakdown: ${JSON.stringify({
        matchScore: matchBreakdown.matchScore,
        budgetScore: matchBreakdown.budgetScore,
        distanceScore: matchBreakdown.distanceScore,
        roomScore: matchBreakdown.roomScore,
        amenityScore: matchBreakdown.amenityScore,
        foodScore: matchBreakdown.foodScore,
        lifestyleScore: matchBreakdown.lifestyleScore,
        cost: matchBreakdown.cost
      })}`,
      `Deal-breakers: ${JSON.stringify(matchBreakdown.dealBreakers || [])}`
    ].join("\n");

    const res = await client.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 220, temperature: 0.2 }
      })
    );

    const text = res.output?.message?.content?.map((c) => c.text).join(" ").trim();
    if (text) return { explanation: text, source: "bedrock" };
  } catch (err) {
    console.error("Bedrock unavailable, using deterministic explanation", err.message);
  }

  return { explanation: fallback, source: "deterministic" };
}
