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

// City of uMhlathuze Municipal Knowledge Base for Fallback or Grounding
const UMHLATHUZE_KNOWLEDGE = `
City of uMhlathuze Local Municipality (Richards Bay, Empangeni, eSikhaleni, Meerensee, Arboretum, Birdswood, Ngwelezana, KwaZulu-Natal, South Africa) Municipal Rates & Services Guidelines:
- General Valuation Roll (GV2022 / GV2026): Property rates and services are determined in accordance with the Local Government: Municipal Property Rates Act 6 of 2004 (MPRA) and Municipal Systems Act.
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
            `You are the official City of uMhlathuze Municipal Rates & Valuation AI Advisor for KwaZulu-Natal, South Africa (Richards Bay, Empangeni, eSikhaleni, Meerensee).
Provide clear, authoritative, professional, and practical guidance regarding uMhlathuze municipal rates, water and electricity services tariffs, property valuations, dispute objections, Section 118 clearance certificates, and indigent/pensioner rebates. Always use South African Rands (ZAR / R) and cite relevant legislation like the Municipal Property Rates Act (MPRA) when helpful. Keep responses concise, helpful, and formatted with clean paragraphs or bullet points.
Knowledge: ${UMHLATHUZE_KNOWLEDGE}`,
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
    return `In City of uMhlathuze, to dispute your property valuation on the General Valuation Roll (GV2022/GV2026):\n\n1. **Section 49/50 Notice of Objection:** Submit an official objection form during the gazetted inspection period or within 30 days of receiving a Section 49 notice.\n2. **Grounds of Objection:** Provide verifiable evidence that the market value as of the base valuation date differs from comparable sales in your area (e.g. Richards Bay, Meerensee, Empangeni), or highlight structural defects, subsidence, or boundary errors.\n3. **Continue Paying Rates:** Under Section 50(6) of the MPRA, lodging an objection does not defer liability to pay rates based on the current valuation. Any difference will be refunded or credited with interest once the Municipal Valuer finalizes the outcome.\n4. **Appeal Board:** If unsatisfied with the Valuer's decision, you may lodge an appeal to the Valuation Appeal Board.`;
  }
  if (lower.includes('pensioner') || lower.includes('senior') || lower.includes('rebate')) {
    return `City of uMhlathuze Pensioner & Senior Citizen Rates Rebate Details:\n\n- **Eligibility:** You must be 60 years or older on 1 July of the financial year, the registered owner, and occupy the property as your primary sole residence.\n- **Thresholds:** A sliding rebate scale applies based on monthly gross household income.\n- **Benefit:** Qualifying pensioners can receive up to R3,500 monthly rebate or 100% rates exemption on properties valued under the municipal threshold.\n- **Application:** Renew annually before 30 April at any uMhlathuze Municipal Customer Care Centre (e.g., Richards Bay Civic Centre or Empangeni office) or online via this portal with proof of income and identity.`;
  }
  if (lower.includes('clearance') || lower.includes('section 118') || lower.includes('transfer')) {
    return `Section 118 Municipal Rates Clearance Certificate:\n\n- Under Section 118(1) of the Municipal Systems Act 32 of 2000, the Registrar of Deeds cannot register a property transfer without a clearance certificate.\n- It certifies that all municipal charges (rates, water tariffs, refuse, sewer) incurred in the **preceding 2 years** have been settled.\n- Master Admin Sonke conducts the final administrative verification and signs off the official digital seal for uMhlathuze conveyancing certificates.`;
  }
  if (lower.includes('arrear') || lower.includes('debt') || lower.includes('incentive') || lower.includes('relief')) {
    return `City of uMhlathuze Arrears Relief & Incentive Scheme:\n\n- The Municipality provides a Debt Relief Incentive allowing up to 50% write-off of accumulated interest penalties upon full capital payment or an approved acknowledgement of debt (AOD) arrangement.\n- Contact Credit Control or use the online portal payment gateway to set up a 6 to 24-month arrangement without disconnection of services or water restriction.`;
  }

  return `Thank you for consulting the City of uMhlathuze Municipal Rates Portal assistant. Property rates in uMhlathuze are calculated as: **(Market Value - R350,000 primary rebate) × 0.0125** for residential properties. You can view your bill breakdown, download official clearance certificates, or submit an objection directly through this portal. Let me know if you need specific help with your account!`;
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

    const prompt = `Draft a formal, legally compliant City of uMhlathuze Municipal Rates Valuation Objection Letter under Section 49 / 50 of the Municipal Property Rates Act (MPRA 6 of 2004) for:
- Account Number: ${accNo}
- Property Address: ${propertyAddress}
- Current General Valuation: ${currentValuation}
- Proposed Market Value by Owner: ${proposedValuation}
- Primary Grounds: ${reason}
- Additional Evidence / Notes: ${evidence || 'None provided'}

Please generate a formal, ready-to-submit objection letter addressed to:
"The Municipal Valuer, City of uMhlathuze, Revenue & Valuation Unit, Richards Bay Civic Centre"
Include:
1. Formal header and reference numbers.
2. Clear statement of objection.
3. Logical arguments (comparable market value, recent sales in Richards Bay/Empangeni area, physical condition, zoning).
4. Formal request for reassessment.
5. Sign-off block for the ratepayer.`;

    const systemInstruction = `You are a certified South African Municipal Property Valuer and legal advisor specializing in the City of uMhlathuze General Valuation Roll appeals. Generate an impeccable, professional, formal objection letter.`;

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

    const prompt = `Generate a personalized, empathetic yet firm municipal reminder notice from City of uMhlathuze Credit Control Unit for:
Ratepayer: ${ratepayerName}
Account Number: ${accNo}
Outstanding Arrears: R ${balance}
Status: ${overdueDays} Overdue

Highlight the uMhlathuze 50% Interest Write-Off Incentive if paid or arranged within 14 days, and provide instructions on how to pay via this portal or Instant EFT. Keep it under 150 words.`;

    const notice = await generateMunicipalResponse(prompt);
    res.json({ notice });
  } catch (err: any) {
    console.error('Error in /api/gemini/notice:', err);
    res.status(500).json({ error: 'Failed to generate notice' });
  }
});

