import {
  strings,
  portalUiStrings,
  componentExpansionStrings as added,
  componentBrowserStrings as browser,
} from '@/strings';
import { ThemeControls } from '@/modules/settings/components/ThemeControls';
import type { ComponentSpecimen } from './models/componentSpecimen';
import { FoundationsShowcase } from './components/FoundationsShowcase';
import { PatternsShowcase } from './components/PatternsShowcase';
import { ButtonsShowcase } from './components/ButtonsShowcase';
import { InputsShowcase } from './components/InputsShowcase';
import { SelectionShowcase } from './components/SelectionShowcase';
import { TilesShowcase } from './components/TilesShowcase';
import { CardsShowcase } from './components/CardsShowcase';
import { SectionsShowcase } from './components/SectionsShowcase';
import { FeedbackShowcase } from './components/FeedbackShowcase';
import { EmptyStatesShowcase } from './components/EmptyStatesShowcase';
import { TableShowcase } from './components/TableShowcase';
import { MotionShowcase } from './components/MotionShowcase';
import { EditingShowcase } from './components/EditingShowcase';
import { CollectionShowcase } from './components/CollectionShowcase';
import { InteractionsShowcase } from './components/InteractionsShowcase';
import { MediaShowcase } from './components/MediaShowcase';
import { ValueControlsShowcase } from './components/ValueControlsShowcase';
import { AvatarsShowcase } from './components/AvatarsShowcase';
import { UploadsShowcase } from './components/UploadsShowcase';
import { ComboboxShowcase } from './components/ComboboxShowcase';
import { DateRangeShowcase } from './components/DateRangeShowcase';
import { BulkSelectionShowcase } from './components/BulkSelectionShowcase';

