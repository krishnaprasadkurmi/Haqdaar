import { find_schemes, find_hospitals, list_documents } from '../src/agent/tools.js';
import assert from 'node:assert';

console.log('--- RUNNING HAQDAAR AGENT TOOLS VERIFICATION ---');

// Test 1: find_schemes for Bihar Dialysis BPL
const biharSchemes = find_schemes({ state: 'Bihar', income_category: 'BPL', condition: 'Dialysis' });
console.log(`[Test 1] find_schemes (Bihar BPL Dialysis): returned ${biharSchemes.count} schemes`);
assert.ok(biharSchemes.count >= 1, 'Should find at least 1 eligible scheme for Bihar BPL');
assert.strictEqual(biharSchemes.status, 'SUCCESS');
const hasPmjay = biharSchemes.schemes.some(s => s.name.includes('PM-JAY'));
assert.ok(hasPmjay, 'Should include Ayushman Bharat PM-JAY');

// Test 2: find_hospitals for Patna Dialysis
const patnaHospitals = find_hospitals({ state: 'Bihar', district: 'Patna', condition: 'Dialysis', scheme: 'PM-JAY' });
console.log(`[Test 2] find_hospitals (Patna Dialysis): returned ${patnaHospitals.count} hospitals`);
assert.ok(patnaHospitals.count >= 2, 'Should return at least 2 matched hospitals in Patna');
const aiims = patnaHospitals.hospitals.find(h => h.name.includes('AIIMS'));
assert.ok(aiims, 'Should locate AIIMS Patna for dialysis');
assert.ok(aiims.pmam_desk, 'Hospital record must include PMAM desk counter instructions');

// Test 3: find_schemes for Karnataka Cardiac ArK
const karSchemes = find_schemes({ state: 'Karnataka', income_category: 'BPL', condition: 'Cardiac' });
console.log(`[Test 3] find_schemes (Karnataka BPL Cardiac): returned ${karSchemes.count} schemes`);
assert.ok(karSchemes.count >= 1, 'Should find Arogya Karnataka / PM-JAY');

// Test 4: list_documents for Dialysis
const docs = list_documents({ scheme: 'PM-JAY', condition: 'Dialysis', income_category: 'BPL' });
console.log(`[Test 4] list_documents (Dialysis): returned ${docs.count} documents`);
assert.ok(docs.count >= 3, 'Should include Aadhaar, Ration card, and prescription');
const aadhaar = docs.documents.find(d => d.name.includes('Aadhaar'));
assert.ok(aadhaar, 'Aadhaar must be in mandatory documents');

console.log('--- ALL AGENT TOOL TESTS PASSED SUCCESSFULLY! ---');
