import {
  getAtomByType,
  isAtomTypeEditable,
  getCreateUrlFromAtomType
} from './atomData';

jest.mock('../util/storeAccessor');

test('getAtomByType', () => {
  expect(getAtomByType("cta").type).toBe("cta");
  expect(getAtomByType("notarealatom")).toBe(undefined);
});

test('isAtomTypeEditable', () => {
  expect(isAtomTypeEditable("cta")).toBe(true);
  expect(isAtomTypeEditable("media")).toBe(false);
  expect(isAtomTypeEditable("notarealatom")).toBe(false);
});

test('getCreateUrlFromAtomType', () => {
  const ctaAtomType = getAtomByType("cta");
  const mediaAtomType = getAtomByType("media");
  expect(getCreateUrlFromAtomType(ctaAtomType)).toBe("/create/cta");
  expect(getCreateUrlFromAtomType(mediaAtomType)).toBe("https://video.test.dev-gutools.co.uk/videos/create");
});