const copy = strings.componentLibrary;
export const componentCategories = [
  'all',
  'foundations',
  'inputs',
  'data',
  'feedback',
  'media',
] as const;
export const componentSpecimens: readonly ComponentSpecimen[] = [
  {
    id: 'avatars',
    title: added.examples.avatarsTitle,
    description: added.examples.avatarsDescription,
    category: 'foundations',
    icon: 'user',
    keywords: browser.keywords.avatars,
    Preview: AvatarsShowcase,
    isNew: true,
  },
  {
    id: 'uploads',
    title: added.examples.uploadTitle,
    description: added.examples.uploadDescription,
    category: 'media',
    icon: 'upload',
    keywords: browser.keywords.uploads,
    Preview: UploadsShowcase,
    isNew: true,
  },
  {
    id: 'bulk',
    title: added.examples.selectionTitle,
    description: added.examples.selectionDescription,
    category: 'data',
    icon: 'table',
    keywords: browser.keywords.bulk,
    Preview: BulkSelectionShowcase,
    isNew: true,
  },
  {
    id: 'combobox',
    title: added.examples.comboTitle,
    description: added.examples.comboDescription,
    category: 'inputs',
    icon: 'search',
    keywords: browser.keywords.combobox,
    Preview: ComboboxShowcase,
    isNew: true,
  },
  {
    id: 'dateRange',
    title: added.examples.rangeTitle,
    description: added.examples.rangeDescription,
    category: 'inputs',
    icon: 'calendar',
    keywords: browser.keywords.dateRange,
    Preview: DateRangeShowcase,
    isNew: true,
  },
  {
    id: 'theme',
    title: strings.designSystem.theme,
    description: browser.categoryHints.foundations,
    category: 'foundations',
    icon: 'sun',
    keywords: browser.keywords.theme,
    Preview: ThemeControls,
    isNew: false,
  },
  {
    id: 'foundations',
    title: copy.foundations,
    description: copy.foundationsHint,
    category: 'foundations',
    icon: 'layers',
    keywords: browser.keywords.foundations,
    Preview: FoundationsShowcase,
    isNew: false,
  },
  {
    id: 'motion',
    title: strings.designSystem.motion,
    description: strings.designSystem.motionHint,
    category: 'foundations',
    icon: 'sparkles',
    keywords: browser.keywords.motion,
    Preview: MotionShowcase,
    isNew: false,
  },
  {
    id: 'buttons',
    title: copy.buttons,
    description: copy.buttonsHint,
    category: 'foundations',
    icon: 'plus',
    keywords: browser.keywords.buttons,
    Preview: ButtonsShowcase,
    isNew: false,
  },
  {
    id: 'inputs',
    title: copy.inputs,
    description: copy.inputsHint,
    category: 'inputs',
    icon: 'file',
    keywords: browser.keywords.inputs,
    Preview: InputsShowcase,
    isNew: false,
  },
  {
    id: 'values',
    title: strings.valueControls.title,
    description: strings.valueControls.description,
    category: 'inputs',
    icon: 'filter',
    keywords: browser.keywords.values,
    Preview: ValueControlsShowcase,
    isNew: false,
  },
  {
    id: 'selection',
    title: copy.selection,
    description: copy.selectionHint,
    category: 'inputs',
    icon: 'check',
    keywords: browser.keywords.selection,
    Preview: SelectionShowcase,
    isNew: false,
  },
  {
    id: 'tiles',
    title: copy.tiles,
    description: copy.tilesHint,
    category: 'inputs',
    icon: 'grid',
    keywords: browser.keywords.tiles,
    Preview: TilesShowcase,
    isNew: false,
  },
  {
    id: 'sections',
    title: copy.formSections,
    description: copy.formSectionsHint,
    category: 'inputs',
    icon: 'file',
    keywords: browser.keywords.sections,
    Preview: SectionsShowcase,
    isNew: false,
  },
  {
    id: 'patterns',
    title: copy.patterns,
    description: copy.patternsHint,
    category: 'data',
    icon: 'layers',
    keywords: browser.keywords.patterns,
    Preview: PatternsShowcase,
    isNew: false,
  },
  {
    id: 'table',
    title: copy.table,
    description: copy.tableHint,
    category: 'data',
    icon: 'table',
    keywords: browser.keywords.table,
    Preview: TableShowcase,
    isNew: false,
  },
  {
    id: 'cards',
    title: copy.cards,
    description: copy.cardsHint,
    category: 'data',
    icon: 'card',
    keywords: browser.keywords.cards,
    Preview: CardsShowcase,
    isNew: false,
  },
  {
    id: 'collections',
    title: strings.designSystem.reorder,
    description: strings.designSystem.advancedHint,
    category: 'data',
    icon: 'listBullet',
    keywords: browser.keywords.collections,
    Preview: CollectionShowcase,
    isNew: false,
  },
  {
    id: 'feedback',
    title: copy.feedback,
    description: copy.feedbackHint,
    category: 'feedback',
    icon: 'bell',
    keywords: browser.keywords.feedback,
    Preview: FeedbackShowcase,
    isNew: false,
  },
  {
    id: 'empty',
    title: copy.emptyStates,
    description: copy.emptyStatesHint,
    category: 'feedback',
    icon: 'info',
    keywords: browser.keywords.empty,
    Preview: EmptyStatesShowcase,
    isNew: false,
  },
  {
    id: 'interactions',
    title: portalUiStrings.library.title,
    description: portalUiStrings.library.description,
    category: 'feedback',
    icon: 'star',
    keywords: browser.keywords.interactions,
    Preview: InteractionsShowcase,
    isNew: false,
  },
  {
    id: 'media',
    title: strings.designSystem.media,
    description: strings.designSystem.mediaHint,
    category: 'media',
    icon: 'image',
    keywords: browser.keywords.media,
    Preview: MediaShowcase,
    isNew: false,
  },
  {
    id: 'editing',
    title: strings.designSystem.advanced,
    description: strings.designSystem.advancedHint,
    category: 'media',
    icon: 'code',
    keywords: browser.keywords.editing,
    Preview: EditingShowcase,
    isNew: false,
  },
];
export const componentIds = [
  'catalog',
  ...componentSpecimens.map((item) => item.id),
];
