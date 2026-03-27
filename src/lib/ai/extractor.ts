import { prisma } from "@/lib/prisma"

/**
 * AI Lead Extractor
 * 
 * This service extracts structured data (Budget, Location, Property Type) 
 * from raw WhatsApp messages using a hybrid approach of Smart Regex 
 * and optional LLM integration.
 */
export async function extractLeadData(text: string) {
  // 1. Smart Regex Extraction (Legacy + Enhanced)
  const budgetMatch = text.match(/(budget|budget of|under|around|upto|within)\s*(Rs\.?|INR|₹)?\s*(\d+(\.\d+)?[Lk|Cr|k]?)/i)
  const locationMatch = text.match(/(in|at|near|location|area)\s*([A-Z][a-z]+(\s+[A-Z][a-z]+)*)/i)
  const typeMatch = text.match(/(3BHK|2BHK|1BHK|Villa|Plot|Commercial|Shop|Apartment|Flat|Penthouse|Office)/i)
  const nameMatch = text.match(/(my name is|i am|this is)\s*([A-Z][a-z]+(\s+[A-Z][a-z]+)?)/i)

  const extracted = {
    budget: budgetMatch ? budgetMatch[0] : null,
    location: locationMatch ? locationMatch[2] : null,
    propertyType: typeMatch ? typeMatch[0] : null,
    name: nameMatch ? nameMatch[2] : null
  }

  // 2. Future LLM Integration Slot
  // If (process.env.OPENAI_API_KEY) { 
  //   const aiData = await callOpenAI(text);
  //   Object.assign(extracted, aiData);
  // }

  return extracted
}

/**
 * Process an incoming WhatsApp message for lead lifecycle
 */
export async function processWhatsAppLead(leadId: string, message: string) {
  const data = await extractLeadData(message)
  
  // Update Lead with extracted data
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      budget: data.budget || undefined,
      location: data.location || undefined,
      propertyType: data.propertyType || undefined,
      name: data.name || undefined,
      updatedAt: new Date()
    }
  })

  return { lead: updatedLead, extracted: data }
}
