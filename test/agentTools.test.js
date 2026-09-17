import { describe, it, expect } from 'vitest';
import { find_schemes, find_hospitals, list_documents } from '../src/agent/tools.js';

describe('HaqDaar Agent Tools', () => {
  describe('find_schemes()', () => {
    it('returns at least 1 eligible scheme for Bihar BPL Dialysis', () => {
      const result = find_schemes({ state: 'Bihar', income_category: 'BPL', condition: 'Dialysis' });
      expect(result.status).toBe('SUCCESS');
      expect(result.count).toBeGreaterThanOrEqual(1);
    });

    it('includes Ayushman Bharat PM-JAY for Bihar BPL', () => {
      const result = find_schemes({ state: 'Bihar', income_category: 'BPL', condition: 'Dialysis' });
      const hasPmjay = result.schemes.some(s => s.name.includes('PM-JAY'));
      expect(hasPmjay).toBe(true);
    });

    it('returns schemes for Karnataka BPL Cardiac (Arogya Karnataka / PM-JAY)', () => {
      const result = find_schemes({ state: 'Karnataka', income_category: 'BPL', condition: 'Cardiac' });
      expect(result.status).toBe('SUCCESS');
      expect(result.count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('find_hospitals()', () => {
    it('returns at least 2 hospitals for Patna Dialysis PM-JAY', () => {
      const result = find_hospitals({ state: 'Bihar', district: 'Patna', condition: 'Dialysis', scheme: 'PM-JAY' });
      expect(result.status).toBe('SUCCESS');
      expect(result.count).toBeGreaterThanOrEqual(2);
    });

    it('AIIMS Patna is present and has a PMAM desk entry', () => {
      const result = find_hospitals({ state: 'Bihar', district: 'Patna', condition: 'Dialysis', scheme: 'PM-JAY' });
      const aiims = result.hospitals.find(h => h.name.includes('AIIMS'));
      expect(aiims).toBeDefined();
      expect(aiims.pmam_desk).toBeTruthy();
    });
  });

  describe('list_documents()', () => {
    it('returns at least 3 documents for PM-JAY Dialysis BPL', () => {
      const result = list_documents({ scheme: 'PM-JAY', condition: 'Dialysis', income_category: 'BPL' });
      expect(result.status).toBe('SUCCESS');
      expect(result.count).toBeGreaterThanOrEqual(3);
    });

    it('Aadhaar is included as a mandatory document', () => {
      const result = list_documents({ scheme: 'PM-JAY', condition: 'Dialysis', income_category: 'BPL' });
      const aadhaar = result.documents.find(d => d.name.includes('Aadhaar'));
      expect(aadhaar).toBeDefined();
    });

    it('documents result includes step-by-step hospital instructions', () => {
      const result = list_documents({ scheme: 'PM-JAY', condition: 'Dialysis', income_category: 'BPL' });
      expect(result.instructions).toBeDefined();
      expect(result.instructions.length).toBeGreaterThan(0);
    });
  });
});
