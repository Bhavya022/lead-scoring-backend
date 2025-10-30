<<<<<<< HEAD
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
- **Industry Match**: Exact ICP (+20), Adjacent (+10), else 0
- **Data Completeness**: All fields present (+10)

### AI Layer (max 50 points)
- Uses OpenAI GPT-3.5-turbo
- Prompt: Classify intent (High/Medium/Low) and explain in 1-2 sentences
- Mapping: High=50, Medium=30, Low=10

**Final Score** = rule_score + ai_points

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

### POST /offer
```bash
curl -X POST http://localhost:3000/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Outreach Automation",
    "value_props": ["24/7 outreach", "6x more meetings"],
    "ideal_use_cases": ["B2B SaaS mid-market"]
  }'
```

### POST /leads/upload
```bash
curl -X POST http://localhost:3000/leads/upload \
  -F "file=@leads.csv"
```
CSV format: name,role,company,industry,location,linkedin_bio

### POST /score
```bash
curl -X POST http://localhost:3000/score
```

### GET /results
```bash
curl http://localhost:3000/results
```

### GET /results/csv
```bash
curl -o results.csv http://localhost:3000/results/csv
```

## Deployment

Deployed on [Render](https://render.com) at: [https://your-render-url.com](https://your-render-url.com)

## Tech Stack

- Node.js
- Express.js
- OpenAI API
- Multer for file uploads
- csv-parser for CSV handling
=======
# lead-scoring-backend
>>>>>>> a4b1cdbb0191119b3571c4832ae6f84695b5c5a1
