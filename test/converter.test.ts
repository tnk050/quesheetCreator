import {
  convertDirection,
  convertCrossing,
  convertRoute,
  extractRemarks,
} from '../src/converter';

const { testTypes } = require('./testData');
const testNotes = require('./testNotes.json');

test('convertDirection', () => {
  testTypes.forEach((value, key) => {
    expect(convertDirection(key)).toBe(value);
  });
});

test('convertCrossing', () => {
  testNotes.forEach((note) => {
    expect(convertCrossing(note.data)).toBe(note.crrosing);
  });
});

test('convertRoute Ja', () => {
  testNotes.forEach((note) => {
    expect(convertRoute(note.data)).toBe(note.routeJ);
  });
});

test('convertRoute En', () => {
  testNotes.forEach((note) => {
    expect(convertRoute(note.data, 'en')).toBe(note.routeE);
  });
});

test('convertRoute K', () => {
  testNotes.forEach((note) => {
    expect(convertRoute(note.data, 'k')).toBe(note.routeK);
  });
});

test('extractRemarks', () => {
  testNotes.forEach((note) => {
    expect(extractRemarks(note.data)).toBe(note.remarks);
  });
});
