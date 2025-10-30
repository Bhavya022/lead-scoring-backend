const { calculateRuleScore } = require('../index');

describe('Rule-based Scoring', () => {
  test('Decision maker role gets 20 points', () => {
    const lead = {
      role: 'Head of Growth',
      industry: 'SaaS',
      name: 'Test',
      company: 'Test',
      location: 'Test',
      linkedin_bio: 'Test'
    };
    const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
    expect(calculateRuleScore(lead, offer)).toBe(30); // 20 role + 10 completeness
  });

  test('Influencer role gets 10 points', () => {
    const lead = {
      role: 'Marketing Manager',
      industry: 'Tech',
      name: 'Test',
      company: 'Test',
      location: 'Test',
      linkedin_bio: 'Test'
    };
    const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
    expect(calculateRuleScore(lead, offer)).toBe(20); // 10 role + 10 completeness
  });

  test('Exact industry match gets 20 points', () => {
    const lead = {
      role: 'Manager',
      industry: 'SaaS',
      name: 'Test',
      company: 'Test',
      location: 'Test',
      linkedin_bio: 'Test'
    };
    const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
    expect(calculateRuleScore(lead, offer)).toBe(30); // 20 industry + 10 completeness
  });

  test('Adjacent industry gets 10 points', () => {
    const lead = {
      role: 'Manager',
      industry: 'Tech',
      name: 'Test',
      company: 'Test',
      location: 'Test',
      linkedin_bio: 'Test'
    };
    const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
    expect(calculateRuleScore(lead, offer)).toBe(20); // 10 industry + 10 completeness
  });

  test('Incomplete data gets 0 completeness points', () => {
    const lead = {
      role: 'Manager',
      industry: 'Tech',
      name: 'Test',
      company: 'Test'
      // missing location and linkedin_bio
    };
    const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
    expect(calculateRuleScore(lead, offer)).toBe(10); // 10 industry + 0 completeness
  });
});
