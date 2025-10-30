class Lead {
  constructor(data) {
    this.name = data.name;
    this.role = data.role;
    this.company = data.company;
    this.industry = data.industry;
    this.location = data.location;
    this.linkedin_bio = data.linkedin_bio;
  }

  isComplete() {
    return this.name && this.role && this.company && this.industry && this.location && this.linkedin_bio;
  }
}

module.exports = Lead;
