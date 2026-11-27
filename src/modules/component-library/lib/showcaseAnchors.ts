import type { ComponentCategory } from '../models/componentCategory';
import type { ComponentSpecimen } from '../models/componentSpecimen';

export const componentLibraryAnchor = 'component-library';

export function componentCategoryAnchor(category: ComponentCategory) {
  return `components-${category}`;
}

export function componentSpecimenAnchor(specimen: ComponentSpecimen) {
  return specimen.anchor ?? specimen.id;
}
