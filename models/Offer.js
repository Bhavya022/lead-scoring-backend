class Offer {
  constructor(data) {
    this.name = data.name;
    this.value_props = data.value_props;
    this.ideal_use_cases = data.ideal_use_cases;
  }

  isValid() {
    return this.name && this.value_props && this.ideal_use_cases;
  }
}

module.exports = Offer;
