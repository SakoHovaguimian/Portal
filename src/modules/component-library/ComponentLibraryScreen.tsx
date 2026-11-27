import { componentBrowserStrings as copy } from '@/strings';

import { ComponentIndex } from './components/ComponentIndex';
import { componentCategories, componentSpecimens } from './componentSpecimens';
import { componentCategoryAnchor, componentLibraryAnchor } from './lib/showcaseAnchors';
import type { ComponentCategory } from './models/componentCategory';
import type { ComponentSpecimen } from './models/componentSpecimen';

export function ComponentLibraryScreen() {

  function renderSpecimen({ id, Preview }: ComponentSpecimen) {
    return <Preview key={id} />;
  }

  function renderCategory(category: ComponentCategory) {

    const items = componentSpecimens.filter((item) => item.category === category);
    const id = componentCategoryAnchor(category);
    const titleId = `${id}-title`;

    return (
      <section
        key={category}
        id={id}
        tabIndex={-1}
        aria-labelledby={titleId}
        className="grid min-w-0 gap-7 rounded-control"
      >
        <header className="grid min-w-0 gap-1.5 border-b-control border-secondary pb-4">
          <h3 id={titleId} className="m-0 text-xl font-semibold tracking-tight text-primary">
            {copy.categories[category]}
          </h3>
          <p className="m-0 max-w-[68ch] text-sm text-secondary">
            {copy.categoryHints[category]}
          </p>
        </header>
        <div className="grid min-w-0 gap-9 sm:gap-12">
          {items.map(renderSpecimen)}
        </div>
      </section>
    );

  }

  return (
    <section
      id={componentLibraryAnchor}
      aria-labelledby="component-library-title"
      tabIndex={-1}
      className="grid min-w-0 gap-6 border-t-control border-secondary pt-7 sm:gap-8 sm:pt-10"
    >
      <header className="grid gap-2">
        <h2 id="component-library-title" className="m-0 text-3xl font-semibold tracking-tight text-primary">
          {copy.title}
        </h2>
        <p className="m-0 max-w-[68ch] text-sm text-secondary">
          {copy.description}
        </p>
      </header>
      <div className="grid min-w-0 items-start gap-7 xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:gap-8">
        <ComponentIndex />
        <div className="grid min-w-0 gap-12 sm:gap-16">
          {componentCategories.map(renderCategory)}
        </div>
      </div>
    </section>
  );

}
