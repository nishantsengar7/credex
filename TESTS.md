# Automated Tests

This document lists the automated tests written for the Credex AI Spend Audit platform, covering the core calculations and optimization rules of the Audit Engine.

## Test Suite Details

- **Test Runner:** Vitest
- **Target File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
- **Engine Implementation:** [engine.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/engine.ts)

## Test Coverage Summary

The test suite contains **7 automated tests** validating the core business logic of the Audit Engine:

### 1. Pricing & Savings Calculations
* **Test Case:** `correctly calculates monthly and annual savings for an overspending tool (ChatGPT Team)`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Validates that a user on ChatGPT Team with only 1 seat is recommended to downgrade to ChatGPT Plus, saving $10/month ($120/year).
* **Test Case:** `aggregates savings correctly across multiple tools`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Validates that when multiple tools are provided, the total current spend, total optimized spend, and overall monthly/annual savings are correctly summed and computed.

### 2. Recommendation Logic (Seat Optimization)
* **Test Case:** `downgrades Cursor Business to Pro for teams smaller than 5`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Verifies the seat optimization rule where users on Cursor Business/Enterprise tiers with fewer than 5 seats are recommended to downgrade to Cursor Pro.

### 3. Recommendation Logic (Alternative Tool Swap)
* **Test Case:** `recommends swapping ChatGPT to Cursor Pro for development workflows`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Verifies alternative tool recommendations based on primary use cases. Users using ChatGPT for coding/development are recommended to swap to Cursor Pro.

### 4. Edge Cases (Optimal / Unrecognized / Invalid Inputs)
* **Test Case:** `recommends no changes and $0 savings if already on an optimal plan`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Ensures that if a user's plan is already optimal (e.g., Claude Pro for a 1-seat copywriting role), no swaps are recommended and savings are $0.
* **Test Case:** `gracefully handles an unknown tool returning $0 savings`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Validates fallback behavior for custom or unrecognized tools, ensuring they are treated as optimized rather than breaking the calculation engine.
* **Test Case:** `gracefully handles negative spend by treating it as $0 savings`
  * **File:** [engine.test.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/audit-engine/__tests__/engine.test.ts)
  * **Covers:** Ensures that if negative monthly spend values are passed, the engine handles it without throwing execution errors and returns $0 savings.

## How to Run the Tests

To run the test suite locally, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run tests in execution mode:**
   ```bash
   npm run test
   ```
   Or run directly with Vitest:
   ```bash
   npx vitest run
   ```
