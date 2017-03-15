import {
  getTitleForAtom,
  getAtomTypeForAtom,
  isAtomWorkshopEditable,
  getAtomEditorUrl
} from './atomDataExtractors';

jest.mock('./storeAccessor');


const testAtom = {
  id: "testId",
  title: "Test Title",
  atomType: "cta"
};

const testLegacyMediaAtom = {
  atomType: "media",
  id: "testLegacyId",
  data: {
    media: {
      title: "Test Legacy Title"
    }
  }
};

const testMediaAtomWithTitle = Object.assign({}, testLegacyMediaAtom, {
  title: "Non legacy title"
});

test('getTitleForAtom', () => {
  expect(getTitleForAtom(testAtom)).toBe("Test Title");
  expect(getTitleForAtom(testLegacyMediaAtom)).toBe("Test Legacy Title");
  expect(getTitleForAtom(testMediaAtomWithTitle)).toBe("Non legacy title");
});

test('getAtomTypeForAtom', () => {
  expect(getAtomTypeForAtom(testAtom).type).toBe("cta");
  expect(getAtomTypeForAtom(testLegacyMediaAtom).type).toBe("media");
});

test('isAtomWorkshopEditable', () => {
  expect(isAtomWorkshopEditable(testAtom)).toBe(true);
  expect(isAtomWorkshopEditable(testLegacyMediaAtom)).toBe(false);
});

test('getAtomEditorUrl', () => {
  expect(getAtomEditorUrl(testAtom)).toBe("/atom/cta/testId");
  expect(getAtomEditorUrl(testLegacyMediaAtom)).toBe("https://video.test.dev-gutools.co.uk/videos/testLegacyId");
});
