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

  describe('extractEntitiesFromQuery() and Safety Guardrails', () => {
    it('correctly extracts patient relation, state, district, condition, and income', async () => {
      const { extractEntitiesFromQuery } = await import('../src/agent/agentRunner.js');
      const query = 'My father needs regular dialysis in Patna, Bihar. We hold a BPL ration card.';
      const extracted = extractEntitiesFromQuery(query);

      expect(extracted.patientRelation).toBe('Father');
      expect(extracted.state).toBe('Bihar');
      expect(extracted.district).toBe('Patna');
      expect(extracted.condition).toBe('Dialysis');
      expect(extracted.incomeCategory).toBe('BPL');
    });

    it('detects emergency cardiac and chest pain symptoms', async () => {
      const { checkForEmergency } = await import('../src/agent/agentRunner.js');
      expect(checkForEmergency('Patient is having severe chest pain and heart attack symptoms')).toBe(true);
      expect(checkForEmergency('Regular dialysis consultation in Patna')).toBe(false);
    });

    it('intercepts emergency queries with 108/112 guidance', async () => {
      const { runHaqDaarAgent } = await import('../src/agent/agentRunner.js');
      const result = await runHaqDaarAgent({
        query: 'Emergency heart attack with severe chest pain in Bengaluru'
      });
      expect(result.status).toBe('EMERGENCY_INTERCEPTED');
      expect(result.emergency_guidance).toContain('108');
    });

    it('correctly extracts brain surgery and maps to Neurosurgery package', async () => {
      const { extractEntitiesFromQuery, runHaqDaarAgent } = await import('../src/agent/agentRunner.js');
      const extracted = extractEntitiesFromQuery('brain surgery in Delhi for my mother with BPL card');
      expect(extracted.condition).toBe('Neurosurgery / Brain Surgery');
      expect(extracted.state).toBe('Delhi');

      const result = await runHaqDaarAgent({ query: 'brain surgery in Delhi for my mother' });
      expect(result.status).toBe('SUCCESS');
      expect(result.schemes.length).toBeGreaterThanOrEqual(1);
      expect(result.hospitals.some(h => h.name.includes('AIIMS'))).toBe(true);
    });

    it('finds apex neuro-institutes like NIMHANS for brain surgery in Bengaluru', () => {
      const result = find_hospitals({ state: 'Karnataka', district: 'Bengaluru Urban', condition: 'Neurosurgery / Brain Surgery' });
      expect(result.status).toBe('SUCCESS');
      const nimhans = result.hospitals.find(h => h.name.includes('NIMHANS'));
      expect(nimhans).toBeDefined();
    });

    it('supports Pan-India state schemes (Maharashtra MJPJAY, UP MMJAY, PM-JAY)', () => {
      const resultMah = find_schemes({ state: 'Maharashtra', income_category: 'BPL', condition: 'Cardiac' });
      expect(resultMah.schemes.some(s => s.name.includes('MJPJAY') || s.name.includes('PM-JAY'))).toBe(true);

      const resultUP = find_schemes({ state: 'Uttar Pradesh', income_category: 'BPL', condition: 'Neurosurgery / Brain Surgery' });
      expect(resultUP.schemes.some(s => s.name.includes('PM-JAY'))).toBe(true);
    });
  });
});


