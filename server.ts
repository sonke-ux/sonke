import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Ugu District Municipal Knowledge Base for Fallback or Grounding
const UGU_KNOWLEDGE = `
Ugu District Municipality (South Coast, KwaZulu-Natal, South Africa - Port Shepstone, Margate, Shelly Beach, Scottburgh, Hibberdene, Harding) Municipal Rates & Water Guidelines:
- General Valuation Roll (GV2022 / GV2026): Property rates and water services are determined in accordance with the Local Government: Municipal Property Rates Act 6 of 2004 (MPRA) and Municipal Systems Act.
- Residential Rates Tariff: 0.0125 (1.25 cents in the Rand).
- Primary Residential Rebate: The first R350,000 of market value for residential primary residence is exempt from rates (R15,000 statutory + R335,000 municipal deduction).
- Pensioner Rebate: Property owners aged 60+ with household income below municipal threshold receive up to R3,500/month or full rates exemption depending on property value.
- Section 118 Clearance Certificates: Required for property transfers under the Municipal Systems Act 32 of 2000. Certifies all amounts due during the preceding 2 years are paid.
- Arrears Relief Incentive: Special municipal scheme granting up to 50% write-off on accumulated penalty interest when long-standing capital rates are settled or entered into an approved debit order payment agreement.
- Dispute / Valuation Objections: Lodged under Section 49 / 50 of the MPRA within the official public inspection window (typically 60-90 days from roll publication).
`;

// Helper: safe AI generation with fallback
async function generateMunicipalResponse(prompt: string, systemInstruction?: string): Promise<string> {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ||
            `You are the official Ugu District Municipality Rates & Valuation AI Advisor for the KwaZulu-Natal South Coast, South Africa (Port Shepstone, Margate, Shelly Beach, Scottburgh, Harding).
Provide clear, authoritative, professional, and practical guidance regarding Ugu municipal rates, water services tariffs, property valuations, dispute objections, Section 118 clearance certificates, and indigent/pensioner rebates. Always use South African Rands (ZAR / R) and cite relevant legislation like the Municipal Property Rates Act (MPRA) when helpful. Keep responses concise, helpful, and formatted with clean paragraphs or bullet points.
Knowledge: ${UGU_KNOWLEDGE}`,
        },
      });
      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.error('Gemini API call failed, using municipal intelligence fallback:', err);
    }
  }

  // Graceful rule-based municipal advisor fallback
  const lower = prompt.toLowerCase();
  if (lower.includes('dispute') || lower.includes('objection') || lower.includes('valuation')) {
    return `In Ugu District Municipality, to dispute your property valuation on the General Valuation Roll (GV2022/GV2026):\n\n1. **Section 49/50 Notice of Objection:** Submit an official objection form during the gazetted inspection period or within 30 days of receiving a Section 49 notice.\n2. **Grounds of Objection:** Provide verifiable evidence that the market value as of the base valuation date differs from comparable sales in your area (e.g. Port Shepstone, Margate, Shelly Beach), or highlight structural defects, coastal erosion issues, or boundary errors.\n3. **Continue Paying Rates:** Under Section 50(6) of the MPRA, lodging an objection does not defer liability to pay rates based on the current valuation. Any difference will be refunded or credited with interest once the Municipal Valuer finalizes the outcome.\n4. **Appeal Board:** If unsatisfied with the Valuer's decision, you may lodge an appeal to the Valuation Appeal Board.`;
  }
  if (lower.includes('pensioner') || lower.includes('senior') || lower.includes('rebate')) {
    return `Ugu District Pensioner & Senior Citizen Rates Rebate Details:\n\n- **Eligibility:** You must be 60 years or older on 1 July of the financial year, the registered owner, and occupy the property as your primary sole residence.\n- **Thresholds:** A sliding rebate scale applies based on monthly gross household income.\n- **Benefit:** Qualifying pensioners can receive up to R3,500 monthly rebate or 100% rates exemption on properties valued under the municipal threshold.\n- **Application:** Renew annually before 30 April at any Ugu Municipal Customer Care Centre (e.g., Port Shepstone main office) or online via this portal with proof of income and identity.`;
  }
  if (lower.includes('clearance') || lower.includes('section 118') || lower.includes('transfer')) {
    return `Section 118 Municipal Rates Clearance Certificate:\n\n- Under Section 118(1) of the Municipal Systems Act 32 of 2000, the Registrar of Deeds cannot register a property transfer without a clearance certificate.\n- It certifies that all municipal charges (rates, water tariffs, refuse, sewer) incurred in the **preceding 2 years** have been settled.\n- Master Admin Sonke conducts the final administrative verification and signs off the official digital seal for Ugu conveyancing certificates.`;
  }
  if (lower.includes('arrear') || lower.includes('debt') || lower.includes('incentive') || lower.includes('relief')) {
    return `Ugu District Arrears Relief & Incentive Scheme:\n\n- The Municipality provides a Debt Relief Incentive allowing up to 50% write-off of accumulated interest penalties upon full capital payment or an approved acknowledgement of debt (AOD) arrangement.\n- Contact Credit Control or use the online portal payment gateway to set up a 6 to 24-month arrangement without disconnection of services or water restriction.`;
  }

  return `Thank you for consulting the Ugu District Municipal Rates Portal assistant. Property rates in Ugu are calculated as: **(Market Value - R350,000 primary rebate) × 0.0125** for residential properties. You can view your bill breakdown, download official clearance certificates, or submit an objection directly through this portal. Let me know if you need specific help with your account!`;
}

