
# Lead Scoring Backend

A Node.js backend service for scoring leads based on product/offer information and prospect data using rule-based logic and AI reasoning.

## Features

- **Offer Input**: POST /offer to submit product/offer details
- **Leads Upload**: POST /leads/upload to upload CSV of leads
- **Scoring Pipeline**: POST /score to run scoring (rules + AI)
- **Results Retrieval**: GET /results to get scored leads as JSON
- **CSV Export**: GET /results/csv to export results as CSV (bonus)

## Scoring Logic

### Rule Layer (max 50 points)
- **Role Relevance**: Decision maker (+20), Influencer (+10), else 0
  - Decision makers: CEO, Head, Director, VP, Founder
  - Influencers: Manager, Lead, Specialist
- **Industry Match**: Exact ICP (+20), Adjacent (+10), else 0
  - Exact: Industry matches any ideal_use_case
  - Adjacent: Related industries (e.g., "Tech" if ideal includes "SaaS")
- **Data Completeness**: All fields present (+10)
  - Required: name, role, company, industry, location, linkedin_bio

### AI Layer (max 50 points)
- Uses OpenAI GPT-3.5-turbo
- **Prompt Used**:
  ```
  Offer: {offer_json}
  Lead: {lead_json}
  Classify intent (High/Medium/Low) and explain in 1-2 sentences.
  ```
- **Mapping**: High=50, Medium=30, Low=10
- **Fallback**: If AI fails (no API key, quota, error), defaults to Low (10 points) with reasoning "Error in AI classification"

**Final Score** = rule_score + ai_points (0-100 total)

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```
4. Run the server: `npm start`

## API Usage

### POST /api/offer
```bash
curl -X POST https://lead-scoring-c05g.onrender.com/api/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Outreach Automation",
    "value_props": ["24/7 outreach", "6x more meetings"],
    "ideal_use_cases": ["B2B SaaS mid-market"]
  }'
```
**Response:**
```json
{
  "message": "Offer saved successfully"
}
```

### POST /api/leads/upload
```bash
curl -X POST https://lead-scoring-c05g.onrender.com/api/leads/upload \
  -F "file=@leads.csv"
```
CSV format: name,role,company,industry,location,linkedin_bio

**Response:**
```json
{
  "message": "Uploaded 3 leads"
}
```

### POST /api/score
```bash
curl -X POST https://lead-scoring-c05g.onrender.com/api/score
```
**Response:**
```json
{
  "message": "Scoring completed",
  "count": 3
}
```

### GET /api/results
```bash
curl https://lead-scoring-c05g.onrender.com/api/results
```
**Response:**
```json
[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 85,
    "reasoning": "Fits ICP SaaS mid-market and role is decision maker."
  },
  {
    "name": "John Doe",
    "role": "Marketing Manager",
    "company": "TechCorp",
    "intent": "Medium",
    "score": 45,
    "reasoning": "Adjacent industry match and influencer role."
  }
]
```

### GET /api/results/csv
```bash
curl -o results.csv https://lead-scoring-c05g.onrender.com/api/results/csv
```
**Response:** Downloads a CSV file with headers: name,role,company,intent,score,reasoning

## Deployment

Deployed on [Render](https://render.com) at: [https://lead-scoring-c05g.onrender.com/](https://lead-scoring-c05g.onrender.com/)

## Tech Stack

- Node.js
- Express.js
- OpenAI API
- Multer for file uploads
- csv-parser for CSV handling

# lead-scoring-backend

