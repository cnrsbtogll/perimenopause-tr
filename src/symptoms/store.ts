import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';

export type SymptomType =
  | 'hot_flash'
  | 'night_sweat'
  | 'mood'
  | 'sleep'
  | 'energy'
  | 'period';

export type SymptomEntry = {
  id: string;
  type: SymptomType;
  severity: number;
  note: string;
};

export type SymptomRecord = {
  id: string;
  date: string;
  symptoms: SymptomEntry[];
};

const STORAGE_KEY = '@perimenopause-tr/symptom-records';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function createSymptomRecord(
  date: string,
  symptoms: SymptomEntry[],
  id: string,
): SymptomRecord {
  assertValidDate(date);
  return {
    id,
    date,
    symptoms: symptoms.map((symptom) => ({ ...symptom })),
  };
}

export function getRecordForDate(
  records: SymptomRecord[],
  date: string,
): SymptomRecord | undefined {
  return records.find((record) => record.date === date);
}

export function saveSymptomRecord(
  existing: SymptomRecord[],
  incoming: SymptomRecord,
): SymptomRecord[] {
  const withoutCurrentDate = existing.filter(
    (record) => record.date !== incoming.date,
  );
  return [incoming, ...withoutCurrentDate].sort(
    (left, right) => right.date.localeCompare(left.date),
  );
}

function assertValidDate(value: string): void {
  if (!DATE_PATTERN.test(value)) {
    throw new Error('geçersiz tarih');
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error('geçersiz tarih');
  }
}

export function useSymptomRecords() {
  const [records, setRecords] = React.useState<SymptomRecord[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(() =>
    getTodayString(),
  );

  const selectedDateRecord = useMemo(() => {
    const loadedRecords = loadRecords();
    return getRecordForDate(loadedRecords, selectedDate);
  }, [selectedDate]);

  async function saveRecord(incoming: SymptomRecord): Promise<void> {
    const nextRecords = saveSymptomRecord(records, incoming);
    setRecords(nextRecords);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
  }

  return {
    records,
    selectedDate,
    selectedDateRecord,
    setSelectedDate,
    saveRecord,
  };
}

async function loadRecords(): Promise<SymptomRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidRecord);
  } catch {
    return [];
  }
}

function isValidRecord(value: unknown): value is SymptomRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Partial<SymptomRecord>;
  return (
    typeof record.id === 'string' &&
    typeof record.date === 'string' &&
    DATE_PATTERN.test(record.date) &&
    Array.isArray(record.symptoms) &&
    record.symptoms.every((symptom) => isSymptomEntry(symptom))
  );
}

function isSymptomEntry(value: unknown): value is SymptomEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const symptom = value as Partial<SymptomEntry>;
  return (
    typeof symptom.id === 'string' &&
    typeof symptom.type === 'string' &&
    typeof symptom.severity === 'number' &&
    typeof symptom.note === 'string'
  );
}

function getTodayString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
