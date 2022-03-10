import {
  convertDirection,
  convertCrossing,
  convertRoute,
} from '../src/converter';

const { testTypes, testNotes } = require('./testData');

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
