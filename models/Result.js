class Result {
  constructor(lead, intent, score, reasoning) {
    this.name = lead.name;
    this.role = lead.role;
    this.company = lead.company;
    this.intent = intent;
    this.score = score;
    this.reasoning = reasoning;
  }
}

module.exports = Result;
