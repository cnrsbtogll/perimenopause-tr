import assert from 'node:assert/strict';
import {
  createSymptomRecord,
  getRecordForDate,
  saveSymptomRecord,
  type SymptomEntry,
} from '../src/symptoms/store';

const hotFlash: SymptomEntry = {
  id: 'hf-1',
  type: 'hot_flash',
  severity: 3,
  note: 'Öğleden sonra',
};

test('same day replaces the previous symptom record', () => {
  const original = createSymptomRecord('2026-09-25', [hotFlash], 'old-id');
  const updated = createSymptomRecord('2026-09-25', [{ ...hotFlash, severity: 4 }], 'new-id');
  const records = saveSymptomRecord([original], updated);

  assert.equal(records.length, 1);
  assert.equal(records[0].id, 'new-id');
  assert.equal(records[0].symptoms.length, 1);
  assert.equal(records[0].symptoms[0].severity, 4);
});

test('keeps different dates separate and newest first', () => {
  const older = createSymptomRecord('2026-09-24', [hotFlash], 'older-id');
  const newest = createSymptomRecord('2026-09-25', [hotFlash], 'newest-id');
  const records = saveSymptomRecord([older, newest], createSymptomRecord('2026-09-23', [hotFlash], '2026-09-23'));

  assert.deepEqual(
    records.map((record) => record.id),
    ['newest-id', 'older-id', '2026-09-23'],
  );
  assert.equal(getRecordForDate(records, '2026-09-23')?.id, '2026-09-23');
});

test('rejects an invalid date', () => {
  assert.throws(() => createSymptomRecord('2026-02-31', [hotFlash], 'bad-id'), /geçersiz/);
});