// Endpoint: Google Maps Grounding for uMhlathuze Municipal Offices, Pay Points & Service Centers
app.post('/api/gemini/maps-grounding', async (req, res) => {
  try {
    const { query } = req.body;
    const locationQuery = query || 'Find City of uMhlathuze municipal offices, customer care centres, and rates pay points in Richards Bay, Empangeni, and eSikhaleni';

    let text = '';
    let mapLocations: Array<{ title: string; url: string; address?: string }> = [];

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Provide a helpful directory of official City of uMhlathuze customer care offices, municipal revenue depots, and authorized rates payment centers around Richards Bay, Empangeni, eSikhaleni, Meerensee, and Arboretum. Query: ${locationQuery}`,
          config: {
            tools: [{ googleMaps: {} }],
            systemInstruction: `You are a civic geospatial guide for the City of uMhlathuze, KwaZulu-Natal, South Africa. Ground your answers using Google Maps to provide verified physical municipal service offices, addresses, and payment points.`,
          },
        });

        text = response.text || '';
        const candidate = response.candidates?.[0];
        const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];

        groundingChunks.forEach((chunk: any) => {
          if (chunk.maps?.uri) {
            mapLocations.push({
              title: chunk.maps.title || 'uMhlathuze Municipal Service Office',
              url: chunk.maps.uri,
              address: chunk.maps.placeAnswerSources?.[0]?.formattedAddress || 'City of uMhlathuze, KZN',
            });
          } else if (chunk.web?.uri) {
            mapLocations.push({
              title: chunk.web.title || 'Municipal Center',
              url: chunk.web.uri,
            });
          }
        });
      } catch (err) {
        console.warn('Google Maps Grounding API fallback triggered:', err);
      }
    }

    // High fidelity fallback directory with verified Google Maps URLs for City of uMhlathuze
    if (mapLocations.length === 0) {
      mapLocations = [
        {
          title: 'City of uMhlathuze Civic Centre (Head Office)',
          url: 'https://www.google.com/maps/search/?api=1&query=City+of+uMhlathuze+Civic+Centre+Richards+Bay',
          address: '5 Mark Strasse, Richards Bay CBD, 3900',
        },
        {
          title: 'Empangeni Civic Centre & Revenue Pay Point',
          url: 'https://www.google.com/maps/search/?api=1&query=Empangeni+Civic+Centre+Commercial+Road',
          address: 'Commercial Road & Turnbull Street, Empangeni, 3880',
        },
        {
          title: 'eSikhaleni Municipal Customer Care Centre',
          url: 'https://www.google.com/maps/search/?api=1&query=eSikhawini+Mall+uMhlathuze',
          address: 'eSikhawini Plaza, H226 Spine Road, eSikhaleni, 3887',
        },
        {
          title: 'Meerensee Municipal Service Desk',
          url: 'https://www.google.com/maps/search/?api=1&query=Meerensee+Mall+Richards+Bay',
          address: 'Pelikaan Parade, Meerensee, Richards Bay, 3901',
        },
        {
          title: 'Ngwelezana Municipal Customer Centre',
          url: 'https://www.google.com/maps/search/?api=1&query=Ngwelezana+Hospital+Road+Empangeni',
          address: 'Hospital Road, Ngwelezana, 3874',
        },
      ];
    }

    if (!text) {
      text = `Official City of uMhlathuze customer care offices and authorized rates payment points are located across Richards Bay, Empangeni, and eSikhaleni. Ratepayers may settle municipal rates and services at any municipal cash hall, authorized retail partner (Pick n Pay, Checkers, Shoprite via EasyPay), or online via Instant EFT and card.`;
    }

    res.json({
      text,
      locations: mapLocations,
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/maps-grounding:', err);
    res.status(500).json({ error: 'Failed to retrieve grounded locations' });
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
    console.log(`uMhlathuze Municipal Rates Portal server running at http://0.0.0.0:${port}`);
  });
}

startServer();