// Endpoint: AI Chat Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let contextualPrompt = message;
    if (context) {
      contextualPrompt = `User Context: Ratepayer Name: ${context.name || 'Resident'}, Account Number: ${context.accNo || 'N/A'}, Address: ${context.address || 'N/A'}, Current Balance: R ${context.balance || '0.00'}, Valuation: ${context.valuation || 'N/A'}.\n\nUser Question: ${message}`;
    }

    const reply = await generateMunicipalResponse(contextualPrompt);
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/gemini/chat:', err);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
});

// Endpoint: AI Valuation Dispute Advisor & Letter Drafter
app.post('/api/gemini/dispute', async (req, res) => {
  try {
    const { accNo, propertyAddress, currentValuation, proposedValuation, reason, evidence } = req.body;

    const prompt = `Draft a formal, legally compliant Ugu District Municipality Rates Valuation Objection Letter under Section 49 / 50 of the Municipal Property Rates Act (MPRA 6 of 2004) for:
- Account Number: ${accNo}
- Property Address: ${propertyAddress}
- Current General Valuation: ${currentValuation}
- Proposed Market Value by Owner: ${proposedValuation}
- Primary Grounds: ${reason}
- Additional Evidence / Notes: ${evidence || 'None provided'}

Please generate a formal, ready-to-submit objection letter addressed to:
"The Municipal Valuer, Ugu District Municipality, Revenue & Valuation Unit, Port Shepstone"
Include:
1. Formal header and reference numbers.
2. Clear statement of objection.
3. Logical arguments (comparable market value, recent sales in South Coast area, physical condition, zoning).
4. Formal request for reassessment.
5. Sign-off block for the ratepayer.`;

    const systemInstruction = `You are a certified South African Municipal Property Valuer and legal advisor specializing in the Ugu District Municipality General Valuation Roll appeals. Generate an impeccable, professional, formal objection letter.`;

    const letter = await generateMunicipalResponse(prompt, systemInstruction);
    res.json({ letter });
  } catch (err: any) {
    console.error('Error in /api/gemini/dispute:', err);
    res.status(500).json({ error: 'Failed to generate dispute letter' });
  }
});

// Endpoint: AI Arrears Notice Dispatcher
app.post('/api/gemini/notice', async (req, res) => {
  try {
    const { ratepayerName, accNo, balance, overdueDays } = req.body;

    const prompt = `Generate a personalized, empathetic yet firm municipal reminder notice from Ugu District Municipality Credit Control Unit for:
Ratepayer: ${ratepayerName}
Account Number: ${accNo}
Outstanding Arrears: R ${balance}
Status: ${overdueDays} Overdue

Highlight the Ugu 50% Interest Write-Off Incentive if paid or arranged within 14 days, and provide instructions on how to pay via this portal or Instant EFT. Keep it under 150 words.`;

    const notice = await generateMunicipalResponse(prompt);
    res.json({ notice });
  } catch (err: any) {
    console.error('Error in /api/gemini/notice:', err);
    res.status(500).json({ error: 'Failed to generate notice' });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Ugu District Municipal Rates Portal server running at http://0.0.0.0:${port}`);
  });
}

startServer();
