const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// In-memory storage
let offer = null;
let leads = [];
let results = [];

// POST /offer
app.post('/offer', (req, res) => {
  const { name, value_props, ideal_use_cases } = req.body;
  if (!name || !value_props || !ideal_use_cases) {
    return res.status(400).json({ error: 'Missing required fields: name, value_props, ideal_use_cases' });
  }
  offer = req.body;
  res.json({ message: 'Offer saved successfully' });
});

// POST /leads/upload
app.post('/leads/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  leads = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => leads.push(data))
    .on('end', () => {
      fs.unlinkSync(filePath); // Remove temp file
      res.json({ message: `Uploaded ${leads.length} leads` });
    })
    .on('error', (err) => res.status(500).json({ error: 'Error parsing CSV' }));
});

// Scoring functions
function calculateRuleScore(lead) {
  let score = 0;
  // Role relevance
  const role = lead.role.toLowerCase();
  if (role.includes('head') || role.includes('ceo') || role.includes('director') || role.includes('vp')) {
    score += 20; // decision maker
  } else if (role.includes('manager') || role.includes('lead')) {
    score += 10; // influencer
  }
  // Industry match (assuming offer.ideal_use_cases includes industry)
  const industry = lead.industry.toLowerCase();
  const ideal = offer.ideal_use_cases.join(' ').toLowerCase();
  if (ideal.includes(industry)) {
    score += 20; // exact ICP
  } else if (ideal.includes('b2b') && industry.includes('tech')) { // adjacent example
    score += 10;
  }
  // Data completeness
  if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) {
    score += 10;
  }
  return score;
}

async function calculateAIScore(lead) {
  const prompt = `Offer: ${JSON.stringify(offer)}\nLead: ${JSON.stringify(lead)}\nClassify intent (High/Medium/Low) and explain in 1-2 sentences.`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });
    const text = response.choices[0].message.content.trim();
    const intent = text.toLowerCase().includes('high') ? 'High' : text.toLowerCase().includes('medium') ? 'Medium' : 'Low';
    const points = intent === 'High' ? 50 : intent === 'Medium' ? 30 : 10;
    return { intent, points, reasoning: text };
  } catch (error) {
    console.error('AI error:', error);
    return { intent: 'Low', points: 10, reasoning: 'Error in AI classification' };
  }
}

// POST /score
app.post('/score', async (req, res) => {
  if (!offer || leads.length === 0) {
    return res.status(400).json({ error: 'Offer and leads must be uploaded first' });
  }
  results = [];
  for (const lead of leads) {
    const ruleScore = calculateRuleScore(lead);
    const aiResult = await calculateAIScore(lead);
    const totalScore = ruleScore + aiResult.points;
    results.push({
      name: lead.name,
      role: lead.role,
      company: lead.company,
      intent: aiResult.intent,
      score: totalScore,
      reasoning: aiResult.reasoning,
    });
  }
  res.json({ message: 'Scoring completed', count: results.length });
});

// GET /results
app.get('/results', (req, res) => {
  res.json(results);
});

// Optional: GET /results/csv
app.get('/results/csv', (req, res) => {
  if (results.length === 0) {
    return res.status(400).json({ error: 'No results to export' });
  }
  const csvData = results.map(r => `${r.name},${r.role},${r.company},${r.intent},${r.score},"${r.reasoning}"`).join('\n');
  const header = 'name,role,company,intent,score,reasoning\n';
  res.header('Content-Type', 'text/csv');
  res.attachment('results.csv');
  res.send(header + csvData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
