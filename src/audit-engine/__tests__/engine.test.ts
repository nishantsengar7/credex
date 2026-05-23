import { describe, it, expect } from 'vitest';
import { analyzeToolSpend, analyzeAllTools } from '../engine';
import { generateRecommendation } from '../rules';
import { ToolInput } from '../types';

describe('Audit Engine Core Logic', () => {

  describe('Pricing & Savings Calculations', () => {
    it('correctly calculates monthly and annual savings for an overspending tool (ChatGPT Team)', () => {
      const input: ToolInput = {
        toolName: 'ChatGPT',
        plan: 'Team',
        monthlySpend: 30, // Assuming 1 seat on Team cost $30/mo
        seats: 1,
        teamSize: 1,
        primaryUseCase: 'Writing',
      };

      const result = analyzeToolSpend(input);

      expect(result.toolName).toBe('ChatGPT');
      expect(result.recommendedPlan).toBe('Plus'); // Team -> Plus downgrade
      expect(result.currentSpend).toBe(30);
      expect(result.monthlySavings).toBe(10); // $30 - $20 (Plus)
      expect(result.annualSavings).toBe(120); // 10 * 12
    });

    it('aggregates savings correctly across multiple tools', () => {
      const inputs: ToolInput[] = [
        {
          toolName: 'ChatGPT',
          plan: 'Team',
          monthlySpend: 30,
          seats: 1,
          teamSize: 1,
          primaryUseCase: 'Writing',
        },
        {
          toolName: 'Cursor',
          plan: 'Business',
          monthlySpend: 80, // 2 seats * $40
          seats: 2,
          teamSize: 2,
          primaryUseCase: 'Coding',
        }
      ];

      const report = analyzeAllTools(inputs);

      // ChatGPT saves $10/mo. Cursor saves $40/mo (Business -> Pro: 2 * 40 - 2 * 20 = $40). Total monthly savings = $50.
      expect(report.totalCurrentMonthlySpend).toBe(110);
      expect(report.totalNewMonthlySpend).toBe(60); // ChatGPT Plus ($20) + Cursor Pro ($40)
      expect(report.totalMonthlySavings).toBe(50);
      expect(report.totalAnnualSavings).toBe(600);
      expect(report.results.length).toBe(2);
    });
  });

  describe('Recommendation Logic (Seat Optimization)', () => {
    it('downgrades Cursor Business to Pro for teams smaller than 5', () => {
      const input: ToolInput = {
        toolName: 'Cursor',
        plan: 'Business',
        monthlySpend: 120, // 3 seats
        seats: 3,
        teamSize: 3,
        primaryUseCase: 'Coding',
      };

      const recommendation = generateRecommendation(input);

      expect(recommendation.recommendedTool).toBe('Cursor');
      expect(recommendation.recommendedPlan).toBe('Pro');
      expect(recommendation.estimatedNewMonthlyCost).toBe(60); // 3 * $20
    });
  });

  describe('Recommendation Logic (Alternative Tool Swap)', () => {
    it('recommends swapping ChatGPT to Cursor Pro for development workflows', () => {
      const input: ToolInput = {
        toolName: 'ChatGPT',
        plan: 'Plus',
        monthlySpend: 20,
        seats: 1,
        teamSize: 1,
        primaryUseCase: 'Code generation and debugging',
      };

      const recommendation = generateRecommendation(input);

      expect(recommendation.recommendedTool).toBe('Cursor');
      expect(recommendation.recommendedPlan).toBe('Pro');
      expect(recommendation.estimatedNewMonthlyCost).toBe(20);
    });
  });

  describe('Edge Cases (Highly Optimized)', () => {
    it('recommends no changes and $0 savings if already on an optimal plan', () => {
      const input: ToolInput = {
        toolName: 'Claude',
        plan: 'Pro',
        monthlySpend: 20,
        seats: 1,
        teamSize: 1,
        primaryUseCase: 'Writing',
      };

      const result = analyzeToolSpend(input);

      expect(result.recommendedTool).toBe('Claude');
      expect(result.recommendedPlan).toBe('Pro');
      expect(result.monthlySavings).toBe(0);
      expect(result.annualSavings).toBe(0);
    });
  });

  describe('Invalid or Unknown Inputs', () => {
    it('gracefully handles an unknown tool returning $0 savings', () => {
      const input: ToolInput = {
        toolName: 'MagicAI',
        plan: 'Ultimate',
        monthlySpend: 100,
        seats: 1,
        teamSize: 1,
        primaryUseCase: 'Design',
      };

      const result = analyzeToolSpend(input);

      expect(result.recommendedTool).toBe('MagicAI');
      expect(result.recommendedPlan).toBe('Ultimate');
      expect(result.monthlySavings).toBe(0);
      expect(result.annualSavings).toBe(0);
    });

    it('gracefully handles negative spend by treating it as $0 savings', () => {
      const input: ToolInput = {
        toolName: 'ChatGPT',
        plan: 'Team',
        monthlySpend: -50, // Invalid negative spend
        seats: 1,
        teamSize: 1,
        primaryUseCase: 'Writing',
      };

      const result = analyzeToolSpend(input);
      
      // Since it's negative spend, calculated new cost ($20) is not < current spend (-$50), so it shouldn't recommend a downgrade that costs more.
      expect(result.monthlySavings).toBe(0);
      expect(result.annualSavings).toBe(0);
      expect(result.recommendedPlan).toBe('Team');
    });
  });

});
