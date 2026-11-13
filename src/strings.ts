// Copy rules (validated by copy/title-case and npm run check:strings):
// Capitalize every word in actions, titles, labels, navigation, options, and statuses.
// Use sentence case for descriptions, hints, validation/error messages, and other prose.
// Preserve the spelling of sample data, technical values, and project/CLI content.
// Name ambiguous keys by their role, such as emptyTitle, emptyHint, or credentialData.
// All authored display copy belongs in this file. See docs/STRINGS.md.

// Project Identity

// PROJECT_IDENTITY_START
export const portalProjectStrings = {
  name: 'Portal',
  description: 'Your workspace for people, requests, and conversations.',
};
// PROJECT_IDENTITY_END

// Application And Shared UI

export const strings = {
  // Project, Authentication, And Integrations
  app: {
    backToWorkspace: 'Back To Workspace',
    name: portalProjectStrings.name,
    description: portalProjectStrings.description,
  },
  auth: {
    showPassword: 'Show Password',
    hidePassword: 'Hide Password',
    invalidCredentialsHint: 'The email or password is incorrect.',
    emailExistsHint: 'An account already exists with this email.',
    invalidEmailHint: 'Enter a valid email address.',
    passwordHint: 'Use at least eight characters for your password.',
    nameHint: 'Enter your name.',
    disabledHint: 'This account is disabled. Contact your administrator.',
    tooManyHint: 'Too many attempts. Please wait before trying again.',
    failedHint: 'Unable to sign in. Please try again.',
    signupFailedHint: 'Unable to create your account. Please try again.',
    sessionTooLargeHint: 'Unable to save this session. Contact your administrator.',
    loggedOut: 'Signed Out',
    logoutFailedHint: 'Unable to sign out. Please try again.',
  },
  myProfile: {
    open: 'Open My Profile',
  },
  accounts: {
    representedBusinesses: {
      title: 'Represented Businesses',
      description: 'Businesses currently assigned to this Sales Rep.',
      loading: 'Loading Represented Businesses…',
      emptyTitle: 'No Represented Businesses',
      emptyHint: 'This Sales Rep has no current business assignments.',
      pagination: 'Represented Business Pages',
      range: (from: number, to: number) => `${from}–${to} Businesses`,
    },
  },
  privacy: {
    title: 'Analytics Preferences',
    description:
      'Essential cookies keep you signed in. Optional Amplitude analytics helps us understand which screens are useful. It stays off until you accept.',
    accept: 'Accept Analytics',
    decline: 'Essential Only',
    savedHint: 'Your analytics preference has been saved.',
    settings: 'Analytics Preferences',
    demoHint: 'Analytics is disabled in this demo.',
  },
  notifications: {
    title: 'Browser Notifications',
    enable: 'Enable Notifications',
    disable: 'Disable Notifications',
    enabled: 'Notifications Enabled',
    availableHint: 'Receive chat and workspace alerts in this browser.',
    deniedHint:
      'Notifications are blocked. Change this site’s permission in your browser settings to enable them.',
    unsupportedHint: 'Browser notifications are unavailable on this device.',
    demoHint: 'Notifications are simulated in demo mode.',
    unconfiguredHint:
      'Browser notifications are not configured for this workspace.',
    failedHint: 'Could not update notifications. Please try again.',
    busy: 'Updating Notifications…',
    alert: 'Workspace Alert',
    disabled: 'Notifications Disabled',
  },
  environment: {
    missing: (name: string) => `Missing required environment variable: ${name}`,
    secret: 'SESSION_SECRET must contain at least 32 characters in live mode.',
    invalid: 'Invalid Portal environment configuration.',
  },

  // Shared Actions And Errors

  common: {
    loading: 'Loading…',
    saving: 'Saving…',
    pendingValue: '…',
    unsavedTitle: 'Discard Unsaved Changes?',
    unsavedDescription:
      'Your entries have not been saved. Leaving this form will discard them.',
    discardChanges: 'Discard Changes',
    keepEditing: 'Keep Editing',
  },
  errors: {
    invalidInput: 'Check your entries and try again.',
    requestFailed: 'The request could not be completed. Try again.',
    unavailable: 'The service is temporarily unavailable. Try again shortly.',
    forbidden: 'You do not have permission to perform this action.',
    sessionExpired: 'Your session has expired. Sign in again.',
    notFound: 'This item could not be found.',
    untrusted: 'This request did not originate from Portal.',
    invalidPath: 'Invalid API path.',
    configuration: 'Portal is not configured for this service.',
    unexpected: 'Something went wrong. Please try again.',
    provider: 'This component must be rendered inside its provider.',
  },
  apiMutations: {
    mediaLoading: 'Loading Saved Image…',
  },

  // Shared UI And Editors
  valueControls: {
    minimum: 'Minimum',
    maximum: 'Maximum',
    decrease: 'Decrease Value',
    increase: 'Increase Value',
    title: 'Progress And Value Controls',
    description:
      'Adjust values, choose a range, and follow progress. Every control follows your theme.',
    slidersTitle: 'Sliders',
    progressTitle: 'Progress Indicators',
    loadingTitle: 'Loading Placeholders',
    brightness: 'Brightness',
    brightnessHint:
      'Use the arrow keys for small adjustments, or Home and End to reach the limits.',
    exposure: 'Exposure',
    exposureHint: 'The fill extends from the value to the maximum.',
    priceRange: 'Price Range',
    priceRangeHint: 'Adjust either end. The minimum cannot pass the maximum.',
    stepped: 'Text Size',
    vertical: 'Intensity',
    disabled: 'Unavailable',
    invalid: 'Selection Needs Attention',
    invalidMessage: 'Choose a value of at least 25 to continue.',
    readOnly: 'Read-Only Quantity',
    quantity: 'Quantity',
    quantityHint: 'Enter a number or use the buttons. Available from 1 to 12.',
    upload: 'File Transfer',
    uploadHint: 'A local preview. No files are uploaded.',
    processing: 'Processing',
    complete: 'Complete',
    paused: 'Paused',
    failed: 'Transfer Interrupted',
    failedHint:
      'The connection was interrupted. Retry to continue the preview.',
    retry: 'Retry Transfer',
    storage: 'Storage Used',
    storageHint: 'A meter shows a measurement, rather than a task in progress.',
    activity: 'Loading Content',
    download: 'Download',
    run: 'Run Progress Preview',
    pause: 'Pause Preview',
    reset: 'Reset Controls',
    skeletonHint: 'Placeholders keep the layout steady while content loads.',
    simulateFailure: 'Simulate Interruption',
  },
  designSystem: {
    themeStudio: {
      title: 'Choose Your Theme',
      description:
        'Choose a complete look for your workspace. Every theme brings its own colors, typography, shapes, and details.',
      themeGroup: 'Workspace Theme',
      selectedTheme: (name: string) => `${name} Selected`,
      previewHeading: 'Your Workspace',
      previewProject: 'Release Plan',
      previewAction: 'Review',
      previewMetric: '12',
      previewMetricLabel: 'Open Tasks',
      preferencesTitle: 'Make It Yours',
      preferencesHint:
        'Use your theme in light or dark, and choose how much motion feels right.',
      liveTitle: 'Try The Details',
      liveHint:
        'These are the same controls and tables used throughout Portal. Try them to feel the selected theme.',
      projectLabel: 'Project Name',
      projectSample: 'Portal Workspace',
      notifyLabel: 'Notify The Team',
      notifyHint: 'A local preview; no notifications are sent.',
      toastAction: 'Preview Toast',
      resetAction: 'Reset Preview',
      toastTitle: 'Looking Good',
      toastDescription: 'Your selected theme carries through to feedback, too.',
      tableCaption: 'Theme Preview Tasks',
      taskColumn: 'Task',
      statusColumn: 'Status',
      ownerColumn: 'Owner',
      rows: [
        {
          task: 'Review The Design',
          status: 'In Progress',
          owner: 'You',
        },
        {
          task: 'Prepare The Release',
          status: 'Ready',
          owner: 'Team',
        },
      ],
      themes: {
        cupertino: {
          name: 'macOS / iOS',
          description:
            'System typography, blue accents, green switches, and the familiar feel of Apple controls.',
        },
        portal: {
          name: 'Portal',
          description:
            'The original. Familiar curves and a balanced workspace.',
        },
        studio: {
          name: 'Studio',
          description:
            'Soft corners, generous space, and confident cobalt blue.',
        },
        atelier: {
          name: 'Atelier',
          description:
            'Warm paper, expressive serif headings, and quiet surfaces.',
        },
        blueprint: {
          name: 'Blueprint',
          description:
            'Precise edges, compact rhythm, and technical typography.',
        },
        arcade: {
          name: 'Arcade',
          description: 'Bold outlines, playful type, and shadows with an edge.',
        },
        dusk: {
          name: 'Dusk',
          description:
            'Plum and slate, refined type, and softly elevated panels.',
        },
      },
    },
    recordRange: (from: number, to: number) => `Showing Records ${from}–${to}`,
    theme: 'Theme',
    themeHint:
      'Appearance applies to every component and stays with this browser.',
    mode: 'Color Mode',
    motion: 'Motion',
    motionHint:
      'System follows your device. Reduced motion removes movement across the interface.',
    systemMotion: 'Follow Device Settings',
    reducedMotion: 'Reduce Motion',
    preferenceFailedHint: 'Could not save your preference. Try again.',
    advanced: 'Advanced Components',
    advancedHint:
      'Edit, arrange, filter, and preview with the same components used in your project.',
    notes: 'Project Notes',
    notesSample:
      '# Project notes\n\nKeep the team informed with **clear updates**.\n\n- Review the proposal\n- Publish the next release',
    markdown: 'Markdown Editor',
    reorder: 'Arrange Items',
    itemNames: ['Plan The Project', 'Design The Interface', 'Ship The Release'],
    reorderHandle: (name: string) => `Reorder ${name}`,
    selectedCount: (count: number) => `${count} Selected`,
    reorderUp: (name: string) => `Move ${name} Up`,
    reorderDown: (name: string) => `Move ${name} Down`,
    panels: 'Persistent Panels',
    panelsHint: 'Switch sections and return. Each section keeps its entries.',
    edit: 'Edit',
    preview: 'Preview',
    draftLabel: 'Draft Title',
    draftSample: 'My next project',
    filters: 'Directory Filters',
    noResults: 'No Matching Items',
    clearFilters: 'Clear Filters',
    multiSelect: 'Multiple Selection',
    selectProjects: 'Select Projects',
    dialog: 'Dialog With A Select',
    openDialog: 'Open Dialog',
    dialogHint:
      'Select an option, then press Escape to close the popup before the dialog.',
    media: 'Media Previews',
    mediaHint: 'A local illustration shows the mosaic and full-size preview.',
    imageAlt: 'Abstract Portal illustration',
    imageTitle: 'Portal Illustration',
    amount: 'Amount',
    timeZone: 'Time Zone',
    country: 'Country',
    color: 'Color',
    upload: 'Choose A File',
    uploadHint: 'File selection stays local to this preview.',
    overlayTiming: 'Overlay Duration',
    timingHint: 'Preview alert, sheet, and toast timing in milliseconds.',
    reset: 'Reset Motion',
    showToast: 'Preview Toast',
    toastPosition: 'Toast Position',
    toastPositions: {
      'top-left': 'Top Left',
      'top-center': 'Top Center',
      'top-right': 'Top Right',
      'bottom-left': 'Bottom Left',
      'bottom-center': 'Bottom Center',
      'bottom-right': 'Bottom Right',
    },
    toastStack: 'Preview Toast Stack',
    toastStackHint: 'New notifications arrive from the edge. Earlier ones settle into place; dismiss one to watch the gap close.',
    stackSavedTitle: 'Draft Saved',
    stackSavedDescription: 'Your onboarding checklist is ready to continue.',
    stackUpdatedTitle: 'Checklist Updated',
    stackUpdatedDescription: 'The welcome email is now the next step.',
    stackReadyTitle: 'Ready To Review',
    stackReadyDescription: 'All three onboarding tasks have owners.',
    previewBottomSheet: 'Preview Bottom Sheet',
    showAlert: 'Preview Alert',
    showSheet: 'Preview Sheet',
    close: 'Close',
    openLibrary: 'Open Component Library',
    libraryHint:
      'Browse the shared controls and responsive patterns available in this project.',
    tableRows: 'Records',
    profileLink: 'Open Your Profile',
  },
  componentLibrary: {
    milliseconds: (value: number) => `${value} ms`,
    title: 'Component Library',
    developerSettings: 'Developer Settings',
    description:
      'Reusable components, responsive patterns, and motion for every Portal project.',
    version: 'v1.0.0',
    system: 'Design System',
    navigation: 'Component Sections',
    skipToContent: 'Skip To Content',
    localPreview: 'Interactive Preview',
    localPreviewHint:
      'Try the controls. Examples stay on this page and do not change business data.',
    onThisPage: 'On This Page',
    patterns: 'Page Patterns',
    patternsHint:
      'The building blocks every portal page uses: one header, titled sections, record panels, lists, and progress.',
    patternLabels: {
      header: 'Page Header',
      split: 'Split Section',
      panel: 'Data Panel',
      list: 'List Rows',
      stepper: 'Stepper',
    },
    patternHints: {
      headerHint:
        'Breadcrumbs, the page’s only h1, supporting copy, facts, and actions.',
      split:
        'Explains a group of settings beside the fields that change them. Stack groups in a SectionStack.',
      panel:
        'Filters, records, and paging share one surface. Refreshes show a thin progress line.',
      list: 'Status checklists and ordered items with trailing badges or actions.',
      stepper:
        'Horizontal segments and vertical stages with shared progress, focus, and motion.',
    },
    sampleSteps: ['Details', 'Settings', 'Review'],
    sampleStepHints: [
      'Name & Classification',
      'Pricing & Availability',
      'Check Before Saving',
    ],
    sampleCatalog: 'Sample Catalog',
    sampleProducts: 'Products',
    foundations: 'Foundations / Tokens',
    foundationsHint: 'Shared colors, spacing, corners, and outline icons.',
    colors: 'Colors',
    colorLabels: {
      primary: 'Primary',
      softGreen: 'Soft Accent',
      surface: 'Surface',
      border: 'Border',
      text: 'Text Primary',
      muted: 'Text Secondary',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
    },
    accessibleGreenHint:
      'Action colors keep text readable in light and dark themes.',
    radius: 'Border Radius',
    radiusLabels: ['None', 'Small', 'Control', 'Card', 'Overlay', 'Sidebar'],
    spacing: 'Spacing',
    spacingHint: 'Spacing Follows The Selected Theme',
    pixelsData: (value: number) => `${value}px`,
    icons: 'Icons / Outline Style',
    iconsHint: 'Consistent strokes and rounded caps.',
    typography: 'Readable Type',
    typographyHint: 'Shared Body, Control, And Caption Styles',
    motion: 'Interaction Motion',
    motionHint: 'Press, Feedback, And Selection Follow The Theme',
    reducedMotionHint:
      'System Reduce Motion removes movement and keeps state changes immediate.',
    buttons: 'Buttons',
    buttonsHint:
      'Action hierarchy and interactive states. Hover or use Tab to inspect.',
    variants: {
      primary: 'Primary',
      secondary: 'Secondary',
      ghost: 'Tertiary / Ghost',
      icon: 'Icon Button',
      destructive: 'Destructive',
    },
    states: {
      default: 'Default',
      hover: 'Hover',
      focused: 'Focused',
      disabled: 'Disabled',
      loading: 'Loading',
    },
    buttonExample: (variant: string, state: string) =>
      `${variant}, ${state} Example`,
    create: 'Create Product',
    creating: 'Creating…',
    filter: 'Filter',
    cancel: 'Cancel',
    delete: 'Delete',
    settings: 'Settings',
    actionPreview: 'Preview Action Completed',
    actionPreviewHint: 'This example did not change any saved data.',
    deleteTitle: 'Preview A Destructive Action?',
    deleteHint:
      'This dialog demonstrates confirmation and focus handling. No records will be deleted.',
    confirmPreview: 'Confirm Preview',
    keepPreview: 'Keep Editing',
    inputs: 'Inputs',
    inputsHint:
      'Labeled fields with focus, validation, disabled, and read-only states.',
    inputStates: {
      default: 'Default',
      filled: 'Filled',
      focused: 'Focused',
      error: 'Error',
      disabled: 'Disabled',
      readOnly: 'Read Only',
    },
    enterName: 'Enter Name',
    sampleName: 'Pedro Pascalius',
    invalidInput: 'Invalid Input',
    errorHint: 'Enter a product name to continue.',
    productName: 'Product Name',
    sampleProduct: 'Portal starter kit',
    sku: 'SKU / Internal Code',
    sampleSku: 'SKU-000123',
    brand: 'Manufacturer / Brand',
    sampleBrand: 'Portal',
    search: 'Search Field',
    searchPlaceholder: 'Search Products…',
    select: 'Dropdown / Select',
    payment: 'Payment Card',
    samplePayment: '4242 4242 4242 4242',
    descriptionLabel: 'Description / Text Area',
    sampleDescription:
      'A reusable starter kit for teams. Add a clear description so everyone knows what is included.',
    characterCount: (count: number, limit: number) => `${count}/${limit}`,
    selection: 'Selection Controls',
    selectionHint:
      'Native checkboxes, radios, switches, and segmented choices.',
    switches: 'Toggle Switch',
    on: 'On',
    off: 'Off',
    disabled: 'Disabled',
    disabledChecked: 'Disabled And Checked',
    disabledSelected: 'Disabled And Selected',
    checkboxes: 'Checkboxes',
    checked: 'Checked',
    unchecked: 'Unchecked',
    radios: 'Radio Buttons',
    selected: 'Selected',
    unselected: 'Unselected',
    radioGroup: 'Example Radio Selection',
    segmentedLabel: 'Filter By Status',
    segmented: 'Segmented Control',
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    draft: 'Draft',
    tiles: 'Selection Tiles / Chips',
    tilesHint: 'Select a tile to see its chip appear and the list settle.',
    categories: 'Product Types',
    selectedCategories: 'Selected Product Types',
    categoryLabels: {
      flower: 'Projects',
      edibles: 'Resources',
      extracts: 'Integrations',
      topicals: 'Templates',
      accessories: 'Assets',
      cbd: 'Support',
      cookies: 'Documents',
      gummies: 'Collections',
      bongs: 'Websites',
      vapes: 'Settings',
      liquids: 'Layouts',
      hardCandies: 'People',
      preRolls: 'Workflows',
      jello: 'Restricted',
    },
    indica: 'Operations',
    sativa: 'Design',
    hybrid: 'Engineering',
    cbd: 'Support',
    cards: 'Cards',
    cardsHint: 'Reusable section, information, metric, and status surfaces.',
    standardCard: 'Standard Section Card',
    sectionCard: 'SectionCardView',
    compactCard: 'Compact Information Card',
    statCard: 'Stat Card',
    statusCard: 'Status Card',
    basicDetails: 'Basic Details',
    basicDetailsHint: 'Enter the essential information about your product.',
    productInformation: 'Product Information',
    productInformationHint:
      'Manage core details, classification, and merchandising for this product.',
    category: 'Category',
    totalProducts: 'Total Products',
    sampleTotal: '1,248',
    sampleChange: '12%',
    productLiveHint: 'Product is live in the catalog.',
    productInactiveHint: 'Product is hidden from the catalog.',
    formSections: 'Form Sections',
    formSectionsHint: 'A shared heading and layout for every form section.',
    classification: 'Classification',
    classificationHint: 'Assign the category and subcategory for this product.',
    merchandising: 'Merchandising',
    merchandisingHint: 'Set availability and other merchandising details.',
    paymentDetails: 'Payment Details',
    paymentDetailsHint: 'Enter payment and billing information.',
    feedback: 'Feedback / System States',
    feedbackHint: 'Messages, overlays, and validation.',
    emptyStates: 'Empty States',
    emptyStatesHint:
      'Dotted outline cards fill empty sections. Embedded states share their existing surface.',
    emptyStandalone: 'Standalone Section',
    emptyWithAction: 'With An Action',
    emptyEmbedded: 'Inside An Existing Surface',
    successTitle: 'Product Created Successfully',
    successHint: 'Your product has been added to the catalog.',
    warningTitle: 'Please Review Your Information',
    warningHint: 'Some fields need attention before you can continue.',
    errorTitle: 'There Was A Problem Creating Your Product',
    errorDescription: 'Please try again or contact support.',
    infoTitle: 'Featured Across Catalogs',
    infoHint: 'This product appears first in compatible product catalogs.',
    dismissMessage: (title: string) => `Dismiss: ${title}`,
    restoreMessages: 'Restore Messages',
    tooltip: 'Tooltip',
    tooltipHint: 'Show this product first in compatible catalogs.',
    popover: 'More Information',
    emptyTitle: 'No Products Yet',
    emptyHint: 'Get started by creating your first product.',
    toast: 'Preview Toast',
    alert: 'Preview Dialog',
    sheet: 'Preview Sheet',
    sheetTitle: 'Product Details',
    sheetHint: 'A shared sheet keeps secondary information within reach.',
    sheetContentHint: 'Use Escape or Close to return to the component library.',
    close: 'Close',
    table: 'Table / List Preview',
    tableHint: 'Shared components together in a responsive list.',
    tableCaption: 'Records',
    productTableCaption: 'Example Products',
    selectProduct: (name: string) => `Select ${name}`,
    selectAll: 'Select All Products',
    productColumn: 'Product Name',
    skuColumn: 'SKU',
    price: 'Price',
    stock: 'Stock',
    updated: 'Updated',
    actions: 'Actions',
    samplePrice: '$45.00',
    sampleStock: '128',
    sampleDate: 'Feb 14, 2026',
    productActions: 'Product Actions',
    selectedCount: (count: number) =>
      `${count} ${count === 1 ? 'Product' : 'Products'} Selected`,
  },
  pageLayout: {
    formActions: 'Form Actions',
    version: (value: number) =>
      `Version ${new Intl.NumberFormat('en-US').format(value)}`,
    breadcrumbs: 'Breadcrumbs',
    catalogTemplates: 'Catalog Templates',
  },
  address: {
    current: 'Current Step',
    ready: 'Ready',
    notSaved: 'Not Completed',
    chooseCountry: 'Choose A Country',
    chooseRegion: 'Choose A State / Province',
    noRegions: 'No State / Province Required',
    countryOption: (name: string, code: string) => `${name} (${code})`,
    chooseTimezone: 'Choose A Timezone',
    timezoneOption: (label: string | undefined, code: string) =>
      label ? `${label} — ${code}` : code.replaceAll('_', ' '),
    savedTimezone: (value: string) => `Saved Timezone (${value})`,
    timezones: {
      eastern: 'Eastern Time',
      central: 'Central Time',
      mountain: 'Mountain Time',
      arizona: 'Arizona Time',
      pacific: 'Pacific Time',
      alaska: 'Alaska Time',
      hawaii: 'Hawaii Time',
      atlantic: 'Atlantic Time',
      newfoundland: 'Newfoundland Time',
      mexico: 'Mexico — Central Time',
      uk: 'United Kingdom Time',
      westernEurope: 'Western European Time',
      centralEurope: 'Central European Time',
      easternEurope: 'Eastern European Time',
      utc: 'Coordinated Universal Time (UTC)',
    },
  },
  directory: {
    status: 'Status',
    firstPage: 'First Page',
    previousPage: 'Previous',
    nextPage: 'Next',
  },
  directoryCopy: {
    categoryRange: (from: number, to: number) =>
      `Showing Categories ${from}–${to}`,
  },
  media: {
    emptyHint: 'No images have been saved for this product.',
    previewUnavailableHint:
      'This image could not be retrieved. Try loading it again.',
  },
  mediaEditor: {
    preview: (name: string) => `Preview ${name}`,
    imageDetailsDescription: 'View the full image and its details.',
    previewFailedHint:
      'This image cannot be previewed. Remove it and choose a valid image file.',
    close: 'Close Preview',
  },
  pushPreview: {
    pushAppName: 'Portal',
    pushNowData: 'now',
    dismissPush: 'Dismiss Push Preview',
  },
  schedule: {
    editDay: (day: string) => `Edit ${day} Hours`,
    editHours: 'Edit',
    doneEditing: 'Done',
    reviewDay: 'Review',
    incompleteHours: 'Set Opening & Closing Times',
    overnightHoursHint: 'Closes the following day.',
    hoursRange: (opens: string, closes: string, overnight: boolean) =>
      `${opens} – ${closes}${overnight ? ' (Next Day)' : ''}`,
    copyHours: 'Copy To Other Days',
    copyFromDay: (day: string) => `Use ${day} Hours On…`,
    copyHoursHint:
      'Replaces the selected days in your draft. Save Hours to publish the changes.',
    applyHours: (count: number) =>
      count
        ? `Apply To ${count} ${count === 1 ? 'Day' : 'Days'}`
        : 'Choose Days',
    hoursCopiedHint: (source: string, days: string[]) =>
      `${source} hours copied to ${days.join(', ')}. Save Hours to publish.`,
    hoursLimitHint: 'Use 100 weekly time windows or fewer.',
    closed: 'Closed',
    opens: 'Opens',
    closes: 'Closes',
    removeWindow: 'Remove Window',
  },
  scheduleEditor: {
    invalidTimeHint:
      'Choose a valid local date and time. This time may be skipped by a daylight-saving change.',
    repeatedTimeHint:
      'This time occurs twice when the clocks change. Choose which one to use.',
    occurrence: (first: boolean, time: string) =>
      `${first ? 'First' : 'Second'} Occurrence · ${time}`,
  },
  markdownEditor: {
    view: 'Markdown Editor View',
    write: 'Write',
    preview: 'Preview',
    split: 'Split',
    source: 'Markdown Source',
    toolbar: 'Markdown Formatting',
    heading: 'Headings',
    formatting: 'Text Formatting',
    lists: 'Lists & Quotes',
    inserts: 'Insert',
    undo: 'Undo',
    redo: 'Redo',
    guide: 'Markdown Guide',
    emptyPreviewHint: 'Start writing to preview your document here.',
    hint: 'Select text to format it, or write Markdown directly. Use ⌘ / Ctrl + B for bold, I for italic, K for links and Z to undo. Changes are saved only when you save the draft.',
    characters: (count: number, limit: number) =>
      `${new Intl.NumberFormat('en-US').format(count)} / ${new Intl.NumberFormat('en-US').format(limit)} Characters`,
    limitReachedHint: (limit: number) =>
      `This formatting would exceed the ${new Intl.NumberFormat('en-US').format(limit)} character limit. Shorten the content first.`,
    tableRegion: 'Markdown Table',
    footnotes: 'Footnotes',
    footnoteBackLabel: (index: number) =>
      `Back To Footnote Reference ${index + 1}`,
    imageReference: (alt: string) =>
      alt ? `Open Image: ${alt}` : 'Open Image Reference',
    sampleText: 'Selected text',
    sampleLink: 'Link text',
    sampleUrl: 'https://example.com',
    sampleCode: 'code',
    sampleFootnote: 'Footnote text',
    sampleTable:
      '| Heading | Heading |\n| --- | --- |\n| Content | Content |\n| Content | Content |',
    actions: {
      bold: 'Bold',
      italic: 'Italic',
      strike: 'Strikethrough',
      link: 'Link',
      bullet: 'Bullet List',
      numbered: 'Numbered List',
      task: 'Checklist',
      quote: 'Quote',
      inlineCode: 'Inline Code',
      codeBlock: 'Code Block',
      table: 'Table',
      divider: 'Divider',
      footnote: 'Footnote',
      heading1: 'Heading 1',
      heading2: 'Heading 2',
      heading3: 'Heading 3',
    },
    syntax: [
      {
        label: 'Headings',
        example: '# Heading 1\n## Heading 2\n### Heading 3',
      },
      { label: 'Emphasis', example: '**bold** · *italic* · ~~strikethrough~~' },
      {
        label: 'Lists',
        example: '- Bullet item\n1. Numbered item\n- [ ] Checklist item',
      },
      { label: 'Links', example: '[Link text](https://example.com)' },
      { label: 'Quotes & Dividers', example: '> Quoted text\n\n---' },
      { label: 'Code', example: '`inline code`\n\n```\ncode block\n```' },
      {
        label: 'Tables',
        example: '| Heading | Heading |\n| --- | --- |\n| Content | Content |',
      },
      {
        label: 'Footnotes',
        example: 'Text with a note[^1]\n\n[^1]: Footnote text',
      },
    ],
  },

  // Assistant
  assistantMessages: {
    name: 'Assistant',
    you: 'You',
    title: 'Create With Assistant',
    description: 'Describe your changes, then review the suggested values.',
    conversation: 'Draft Conversation',
    hello:
      'Describe what you want to change. Review suggestions before applying them.',
    guidance:
      'Include the details you know. Review the suggestions and choose which fields to apply. Missing values stay yours to complete.',
    input: 'Describe Your Changes',
    placeholder: 'Rename the project and update its description…',
    inputHint:
      'Edit or add to your description before sending. Enter sends; Shift + Enter adds a line. Only your text and draft details are sent. Save the form separately to keep your changes.',
    speak: 'Speak To Assistant',
    send: 'Send Details',
    thinking: 'Preparing Suggestions…',
    ready:
      'Review the suggested values. Apply the fields you want, or keep editing manually.',
    needMore: 'Add more details, then generate suggestions again.',
    preview: 'Suggested Values',
    previewHint:
      'Edit suggestions or turn off fields you want to leave unchanged. Applying fills your draft. Save changes separately.',
    accept: 'Apply Selected Fields',
    decline: 'Keep Current Draft',
    missing: 'Still Needed',
    notes: 'Review Notes',
    invalidValueHint: 'Check this value before accepting, or turn this field off.',
    rateLimited:
      'Assistant is temporarily busy. Wait a moment, then send your details again.',
  },
  draftAssistant: {
    voice: 'Voice Dictation',
    voiceHint:
      'Speak into your microphone. Only the editable transcript and draft context are passed to the configured assistant service.',
    startDictation: 'Start Dictation',
    stopDictation: 'Stop Listening',
    cancelDictation: 'Cancel Dictation',
    typedInputHint:
      'Typed input available. Voice dictation is not supported in this browser.',
    transcriptHint:
      'Review and edit this text before generating. Nothing is saved automatically.',
    starting: 'Starting Dictation…',
    listeningHint: 'Listening. Speak naturally.',
    finishing: 'Finishing Transcript…',
    unsupportedHint:
      'Voice dictation is not supported in this browser. You can still type.',
    blockedHint: 'Microphone access was blocked. You can still type.',
    stoppedHint:
      'Voice dictation stopped unexpectedly. Your text is still available.',
    couldNotStartHint: 'Voice dictation could not start. You can still type.',
    generate: 'Generate Suggestions',
    reviewHint:
      'Review the transcript and edit any suggested values. Select only the fields you want to apply; saving the form remains a separate step.',
    transcript: 'Transcript',
    noSuggestionsHint:
      'No supported field suggestions were found. The transcript can still be reviewed.',
    changedHint:
      'Draft fields changed. Generate again before applying suggestions.',
    apply: 'Apply Selected Fields',
    discard: 'Discard Suggestions',
    failedHint:
      'Assistance could not complete. Your form is unchanged; try again when the service is available.',
  },
  floatingAssistant: {
    open: 'Create With AI',
    description:
      'Choose how AI can help. Review every suggestion before adding it to your draft.',
    close: 'Close AI Assistant',
  },

  // Legacy Chat And Realtime
  chat: {
    title: 'Chat',
    description: 'A shared workspace conversation.',
    placeholder: 'Write a message…',
    send: 'Send Message',
    sending: 'Sending…',
    emptyHint: 'No messages yet. Start the conversation.',
    failedHint: 'Your message was not sent. Please try again.',
    demo: 'Demo Conversation',
    connected: 'Connected',
    connecting: 'Connecting…',
    offline: 'Live Updates Unavailable',
    simulate: 'Simulate Alert',
    simulatedTitle: 'Demo Alert',
    simulatedBody: 'Your workspace is up to date.',
    author: 'Portal Team',
    seedHint: 'Welcome to Portal. Use this conversation to try out chat.',
  },

  // Screen And Component Copy
  ui: {
    // Shell And Navigation
    appShell: {
      dashboard: 'Dashboard',
      users: 'Users',
      featureRequests: 'Feature Requests',
      chat: 'Chat',
      text: '↗',
      profile: 'Profile',
      appearance: 'Appearance',
      workspace: 'Workspace',
      portal: 'Portal',
      pages: 'Pages',
      signedInAs: 'Signed In As',
      adminWorkspace: 'Admin Workspace',
      navProducts: 'Products',
      navUsers: 'Users',
      navCategories: 'Categories',
      navigation: 'Portal Navigation',
      openNavigation: 'Open Navigation Menu',
      closeNavigation: 'Close Navigation Menu',
    },
    shellActions: {
      logOut: 'Log Out',
      darkMode: 'Dark Mode',
      switchToLight: 'Switch To Light Mode',
      switchToDark: 'Switch To Dark Mode',
      themeSaveFailedHint: 'Could not save the theme. Try again.',
    },

    // Authentication And Account
    loginScreen: {
      loginFailed: 'Login Failed',
      access: 'Access',
      welcomeBack: 'Welcome Back',
      signInToKeepUpWithYourPeopleRequestsHint:
        'Sign in to keep up with your people, requests, and conversations.',
      needAnAccount: 'Need An Account?',
      createAccount: 'Create Account',
      email: 'Email',
      youCompanyComData: 'you@company.com',
      password: 'Password',
      enterYourPasswordHint: 'Enter your password',
      signingIn: 'Signing In...',
      signIn: 'Sign In',
      sakoExampleComData: 'sako@example.com',
      password123Data: 'password123',
      demoModeIsEnabledSignInWithSakoExample:
        'Demo mode is enabled. Sign in with sako@example.com and password123, or create a demo account.',
    },
    signupScreen: {
      unableToCreateAccount: 'Unable To Create Account',
      onboarding: 'Onboarding',
      createYourWorkspaceAccount: 'Create Your Workspace Account',
      createYourAccountToJoinTheWorkspaceHint:
        'Create your account to join the workspace.',
      alreadyHaveAnAccount: 'Already Have An Account?',
      backToLogin: 'Back To Login',
      firstName: 'First Name',
      sako: 'Sako',
      lastName: 'Last Name',
      hovaguimian: 'Hovaguimian',
      email: 'Email',
      youCompanyComData: 'you@company.com',
      password: 'Password',
      atLeast8CharactersHint: 'At least 8 characters',
      creatingAccount: 'Creating Account...',
      createAccount: 'Create Account',
      demoAccountsAndChangesLastUntilTheDemoServerHint:
        'Demo accounts and changes last until the demo server restarts.',
    },
    sessionClient: {
      unableToEstablishSession: 'Unable To Establish Session',
    },
    profileScreen: {
      yourProfile: 'Your Profile',
      profileUpdated: 'Profile Updated',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date Of Birth',
      savingProfile: 'Saving Profile…',
      saveProfile: 'Save Profile',
    },

    // Dashboard
    dashboardScreen: {
      dateRange: (from: string, to: string) => `${from} – ${to}`,
      githubComData: 'Github.com',
      facebook: 'Facebook',
      googleOrganic: 'Google (Organic)',
      vimeoComData: 'Vimeo.com',
      indiehackersComData: 'Indiehackers.com',
      havingDifficultiesUsingTheProduct:
        'Having Difficulties Using The Product',
      missingFeaturesINeed: 'Missing Features I Need',
      notSatisfiedAboutTheQualityOfTheProduct:
        'Not Satisfied About The Quality Of The Product',
      theProductDoesnTLookAsAdvertised:
        "The Product Doesn't Look As Advertised",
      other: 'Other',
      value17k: '$1.7K',
      direct: ' Direct',
      value24k: '$2.4K',
      indirect: ' Indirect',
      unitedStates: 'United States',
      italy: 'Italy',
      source: 'Source',
      visitors: 'Visitors',
      revenue: 'Revenue',
      sales: 'Sales',
      conversion: 'Conversion',
      breakdown: 'Breakdown',
      reasonForRefunds: 'Reason For Refunds',
      text: '%',
      overview: 'Overview',
      dashboard: 'Dashboard',
      openShowcase: 'Open Showcase',
      reviewYourWorkspaceActivityBrowseRecordsAndManageIncomingHint:
        'Review your workspace activity, browse records, and manage incoming requests.',
      loadingWorkspaceData: 'Loading Workspace Data…',
      workspaceDataUnavailable: 'Workspace Data Unavailable',
      pleaseTryLoadingYourWorkspaceAgainHint:
        'Please try loading your workspace again.',
      newInRange: (count: number) => `${count} New In Range`,
      density: 'Density',
      modelExplorer: 'Model Explorer',
      chooseHowMuchSpaceToUseForEachRecordHint:
        'Choose how much space to use for each record.',
      comfortable: 'Comfortable',
      compact: 'Compact',
      selectedModel: 'Selected Model',
      visibleRecordsInTheCurrentQueryHint: ' visible records in the current query.',
      sampleAnalyticsDemoData: 'Sample analytics · demo data',
      directVsIndirect: 'Direct VS Indirect',
      orderValue: 'Order Value',
      avgOrderValue: 'AVG Order Value',
      current: 'Current',
      previous: 'Previous',
      audience: 'Audience',
      topCountries: 'Top Countries',
      acquisition: 'Acquisition',
      topChannels: 'Top Channels',
      stores: 'Stores',
      salesOverTime: 'Sales Over Time',
      forecast: 'Forecast',
      finance: 'Finance',
      salesVsRefunds: 'Sales VS Refunds',
      records: 'Records',
      primaryDataTable: 'Primary Data Table',
      rows: ' Rows',
      noRecordsAvailableHint: 'No records available.',
      registry: 'Registry',
      registeredModels: 'Registered Models',
      recordsAvailableForOperationalViewsHint:
        'Records available for operational views.',
      dec20: 'Dec 20',
      jan21: 'Jan 21',
      feb21: 'Feb 21',
      mar21: 'Mar 21',
      apr21: 'Apr 21',
      may21: 'May 21',
      value24k2: '2.4K',
      value3877: '$3,877',
      value267: '267',
      value47: '4.7%',
      value22k: '2.2K',
      value3426: '$3,426',
      value249: '249',
      value44: '4.4%',
      value20k: '2.0K',
      value2444: '$2,444',
      value224: '224',
      value42: '4.2%',
      value19k: '1.9K',
      value2236: '$2,236',
      value220: '220',
      value17k2: '1.7K',
      value2034: '$2,034',
      value204: '204',
      value39: '3.9%',
      value17k3: '$1.7K',
      value72: '$72',
      value34: '+34%',
      value1482: '1,482',
      value22: '-22%',
      value6796: '+$6,796',
      value342: '-34%',
    },

    // Feature Requests
    featureRequestsScreen: {
      intake: 'Intake',
      featureRequestQueue: 'Feature Request Queue',
      shareIdeasForImprovingYourWorkspaceAndFollowYourHint:
        'Share ideas for improving your workspace and follow your requests below.',
      newFeatureRequest: 'New Feature Request',
      describeTheWorkflowGapOrIdeaHint: 'Describe the workflow gap or idea',
      createRequest: 'Create Request',
      loadingFeatureRequests: 'Loading Feature Requests...',
      featureRequestsUnavailable: 'Feature Requests Unavailable',
      weCouldNotLoadTheRequestQueueHint: 'We could not load the request queue.',
      noRequestsYet: 'No Requests Yet',
      createTheFirstFeatureRequestToSeedTheWorkflowHint:
        'Create the first feature request to seed the workflow.',
      message: 'Message',
      updated: 'Updated',
    },
    featureRequestDetailScreen: {
      loadingFeatureRequest: 'Loading Feature Request...',
      featureRequestUnavailable: 'Feature Request Unavailable',
      weCouldNotLoadThisRequestHint: 'We could not load this request.',
      missingFeatureRequest: 'Missing Feature Request',
      thisFeatureRequestCouldNotBeFoundHint:
        'This feature request could not be found.',
      requestDetail: 'Request Detail',
      featureRequestDetail: 'Feature Request Detail',
      requestUpdated: 'Request Updated',
      message: 'Message',
      saveChanges: 'Save Changes',
      deleteThisRequest: 'Delete This Request?',
      thisRequestWillBeRemovedFromYourQueueHint:
        'This request will be removed from your queue.',
      deleteRequest: 'Delete Request',
      keepRequest: 'Keep Request',
    },

    // User Directory
    usersScreen: {
      loadingUsers: 'Loading Users...',
      usersUnavailable: 'Users Unavailable',
      weCouldNotLoadUsersRightNowHint: 'We could not load users right now.',
      noUsersFound: 'No Users Found',
      tryADifferentSearchHint: 'Try a different search.',
      directory: 'Directory',
      userRecords: 'User Records',
      findPeopleInYourWorkspaceAndViewTheirProfilesHint:
        'Find people in your workspace and view their profiles.',
      name: 'Name',
      email: 'Email',
      created: 'Created',
    },
    userDetailScreen: {
      loadingUserProfile: 'Loading User Profile...',
      userUnavailable: 'User Unavailable',
      weCouldNotLoadThisUserProfileHint: 'We could not load this user profile.',
      missingUser: 'Missing User',
      thisUserRecordCouldNotBeFoundHint: 'This user record could not be found.',
      userDetail: 'User Detail',
      email: 'Email:',
      externalId: 'External ID:',
      created: 'Created:',
    },

    // Appearance And Experience
    appearanceScreen: {
      appearance: 'Appearance',
      tuneLightDarkAndAccentBehaviorFromOneTokenHint:
        'Choose a complete theme and switch between its light and dark modes.',
      neutralGraysAndWhitesCarryTheLayoutWhileTheHint:
        'Neutral grays and whites carry the layout, while the theme’s action color stays concentrated in active states, badges, and key actions.',
      light: 'Light',
      brightShellBackgroundWhiteCardsAndSoftGraySeparatorsHint:
        'Bright shell background, white cards, and soft-gray separators.',
      dark: 'Dark',
      deepSlateShellElevatedPanelsAndRestrainedContrastThatHint:
        'Deep slate shell, elevated panels, and restrained contrast that still reads clearly.',
      activeAccent: 'Active Accent',
      setAccent: 'Set Accent',
    },
    experienceScreen: {
      overview: 'Overview',
      system: 'System',
      workflow: 'Workflow',
      showcase: 'Showcase',
      motion: 'Motion',
      contact: 'Contact',
      faq: 'FAQ',
      dashboardFirstSurfaces: 'Dashboard-First Surfaces',
      cardsListsFormsAndSideNavigationAllUseTheHint:
        'Cards, lists, forms, and side navigation all use the same flatter treatment so the app feels cohesive instead of mixing visual languages.',
      accentColorAsSupport: 'Accent Color As Support',
      selectedThemeColorsHighlightActiveStatesPillsAndKeyHint:
        'Selected theme colors highlight active states, pills, and key actions while neutral grays and whites carry most of the layout.',
      darkModeThatStaysReadable: 'Dark Mode That Stays Readable',
      theDarkThemeUsesLayeredSlatePanelsAndRestrainedHint:
        'The dark theme uses layered slate panels and restrained contrast instead of glossy black surfaces and heavy blur.',
      overlayControlsPreserved: 'Overlay Controls Preserved',
      toastsAlertsAndSheetsStillRunThroughOnePresentationHint:
        'Toasts, alerts, and sheets still run through one presentation service, but now inherit the same flat dashboard styling.',
      selectedTheme: 'Selected Theme',
      accentAware: 'Accent Aware',
      surfaceLanguage: 'Surface Language',
      flatPanels: 'Flat Panels',
      navigationStyle: 'Navigation Style',
      dashboardShell: 'Dashboard Shell',
      canWeStillLaunchHeroOnly: 'Can We Still Launch Hero-Only?',
      yesThisShowcaseRouteIsOptionalAndCanStayHint:
        'Yes. This showcase route is optional and can stay separate from the protected shell.',
      canWeKeepAuthOptional: 'Can We Keep Auth Optional?',
      yesTheVisualRestyleDoesNotChangeTheScaffoldHint:
        'Yes. The visual restyle does not change the scaffold-time auth decisions.',
      canTheSelectedAccentStaySubtle: 'Can The Selected Accent Stay Subtle?',
      yesTheNewSystemDeliberatelyLimitsAccentUsageToHint:
        'Yes. The new system deliberately limits accent usage to active states and emphasis points.',
      areTheChartsRealYet: 'Are The Charts Real Yet?',
      theAnalyticsWidgetsInTheRedesignedDashboardUseMockHint:
        'The analytics widgets in the redesigned dashboard use mock data for now while the existing records and registry panels still use live app data.',
      doesDarkModeKeepTheSameStructure:
        'Does Dark Mode Keep The Same Structure?',
      yesTheSameCardAndShellHierarchyCarriesThroughHint:
        'Yes. The same card and shell hierarchy carries through; only the tonal palette changes.',
      canWeSwapTheThemePerUser: 'Can We Swap The Theme Per User?',
      yesThemeChoiceLivesInAppearancePreferencesHint:
        'Yes. Choose a complete theme in Appearance. Its colors, type, corners, shadows, and spacing apply throughout the workspace.',
      willFormControlsMatchTheDashboard:
        'Will Form Controls Match The Dashboard?',
      yesInputsButtonsTabsAndOverlaysNowInheritTheHint:
        'Yes. Inputs, buttons, tabs, and overlays now inherit the same flatter styling rules.',
      areTheSideNavigationItemsReusable:
        'Are The Side Navigation Items Reusable?',
      yesTheSidebarIsStillDrivenFromOneSharedHint:
        'Yes. The sidebar is still driven from one shared shell component and can be extended centrally.',
      canWeAddMoreDashboardWidgetsLater:
        'Can We Add More Dashboard Widgets Later?',
      yesTheCurrentMockedCardsAreIntentionallyBuiltFromHint:
        'Yes. The current mocked cards are intentionally built from simple primitives so we can swap in real charts incrementally.',
      willRecordsAndRegistryStayInTheDashboard:
        'Will Records And Registry Stay In The Dashboard?',
      yesThoseExistingOperationalPanelsRemainInPlaceAndHint:
        'Yes. Those existing operational panels remain in place and now sit beneath the mocked analytics surface.',
      doOverlayAnimationsStillWork: 'Do Overlay Animations Still Work?',
      yesAlertToastAndSheetTimingControlsAreUntouchedHint:
        'Yes. Alert, toast, and sheet timing controls are untouched and still configurable through the presentation service.',
      canTheFooterBeBrandSpecific: 'Can The Footer Be Brand-Specific?',
      yesTheFullWidthFooterIsJustContentAndHint:
        'Yes. The full-width footer is just content and layout, so we can tailor links and messaging easily.',
      willTheAuthPagesKeepThisStyle: 'Will The Auth Pages Keep This Style?',
      yesLoginAndSignupNowUseTheSameFlatterHint:
        'Yes. Login and signup now use the same flatter card and accent treatment as the protected app.',
      canWeTurnSomeSectionsOff: 'Can We Turn Some Sections Off?',
      yesTheShowcaseRouteIsModularAndSectionsCanHint:
        'Yes. The showcase route is modular and sections can be removed without affecting the rest of the application shell.',
      isThisMeantToReplaceTheOldGlossyLook:
        'Is This Meant To Replace The Old Glossy Look Entirely?',
      yesTheGoalOfThisPassIsToMoveHint:
        'Yes. The goal of this pass is to move the whole project to a more credible flat dashboard aesthetic.',
      dashboardSurfacePreset: 'Dashboard Surface Preset',
      primaryCardsMutedPanelsAndFlatterDataRowsStayHint:
        'Primary cards, muted panels, and flatter data rows stay aligned from shell to detail pages.',
      looksGood: 'Looks Good',
      close: 'Close',
      accentUsageGuardrails: 'Accent Usage Guardrails',
      useTheSelectedAccentForActiveStatesChipsAndHint:
        'Use the theme’s action color for active states, chips, and primary actions.',
      keepLargeBackgroundsMostlyNeutralHint:
        'Keep large backgrounds mostly neutral.',
      letBrandColorShowUpInNavigationStateTagsHint:
        'Let brand color show up in navigation state, tags, and emphasis.',
      darkModeNotes: 'Dark Mode Notes',
      layeredSlateSurfacesReplaceThePreviousGlossyLookHint:
        'Layered slate surfaces replace the previous glossy look.',
      cardsStayLiftedThroughBordersAndPanelContrastNotHint:
        'Cards stay lifted through borders and panel contrast, not blur.',
      textHierarchyStaysConsistentBetweenLightAndDarkThemesHint:
        'Text hierarchy stays consistent between light and dark themes.',
      presentationStylingUpdated: 'Presentation Styling Updated',
      toastsAlertsAndSheetsNowInheritTheSameFlatterHint:
        'Toasts, alerts, and sheets now inherit the same flatter chrome as the rest of the app.',
      great: 'Great',
      dashboardStylingPreview: 'Dashboard Styling Preview',
      backToDashboard: 'Back To Dashboard',
      restyledSystem: 'Restyled System',
      fromGlossyPrototypeToACalmerDashboardProductSurface:
        'From Glossy Prototype To A Calmer Dashboard Product Surface.',
      thisRouteShowsTheNewDirectionAcrossHeroContentHint:
        'This route shows the new direction across hero content, operational panels, accent behavior, and overlay styling without drifting away from the existing application architecture.',
      flatCardLanguage: 'Flat Card Language',
      layeredDarkMode: 'Layered Dark Mode',
      sharedSystemTokens: 'Shared System Tokens',
      enterPortal: 'Enter Portal',
      exploreTheSystem: 'Explore The System',
      previewSurface: 'Preview Surface',
      liveDashboardMock: 'Live Dashboard Mock',
      active: 'Active',
      conversion: 'Conversion',
      tickets: 'Tickets',
      retention: 'Retention',
      trafficOverview: 'Traffic Overview',
      last7Days: 'Last 7 Days',
      systemDirection: 'System Direction',
      aFlatDashboardLanguageLayeredOnTopOfArchitecture:
        'A Flat Dashboard Language Layered On Top Of Architecture-Safe Defaults.',
      theRestyleKeepsYourAppStructureDataContractsAndHint:
        'The restyle keeps your app structure, data contracts, and interaction model intact while giving the whole product a more credible admin UI feel.',
      value0: '0',
      openPreview: 'Open Preview',
      theVisualUpdateStillRespectsTheSystemUnderneath:
        'The Visual Update Still Respects The System Underneath.',
      routesStayThinServicesKeepOrchestrationAndPresentationFlowsHint:
        'Routes stay thin, services keep orchestration, and presentation flows remain centralized. The redesign focuses on the product layer, not the ownership model.',
      themeChoicePropagatesThroughOneSemanticTokenLayerHint:
        'Theme choice propagates through one semantic token layer.',
      sharedUiPrimitivesKeepDetailPagesAlignedAutomaticallyHint:
        'Shared UI primitives keep detail pages aligned automatically.',
      whatChanged: 'What Changed',
      surfaces: 'Surfaces',
      reducedBlurRemovedGlossyCardsAndStandardizedWhiteOrHint:
        'Reduced blur, removed glossy cards, and standardized white or slate panels.',
      navigation: 'Navigation',
      sidebarAndTopChromeNowMatchTheFlatterDashboardHint:
        'Sidebar and top chrome now match the flatter dashboard reference instead of a floating glass shell.',
      darkMode: 'Dark Mode',
      panelsStayDistinctThroughLayeringBordersAndShadowRestraintHint:
        'Panels stay distinct through layering, borders, and shadow restraint.',
      theSameDesignLanguageScalesFromHeroSectionsTo:
        'The Same Design Language Scales From Hero Sections To Operational Widgets.',
      dashboardPreview: 'Dashboard Preview',
      neutralCanvasSelectiveAccent: 'Neutral Canvas, Selective Accent',
      preview: 'Preview',
      revenueMix: 'Revenue Mix',
      topChannels: 'Top Channels',
      product: 'Product',
      support: 'Support',
      growth: 'Growth',
      text: '%',
      recentActivity: 'Recent Activity',
      sidebarChromeUpdatedToFlatterCardTreatmentHint:
        'Sidebar chrome updated to flatter card treatment.',
      tablesNowUseSofterRowHoverAndCleanerSeparatorsHint:
        'Tables now use softer row hover and cleaner separators.',
      themeAccentsDriveSelectedStateWithoutFloodingSurfacesHint:
        'Theme accents drive selected state without flooding surfaces.',
      activeStateNowLivesInNavigationPillsAndPrimaryHint:
        'Active state now lives in navigation, pills, and primary controls.',
      cardsRelyOnBorderContrastAndSpacingMoreThanHint:
        'Cards rely on border contrast and spacing more than drop shadows.',
      theDarkPaletteUsesSlateLayersInsteadOfGlossyHint:
        'The dark palette uses slate layers instead of glossy charcoal glow.',
      featurePagesInheritTheNewSystemThroughSharedPrimitivesHint:
        'Feature pages inherit the new system through shared primitives.',
      presentationMotion: 'Presentation Motion',
      motionIsStillConfigurableButTheChromeAroundIt:
        'Motion Is Still Configurable, But The Chrome Around It Is Cleaner.',
      useTheSameControlsAsBeforeToChangeToastHint:
        'Use the same controls as before to change toast, alert, and sheet timing while previewing the updated flat styling.',
      fastMotionPreset: 'Fast Motion Preset',
      presentationOverlaysNowAnimateAtASnappierPaceHint:
        'Presentation overlays now animate at a snappier pace.',
      fast: 'Fast',
      relaxedMotionPreset: 'Relaxed Motion Preset',
      transitionsNowRunWithSlowerTimingForACalmerHint:
        'Transitions now run with slower timing for a calmer feel.',
      relaxed: 'Relaxed',
      motionDisabled: 'Motion Disabled',
      allPresentationAnimationsAreNowTurnedOffHint:
        'All presentation animations are now turned off.',
      disableMotion: 'Disable Motion',
      defaultMotionRestored: 'Default Motion Restored',
      toastAlertAndSheetTimingsAreBackToDefaultHint:
        'Toast, alert, and sheet timings are back to default.',
      done: 'Done',
      dismiss: 'Dismiss',
      resetDefaults: 'Reset Defaults',
      mockHandoffDetailsInTheSameDashboardVisualSystem:
        'Mock Handoff Details In The Same Dashboard Visual System.',
      contactDetails: 'Contact Details',
      ariBennett: 'Ari Bennett',
      founderSemanticStudio: 'Founder, Semantic Studio',
      supportSemanticstudioDevData: 'support@semanticstudio.dev',
      value14155550199: '+1 (415) 555-0199',
      officeHours: 'Office Hours',
      monThu900Am600PmPt: 'Mon-Thu: 9:00 AM - 6:00 PM PT',
      fri900Am300PmPt: 'Fri: 9:00 AM - 3:00 PM PT',
      responseSlaUnder1BusinessDay: 'Response SLA: Under 1 Business Day',
      mockAddress: 'Mock Address',
      value410MarketStreet: '410 Market Street',
      sanFranciscoCa: 'San Francisco, CA',
      builtForFrontendBackendSemanticParityHint:
        'Built for frontend/backend semantic parity.',
      portalTemplate: 'Portal Template',
      operationalSoftwareImmersiveRoutesAndFrontendArchitectureThatStayHint:
        'Operational software, immersive routes, and frontend architecture that stay aligned while the product surface looks more like a polished dashboard.',
      pricing: 'Pricing',
      roadmap: 'Roadmap',
      changelog: 'Changelog',
      solutions: 'Solutions',
      clinicSites: 'Clinic Sites',
      providerPortals: 'Provider Portals',
      operationsHub: 'Operations Hub',
      educationPages: 'Education Pages',
      resources: 'Resources',
      guides: 'Guides',
      apiDocs: 'API Docs',
      playbooks: 'Playbooks',
      company: 'Company',
      about: 'About',
      careers: 'Careers',
      terms: 'Terms',
      privacy: 'Privacy',
      accentAwareStates: 'Accent-Aware States',
      promptFirstSetupStillDrivesShellAndRouteDecisionsHint:
        'Prompt-first setup still drives shell and route decisions.',
    },

    // Shared Components And Feedback
    stepper: {
      horizontal: 'Horizontal',
      vertical: 'Vertical',
      accessibleLabelHint: (
        label: string,
        state: string,
        position: number,
        count: number,
      ) => `${label}. ${state}. Step ${position} of ${count}.`,
    },
    alertModal: {
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    metricCard: {
      live: 'Live',
    },
    queryBoundary: {
      error: 'Error',
      somethingWentWrong: 'Something Went Wrong',
      tryAgain: 'Try Again',
      youNeedToBeLoggedInToViewThisHint:
        'You need to be logged in to view this content.',
      youDoNotHavePermissionToAccessThisResourceHint:
        'You do not have permission to access this resource.',
      theRequestedResourceCouldNotBeFoundHint:
        'The requested resource could not be found.',
      anUnexpectedErrorOccurredHint: 'An unexpected error occurred.',
    },
    sheetPanel: {
      dismissSheet: 'Dismiss Sheet',
      continue: 'Continue',
      close: 'Close',
    },
    states: {
      empty: 'Empty',
      error: 'Error',
      retry: 'Retry',
    },
    toastStack: {
      dismissToast: (title: string) => `Dismiss ${title} Toast`,
      text: '×',
    },
    presentationProvider: {
      presentationServiceNotAvailable: 'Presentation Service Not Available',
    },
    dataTable: { sortColumns: 'Sort Columns' },
    modal: { close: 'Close Dialog' },
    colorInput: {
      choose: 'Choose Color',
      saturationBrightness: 'Saturation & Brightness',
      hue: 'Hue',
      done: 'Done',
    },

    // Errors And Browser Services
    error: {
      applicationError: 'Application Error',
      thisPageCouldNotBeLoadedPleaseTryAgainHint:
        'This page could not be loaded. Please try again.',
    },
    domainErrors: {
      apiRequestFailed: 'API Request Failed',
      authenticationRequired: 'Authentication Required',
      validationFailed: 'Validation Failed',
      youDoNotHavePermissionToPerformThisActionHint:
        'You do not have permission to perform this action',
      resourceNotFound: 'Resource Not Found',
      unknownApplicationError: 'Unknown Application Error',
    },
    errorHandling: {
      unexpectedNonErrorThrown: 'Unexpected Non-Error Thrown',
    },
    webNotificationService: {
      notification: 'Notification',
    },

    // Demo API And Fixtures
    demoApiClient: {
      users: 'Users',
      featureRequests: 'Feature Requests',
    },
    demoFixtures: {
      sako: 'Sako',
      template: 'Template',
      ada: 'Ada',
      operator: 'Operator',
      mina: 'Mina',
      signals: 'Signals',
      addSemanticDashboardSavedViewsWithSharableFiltersHint:
        'Add semantic dashboard saved views with sharable filters.',
      exposeFeatureRequestOwnershipHistoryForAuditTrailsHint:
        'Expose feature request ownership history for audit trails.',
      supportCompactTableModeWithPinnedColumnsHint:
        'Support compact table mode with pinned columns.',
      users: 'Users',
      featureRequests: 'Feature Requests',
      dashboardViews: 'Dashboard Views',
      user: 'User',
      id: 'ID',
      email: 'Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      featureRequest: 'Feature Request',
      userId: 'User ID',
      message: 'Message',
      createdAt: 'Created At',
      sakoExampleComData: 'sako@example.com',
      value15551110001: '+1 555 111 0001',
      adaExampleComData: 'ada@example.com',
      value15551110002: '+1 555 111 0002',
      minaExampleComData: 'mina@example.com',
    },
    demoState: {
      password123Data: 'password123',
    },
  },

  // Sample Content
  sampleFields: {
    name: 'Name',
  },
  sampleCatalog: {
    categories: 'Categories',
  },
} as const;

export const labels = {
  tones: {
    neutral: 'Notice',
    info: 'Information',
    success: 'Success',
    warning: 'Warning',
    danger: 'Delete',
  },
  sides: {
    left: 'Left Panel',
    right: 'Right Panel',
    top: 'Top Panel',
    bottom: 'Bottom Panel',
  },
} as const;

export const portalActionStrings = {
  cancel: 'Cancel',
  close: 'Close',
  clearSearch: 'Clear Search',
  clearFilters: 'Clear Filters',
  saveChanges: 'Save Changes',
  edit: 'Edit',
  delete: 'Delete',
};

export const portalModuleStrings = {
  back: 'Back',
  notifications: 'Notifications',
  publishing: 'Publishing',
  account: 'Account',
  help: 'Help',
  demo: 'Developer Settings',
  saved: 'Saved Content',
  disabledDescription: 'This module is disabled for this project.',
};

export const portalIntegrationStrings = {
  onboardingRequiredDescription:
    'Finish account setup before using your workspace.',
  accountTitle: 'Account',
  accountDescription:
    'Manage your account, registered devices, and support preferences.',
};

export const portalEditStrings = {
  nameTooLongHint: 'Use 80 characters or fewer for each name.',
  invalidDateHint: 'Enter a valid date or clear the date field.',
} as const;

// Account Tools And Help

export const portalAccountToolsStrings = {
  common: {
    accountEyebrow: 'Your Account',
    operationsEyebrow: 'Platform Operations',
    cancelAction: portalActionStrings.cancel,
    closeAction: portalActionStrings.close,
    clearAction: portalActionStrings.clearSearch,
    clearFiltersAction: portalActionStrings.clearFilters,
    refreshAction: 'Refresh',
    saveAction: portalActionStrings.saveChanges,
    editAction: portalActionStrings.edit,
    deleteAction: portalActionStrings.delete,
    actionsColumn: 'Actions',
    createdColumn: 'Created',
    updatedColumn: 'Last Updated',
    statusColumn: 'Status',
    recordsLabel: 'Records',
    loadingTitle: 'Loading Records',
    loadingHint: 'Your records will appear here shortly.',
    noResultsTitle: 'No Matching Records',
    noResultsHint: 'Try a different filter or clear your search.',
    paginationLabel: 'Record Pages',
    rangeLabel: (from: number, to: number) => `Records ${from}–${to}`,
    notRecorded: 'Not Recorded',
    systemUser: 'System',
    activeStatus: 'Active',
    deletedStatus: 'Deleted',
    statusLabel: 'Status',
  },
  account: {
    title: 'Account',
    description: 'Review your sign-in identity and manage account access.',
    identityTitle: 'Your Identity',
    identityHint:
      'Profile changes are available from your profile. Your sign-in email is managed separately.',
    operationsTitle: 'Operational Tools',
    operationsHint:
      'Authorized platform operators can inspect notification delivery history.',
    devicesTitle: 'Devices And Access',
    devicesHint:
      'Manage the devices that receive your notifications and find account support.',
    profileAction: 'Edit Profile',
    devicesAction: 'Manage Devices',
    helpAction: 'Help And Legal Information',
    emailLabel: 'Sign-In Email',
    nameLabel: 'Name',
    formatName: (firstName: string, lastName: string) =>
      `${firstName} ${lastName}`,
    deleteCardTitle: 'Before You Go',
    deleteCardHint:
      'Please review what happens to your account before continuing. You will have a chance to confirm your choice.',
    deleteTitle: 'Delete Account',
    deleteHint:
      `Deleting your account removes access to ${portalProjectStrings.name} and disables your workspace access. This action does not permanently erase stored records or uploaded files. You cannot restore access from this app.`,
    deleteAction: 'Delete My Account',
    confirmationTitle: 'Delete Your Account?',
    confirmationDescription: (email: string) =>
      `You are deleting the account for ${email}. You will be signed out, and this account will no longer be able to access ${portalProjectStrings.name}. Stored records and uploaded files are not permanently erased by this action.`,
    confirmationEmailLabel: 'Type Your Sign-In Email To Confirm',
    confirmationPlaceholder: 'Enter the email shown above',
    confirmationHint:
      'Enter the email exactly as it appears above. Keep this dialog open if you need to retry.',
    confirmationAcknowledgement: 'I Understand The Consequence',
    confirmationAcknowledgementDescription:
      'I understand that this account will lose access and I cannot restore it from this app.',
    confirmationRequiredDescription:
      'Enter your sign-in email and select the confirmation before deleting your account.',
    completedTitle: 'Account Deleted',
    completedDescription: `Your account no longer has access to ${portalProjectStrings.name}.`,
    demoHint:
      'In demo mode this removes only the sample account from this running demo. Resetting demo data restores seeded accounts.',
  },
  devices: {
    title: 'Registered Devices',
    description:
      'Review the devices registered to receive your notifications. Removing a registration stops future push delivery through that registration; it does not sign the device out.',
    searchLabel: 'Search Devices',
    searchPlaceholder: 'Search by device type',
    typeLabel: 'Device Type',
    allTypes: 'All Device Types',
    emptyTitle: 'No Registered Devices',
    emptyHint:
      'Devices appear after you enable push notifications on a supported device.',
    removeAction: 'Remove Device',
    removedTitle: 'Device Removed',
    removeTitle: 'Remove This Device?',
    removeDescription: (type: string, date: string, id: string) =>
      `Remove the ${type} registration ${id}, created ${date}? It will stop receiving push notifications through this registration. The device will remain signed in.`,
    registrationColumn: 'Registration',
    registeredColumn: 'Registered',
    types: { iOS: 'iOS', Android: 'Android', Web: 'Web' },
  },
  deliveries: {
    title: 'Notification Delivery History',
    description:
      'Inspect platform delivery statuses and numbered provider attempts. Accepted means the provider accepted delivery; it does not confirm that a person read the notification.',
    accessHint:
      'Delivery history is limited to authorized platform operators. The live service also verifies the configured operator allowlist.',
    statusLabel: 'Delivery Status',
    allStatuses: 'All Statuses',
    notificationLabel: 'Notification ID',
    notificationPlaceholder: 'Filter by a notification UUID',
    applyAction: 'Apply Filters',
    afterLabel: 'Created On Or After',
    beforeLabel: 'Created On Or Before',
    channelColumn: 'Channel',
    attemptsColumn: 'Attempts',
    notificationColumn: 'Notification',
    nextAttemptLabel: 'Next Attempt',
    acceptedLabel: 'Provider Accepted',
    errorLabel: 'Reported Error',
    skipReasonLabel: 'Skip Reason',
    emptyTitle: 'No Delivery Records',
    emptyHint:
      'Delivery records appear when an external notification is scheduled.',
    inspectAction: 'View Attempts',
    attemptsTitle: 'Delivery Attempts',
    attemptsDescription:
      'Review the recorded outcome of each provider attempt. This view cannot send or retry notifications.',
    attemptLabel: (number: number) => `Attempt ${number}`,
    noAttemptsTitle: 'No Attempts Yet',
    noAttemptsHint: 'This delivery has no recorded provider attempts.',
    startedLabel: 'Started',
    finishedLabel: 'Finished',
    retryableLabel: 'Retryable',
    yesStatus: 'Yes',
    noStatus: 'No',
    channels: { PUSH: 'Push', EMAIL: 'Email' },
    statuses: {
      PENDING: 'Pending',
      PROCESSING: 'Processing',
      ACCEPTED: 'Accepted',
      SKIPPED: 'Skipped',
      FAILED: 'Failed',
      UNKNOWN: 'Unknown',
    },
  },
  help: {
    title: 'Help And Legal Information',
    description:
      'Find answers and read the current terms and privacy information supplied by Portal.',
    faqTab: 'Frequently Asked Questions',
    termsTab: 'Terms Of Service',
    privacyTab: 'Privacy Policy',
    sectionLabel: 'Help Section',
    emptyTitle: 'No Information Available',
    emptyHint:
      'This information has not been provided yet. Try refreshing this page later.',
    illustrativeTitle: 'Illustrative Demo Content',
    illustrativeDescription:
      'These examples explain the demo only. They are not the production terms, privacy policy, or a statement of data-retention commitments.',
  },
  validation: {
    confirmationEmail: 'Enter your sign-in email to confirm this action.',
    emailMismatch: 'The email does not match your signed-in account.',
    context: 'Enter an AI context of 1 to 500 characters.',
    userId: 'Enter a valid user UUID or leave this field blank.',
    tokenCount:
      'Enter a whole-number token count from 0 to 2,147,483,647, or leave it blank.',
    metadataHint: 'Enter a valid JSON object or leave this field blank.',
    error: 'Keep the recorded error within 5,000 characters.',
    notificationId: 'Enter a valid notification UUID or clear this filter.',
    dateRange: 'Choose an end date on or after the start date.',
  },
  demo: {
    skippedReason:
      'Push delivery was skipped because notifications were disabled in this illustrative example.',
    failedErrorHint: 'The provider did not accept this illustrative example.',
    faqTitle: 'Using The Demo',
    faqQuestion: 'Does The Demo Send Notifications Or Run AI Requests?',
    faqAnswer:
      'No. The demo uses local sample records. It does not contact a notification provider or run an AI request.',
    legalTitle: 'About This Legal Information Example',
    legalDescription:
      'This screen demonstrates how legal information supplied by the API is displayed. This sample is not a production legal agreement or privacy policy.',
  },
};

export const portalHelpFaqSections = [
  {
    title: 'Getting Started',
    sections: [
      {
        question: 'How Does The Demo Work?',
        answer:
          'Use a sample account to explore local records. New User starts empty, Populated User has sample activity, and Onboarding restarts the setup flow. Nothing is sent to external services.',
      },
      {
        question: 'Can I Keep My Changes?',
        answer:
          'Demo edits remain in this server process until reset or restart. Use fictional information only. Production persistence belongs to your configured backend.',
      },
    ],
  },
  {
    title: 'Your Workspace',
    sections: [
      {
        question: 'How Do Notification Preferences Work?',
        answer:
          'Choose categories and delivery channels in Notification Settings. Push delivery also requires a separate opt-in for this browser.',
      },
      {
        question: 'How Do I Return To A Previous View?',
        answer:
          'Committed tabs and filters create browser history entries. Use Back to return to the previous view, with its filters intact.',
      },
    ],
  },
];

// Background Jobs

export const portalJobStrings = {
  title: 'Background Jobs',
  eyebrow: 'Work Queue',
  description: 'Start work, follow its progress, and come back to the result. Your jobs continue while you explore the workspace.',
  createAction: 'New Job',
  createTitle: 'Start A Sample Job',
  createDescription: 'These sample jobs produce local example results without sending messages or changing external data.',
  nameLabel: 'Job Name',
  namePlaceholder: 'Name this job',
  typeLabel: 'Job Type',
  reportLabel: 'Workspace Report',
  exportLabel: 'Sample Export',
  failureLabel: 'Fail The First Attempt',
  failureHint: 'Practice recovery with a predictable failure. An explicit retry completes the same job safely.',
  queueAction: 'Add To Queue',
  dismissAction: 'Close',
  searchLabel: 'Search Jobs',
  searchPlaceholder: 'Search by name or job ID',
  clearAction: 'Clear Search',
  statusLabel: 'Status',
  allStatuses: 'All Statuses',
  statuses: { queued: 'Queued', running: 'Running', succeeded: 'Succeeded', failed: 'Failed', canceled: 'Canceled' },
  stages: { queued: 'Waiting In Queue', preparing: 'Preparing', processing: 'Processing', finalizing: 'Finalizing', done: 'Complete', canceled: 'Canceled', failed: 'Stopped' },
  nameColumn: 'Job',
  progressColumn: 'Progress',
  updatedColumn: 'Updated',
  attemptLabel: 'Attempt',
  detailsTitle: 'Job Details',
  resultTitle: 'Result',
  historyTitle: 'Attempt History',
  identifierLabel: 'Job ID',
  createdLabel: 'Created',
  finishedLabel: 'Finished',
  retryAction: 'Retry Job',
  cancelAction: 'Cancel Job',
  cancelTitle: 'Cancel This Job?',
  cancelDescription: 'The queued or running work will stop. Any completed attempt history will remain available.',
  keepAction: 'Keep Running',
  retryHint: 'Retry is explicit and uses the same job. Previous failures remain in the attempt history.',
  retryUnavailableHint: 'This job has no safe retries remaining.',
  canceledHint: 'This job was canceled. Start a new job when you are ready.',
  queuedHint: 'Accepted by the server and waiting for an available worker.',
  workingHint: 'You can leave this page and return to follow the result.',
  succeededHint: 'All stages finished. The result is ready below.',
  emptyTitle: 'Your Queue Is Clear',
  emptyHint: 'Start a sample report or export to see server-managed background work in action.',
  noResultsTitle: 'No Matching Jobs',
  noResultsHint: 'Try a different search or status to find your job.',
  loadingLabel: 'Loading Jobs',
  unavailableTitle: 'Jobs Unavailable',
  unavailableHint: 'We could not load the job queue. Try again to reconnect.',
  detailUnavailableTitle: 'Job Unavailable',
  detailUnavailableHint: 'We could not load this job. Refresh to check its current state.',
  paginationLabel: 'Job Pages',
  queueCaption: 'Your Background Jobs',
  backAction: 'Back To Jobs',
  refreshAction: 'Refresh',
  acceptedTitle: 'Job Added To Queue',
  reportSample: 'Workspace Overview',
  exportSample: 'Sample Data Export',
  resultReportSummary: 'A local sample workspace report is ready.',
  resultExportSummary: 'A local sample export is ready.',
  resultSummaryLabel: 'Summary',
  resultRecordsLabel: 'Records Processed',
  resultChecksumLabel: 'Checksum',
  resultFormatLabel: 'Format',
  resultSampleLabel: 'Sample',
  resultFileLabel: 'Filename',
  errors: {
    invalidInput: 'Enter a name between 1 and 80 characters and choose an available job type.',
    unavailable: 'This job is unavailable.',
    unknownType: 'This job type is unavailable.',
    capacity: 'Your queue is full. Wait for an active job to finish before starting another.',
    conflict: 'This request key was already used for different work. Start a new request.',
    retryConflict: 'This attempt has changed. Refresh the job before retrying.',
    notRetryable: 'This job cannot be safely retried.',
    notCancelable: 'This job has already finished. Refresh to see the result.',
    sampleFailure: 'The sample stopped at its recovery checkpoint. Retry the job to finish successfully.',
    failed: 'The worker could not complete this attempt. Review its status before retrying.',
    invalidProgress: 'The worker reported invalid progress.',
    duplicateDefinition: 'This job type is already registered.',
    historyCapacity: 'The local demo history is full. Reset demo data in developer settings before starting more jobs.',
    invalidResult: 'The worker returned an invalid result.',
  },
  rangeHint: (first: number, last: number, total: number) => `${first}–${last} of ${total} jobs`,
  attempt: (attempt: number, maximum: number) => `Attempt ${attempt} Of ${maximum}`,
  progress: (completed: number, total: number) => `${completed} / ${total}`,
};

// Chat

export const portalChatStrings = {
  sendShortcutHint: '+ Enter To Send',
  sendShortcutLabel: 'Shift + Enter To Send',
  reactionPicker: 'Choose A Reaction',
  actionFailedHint: 'We could not save that change. Try again.',
  overview: 'Overview', actions: 'Actions', editDetails: 'Edit Details',
  images: 'Images', otherFiles: 'Documents And Media',
  memberActions: (name: string) => `Manage ${name}`,
  filesCount: (count: number) => `${count} Files`,
  pinsCount: (count: number) => `${count} Pinned`,
  fileSize: (size: string) => `${size} KB`,
  overviewHint: 'People, shared files, and the details that keep this conversation together.',
  muteHint: 'Choose whether this conversation sends you notifications.',
  archiveHint: 'Move this conversation out of your inbox. You can restore it anytime.',
  imagePreview: (name: string) => `Preview ${name}`,
  emoji: { like: '👍' as const, celebrate: '🎉' as const, heart: '❤️' as const },
  title: 'Messages',
  description: 'A little closer to the people you work with.',
  inbox: 'Inbox', archived: 'Archived', all: 'All Conversations', direct: 'Direct Message', group: 'Group', newConversation: 'New Conversation',
  searchPlaceholder: 'Find a conversation…', messageSearchPlaceholder: 'Search this conversation…', clear: 'Clear Search',
  people: 'People', members: 'Members', details: 'Conversation Details', close: 'Close Details', back: 'Back To Conversations',
  name: 'Group Name', namePlaceholder: 'Give your group a name…', descriptionLabel: 'Description', descriptionPlaceholder: 'What is this group for?',
  choosePeople: 'Choose People', peoplePlaceholder: 'Select people…', selection: (count: number) => `${count} Selected`, clearPeople: 'Clear People',
  create: 'Start Conversation', save: 'Save Changes', cancel: 'Cancel', addPeople: 'Add People', remove: 'Remove', owner: 'Owner', admin: 'Admin', member: 'Member', role: 'Role',
  makeAdmin: 'Make Admin', makeMember: 'Make Member', removeMember: 'Remove Member', removeMemberTitle: 'Remove Member?',
  removeMemberHint: 'This person will lose access to the conversation and its attachments.',
  mute: 'Mute Conversation', unmute: 'Unmute Conversation', archive: 'Archive Conversation', restore: 'Restore Conversation',
  muted: 'Muted', pinned: 'Pinned Messages', noPinsHint: 'Pin a message to keep important details close.',
  attachments: 'Shared Files', noFilesHint: 'Files shared in this conversation will appear here.', download: 'Download', preview: 'Preview',
  composeLabel: 'Message', composePlaceholder: 'Write a message…', send: 'Send Message', attach: 'Attach Files',
  uploadHint: 'Drop files here or choose files to share with this conversation.',
  attachmentTypes: 'Images, PDF, Text, Audio, And Video',
  removeFile: 'Remove File', reply: 'Reply', replying: 'Replying To', edit: 'Edit Message', editTitle: 'Edit Message', delete: 'Delete Message',
  deleteTitle: 'Delete Message?', deleteHint: 'The message and its attachments will be removed for everyone. This cannot be undone.',
  deleted: 'Message Deleted', edited: 'Edited', pin: 'Pin Message', unpin: 'Unpin Message', react: 'React To Message',
  reactions: 'Reactions', reactionLabel: (emoji: string, count: number) => `${emoji} · ${count}`, like: 'Like', celebrate: 'Celebrate', heart: 'Love',
  sending: 'Sending', sendFailed: 'Not Sent', retrySend: 'Retry Send',
  sendFailedHint: 'Your message was not sent. Retry when you are ready.',
  you: 'You', read: 'Read', sent: 'Sent', unread: 'Unread Messages', membersCount: (count: number) => `${count} Members`,
  demoHint: 'Demo workspace · messages refresh every 5 seconds. Presence and typing are not simulated.',
  liveHint: 'Messages update automatically. Presence and typing are not available.',
  emptyTitle: 'Your Next Conversation Starts Here', emptyHint: 'Choose a conversation or bring a few people together.',
  noConversationsTitle: 'No Conversations Yet', noConversationsHint: 'Start a conversation to make space for the work ahead.',
  noResultsTitle: 'No Matches Found', noResultsHint: 'Try another name or clear your search.',
  noMessagesTitle: 'Make The First Move', noMessagesHint: 'Send a message or share something useful with the group.',
  loading: 'Loading Conversations', retry: 'Try Again', failedHint: 'We could not complete that action. Your draft is still here. Try again.',
  loadFailedHint: 'We could not load this conversation. Try again.',
  validation: {
    message: 'Write a message or attach a file. Messages can contain up to 4,000 characters.',
    people: 'Choose at least one other person. Groups can have up to 20 people.',
    groupName: 'Enter a group name between 1 and 80 characters.',
    attachment: 'Choose a supported file up to 5 MB. A message can include up to 4 files.',
    invalid: 'Check your entries and try again.',
    unavailable: 'This conversation or file is no longer available.',
  },
  demoData: {
    people: [
      { name: 'Alex Morgan', email: 'alex.morgan@example.com', team: 'Product Design' },
      { name: 'Jamie Chen', email: 'jamie.chen@example.com', team: 'Engineering' },
      { name: 'Sam Rivera', email: 'sam.rivera@example.com', team: 'Product' },
      { name: 'Taylor Park', email: 'taylor.park@example.com', team: 'Brand & Content' },
      { name: 'Jordan Lee', email: 'jordan.lee@example.com', team: 'Operations' },
    ],
    launchName: 'The Launch Room', launchDescription: 'Good ideas, small details, and everything we need to get this out into the world.',
    designName: 'Design Notes', designDescription: 'A working space for feedback, references, and little moments of inspiration.',
    messages: [
      'Morning, everyone! I pulled our launch notes together so we have one place to keep the conversation going.',
      'The new direction is feeling really good. The quieter layout gives the work so much more room to breathe.',
      'Agreed. Let’s keep the first experience focused — one clear next step, then the details when people need them.',
      'I’ll take another pass at the welcome copy this afternoon. Anything specific you want me to keep in mind?',
      'Clarity over cleverness. A little warmth goes a long way, too.',
      'Perfect. I’ll share an update here when it’s ready for a look.',
    ],
    directMessages: ['Hey! Have a moment to look at the latest direction together?', 'Absolutely — send it over whenever you’re ready.'],
    noteMessages: ['A place for the small details that make a big difference.', 'Let’s use this thread for references and feedback as the design takes shape.'],
    fileName: 'launch-notes.txt', fileBody: 'Launch notes\n\nKeep the first experience focused.\nClarity over cleverness.\nMake space for thoughtful feedback.\n',
  },
};

// Engagement And Saved Content

export const portalEngagementStrings = {
  title: 'Saved Items',
  description:
    'Keep useful articles close. Saved items belong to your account.',
  like: 'Like Article',
  unlike: 'Unlike Article',
  save: 'Save Article',
  unsave: 'Remove From Saved',
  ratingLabel: 'Your Rating',
  clearRating: 'Clear Rating',
  clearRatingTitle: 'Clear Your Rating?',
  clearRatingDescription:
    'Your rating will be removed from this article. You can choose another rating afterward.',
  keepRating: 'Keep Rating',
  noRating: 'No Rating',
  ratingOption: (value: number) => `${value} Stars`,
  likeCount: (count: number) => `${count} Likes`,
  signIn: 'Sign In To Like, Save, Or Rate',
  signInHint:
    'Sign in to keep likes, saved items, and ratings with your account.',
  loading: 'Loading Account Actions',
  actionsLabel: 'Article Account Actions',
  retry: 'Try Again',
  errorTitle: 'Account Actions Are Unavailable',
  errorDescription:
    'We could not complete that change. Your previous choice is still available. Try again.',
  invalidInputHint: 'Choose a valid like, saved state, or rating from one to five.',
  unavailableTitle: 'Item Is Unavailable',
  unavailableDescription:
    'This item is no longer publicly available. You can remove it from your saved items.',
  remove: 'Remove Saved Item',
  removeTitle: 'Remove Saved Item?',
  removeDescription:
    'This removes the item from your saved list. You can save it again while it is available.',
  cancel: 'Keep Item',
  removedTitle: 'Saved Item Removed',
  emptyTitle: 'Nothing Saved Yet',
  emptyDescription:
    'Save an article from its public page to return to it here.',
  noResultsTitle: 'No Saved Items Found',
  noResultsDescription: 'Try a different search or clear your filters.',
  browse: 'Browse Articles',
  searchLabel: 'Search Saved Items',
  searchPlaceholder: 'Find a saved article…',
  clearSearch: 'Clear Search',
  allTypes: 'All Types',
  typeLabel: 'Type',
  paginationLabel: 'Saved Item Pages',
  previous: 'Previous Page',
  next: 'Next Page',
  rangeHint: (from: number, to: number, total: number) =>
    `${from}–${to} of ${total} saved items`,
} as const;

// Notifications Inbox

export const portalNotificationInboxStrings = {
  archiveItemLabel: (title: string) => `Archive ${title}`,
  readItemLabel: (title: string, read: boolean) =>
    read ? `Mark ${title} Unread` : `Mark ${title} Read`,
  inboxSetupLabel: (unread?: number) =>
    unread === undefined
      ? 'Notifications, Browser Setup Needs A Decision'
      : `Notifications, ${unread} Unread, Browser Setup Needs A Decision`,
  title: 'Notifications',
  description:
    `Updates and conversations from your ${portalProjectStrings.name} workspace, gathered in one place.`,
  views: { all: 'All', unread: 'Unread', read: 'Read' },
  viewLabel: 'Notification View',
  unreadViewLabel: (count: number) =>
    `Unread (${count.toLocaleString('en-US')})`,
  resultsLabel: 'Notification Updates',
  manageAction: 'Manage Inbox',
  bulkTitle: 'Update Multiple Notifications',
  loadingSummaryHint: 'Checking your inbox…',
  inboxTotalHint: (count: number) =>
    `${count.toLocaleString('en-US')} update${count === 1 ? '' : 's'} in your inbox`,
  matchingTotalHint: (count: number) =>
    `${count.toLocaleString('en-US')} update${count === 1 ? ' matches' : 's match'} your search and category`,
  eyebrow: 'Your Workspace',
  settingsAction: 'Notification Settings',
  refreshAction: 'Refresh',
  inboxAction: 'View Inbox',
  preferencesTitle: 'Notification Settings',
  preferencesDescription:
    `Choose which updates reach you and how ${portalProjectStrings.name} schedules them.`,
  categories: {
    ACTIVITY: 'Activity',
    MENTION: 'Mentions',
    TAG: 'Tags',
    PRODUCT_UPDATE: 'Product Updates',
  },
  categoryDescriptions: {
    ACTIVITY: 'Updates about activity in your workspace.',
    MENTION: 'Updates when someone mentions you.',
    TAG: 'Updates about tags and topics connected to you.',
    PRODUCT_UPDATE: `News about ${portalProjectStrings.name} features and improvements.`,
  },
  channels: { IN_APP: 'In App', PUSH: 'Push', EMAIL: 'Email' },
  readStatuses: { unread: 'Unread', read: 'Read' },
  searchLabel: 'Search Notifications',
  searchPlaceholder: 'Search titles and messages',
  clearSearchAction: portalActionStrings.clearSearch,
  clearFiltersAction: portalActionStrings.clearFilters,
  categoryLabel: 'Category',
  allCategories: 'All Categories',
  readLabel: 'Read Status',
  allReadStatuses: 'All Notifications',
  sortLabel: 'Order',
  newestOption: 'Newest First',
  oldestOption: 'Oldest First',
  markReadAction: 'Mark Read',
  markUnreadAction: 'Mark Unread',
  markAllReadAction: 'Mark All As Read',
  markAllUnreadAction: 'Mark All Unread',
  markMatchingReadAction: 'Mark Matching Read',
  markMatchingUnreadAction: 'Mark Matching Unread',
  archiveAction: 'Archive',
  archiveAllAction: 'Archive All',
  archiveMatchingAction: 'Archive Matching',
  archiveTitle: 'Archive Notification',
  archiveAllTitle: 'Archive All Notifications',
  archiveMatchingTitle: 'Archive Matching Notifications',
  archiveDescription: (title: string) =>
    `Archive “${title}”? It will leave your inbox. Restoring archived notifications is not available.`,
  archiveAllDescription:
    'Archive every notification currently in your inbox, across all pages? Restoring archived notifications is not available.',
  archiveMatchingDescription:
    'Archive every notification matching the current search, category, and read status, across all pages? Restoring archived notifications is not available.',
  cancelAction: portalActionStrings.cancel,
  openAction: 'Open Update',
  readChangedTitle: 'Read Status Updated',
  archivedTitle: 'Notifications Archived',
  mutationDescription: (count: number) =>
    `${count.toLocaleString('en-US')} notification${count === 1 ? '' : 's'} changed.`,
  scopeAllHint: 'Bulk actions apply to your whole inbox across all pages.',
  scopeFilteredHint:
    'Bulk actions apply to all matching notifications across all pages.',
  unreadCount: (count: number) => `${count.toLocaleString('en-US')} Unread`,
  totalCount: (count: number) => `${count.toLocaleString('en-US')} Total`,
  inboxLinkLabel: (count: number) =>
    `Notifications, ${count.toLocaleString('en-US')} Unread`,
  inboxUnknownLabel: 'Notifications, Unread Count Unavailable',
  countLoadingLabel: 'Notifications, Loading Unread Count',
  countLimit: '99+',
  countUnavailable: 'Unread Count Unavailable',
  loadingTitle: 'Loading Notifications',
  emptyTitle: 'You Are All Caught Up',
  emptyHint:
    'New workspace updates will appear here when there is something to share.',
  noResultsTitle: 'No Matching Notifications',
  noResultsHint: 'Try another search or clear your filters to see your inbox.',
  paginationLabel: 'Notification Pages',
  rangeLabel: (from: number, to: number) =>
    `${from.toLocaleString('en-US')}–${to.toLocaleString('en-US')}`,
  unknownDate: 'Date Unavailable',
  deliveryTitle: 'Categories And Channels',
  deliveryDescription:
    'Choose a channel for each kind of update. Channel preferences apply to future notifications.',
  browserTitle: 'Browser Notifications',
  browserDescription:
    'Push preferences choose what can be sent. This browser must also be enabled in Appearance to receive push notifications.',
  browserAction: 'Manage Browser Notifications',
  savePreferencesAction: 'Save Preferences',
  savedPreferencesTitle: 'Preferences Saved',
  discardAction: 'Discard Changes',
  noPreferencesTitle: 'Preferences Unavailable',
  noPreferencesHint:
    'No notification preferences were returned. Refresh to try again.',
  timezoneTitle: 'Scheduling Timezone',
  timezoneDescription:
    'Follow this browser’s timezone, or keep a deliberate timezone for scheduled updates. Dates in the workspace still display in your browser’s local time.',
  browserTimezoneLabel: 'Use Browser Timezone',
  timezoneLabel: 'Timezone',
  saveTimezoneAction: 'Save Timezone',
  savedTimezoneTitle: 'Timezone Saved',
  effectiveTimezoneHint: (timezone: string) =>
    `Scheduled updates use ${timezone}.`,
  detectedTimezoneHint: (timezone: string) =>
    `This browser reports ${timezone}.`,
  overrideTimezoneHint:
    'Your saved timezone stays in effect when your browser’s timezone changes.',
  automaticTimezoneHint:
    'The most recently detected browser timezone is used. UTC is used until a browser timezone is available.',
  unsavedHint: 'You have unsaved changes.',
  savedHint: 'Your saved preferences are active.',
  validation: {
    timezone: 'Choose a valid named timezone.',
    preferences: 'Use each category and channel once.',
    selection: 'Choose between 1 and 100 distinct notifications.',
    filters: 'Choose at least one restrictive filter.',
    unavailable:
      'This notification is unavailable or no longer belongs to your visible inbox.',
  },
  demo: {
    activityTitle: 'Your Workspace Is Ready',
    activityBody: 'Review your saved requests and pick up where you left off.',
    mentionTitle: 'A Conversation Worth Returning To',
    mentionBody: 'Return to a conversation in your local demo workspace.',
    tagTitle: 'A Useful Read',
    tagBody: 'Explore a published article from the sample content library.',
    updateTitle: 'More Ways To Work',
    updateBody:
      'Your Portal workspace brings publishing, notifications, preferences, and account tools together.',
    archiveTitle: 'An Earlier Update',
    archiveBody:
      'This demo notification is archived and stays out of the visible inbox.',
    scheduledTitle: 'A Future Update',
    scheduledBody:
      'This demo notification is scheduled and stays out of the visible inbox until it is published.',
    expiredTitle: 'An Expired Update',
    expiredBody:
      'This demo notification has expired and stays out of the visible inbox.',
  },
} as const;

// Onboarding

export const portalOnboardingStrings = {
  title: 'Set Up Your Account',
  description:
    'Add your profile and preferences. Your saved progress resumes when you return.',
  stepperLabel: 'Account Setup Progress',
  current: 'Current Step',
  complete: 'Complete',
  upcoming: 'Upcoming',
  steps: {
    profile: { title: 'Profile', description: 'Confirm your name.' },
    preferences: {
      title: 'Preferences',
      description: 'Choose your workspace defaults.',
    },
    review: { title: 'Review', description: 'Finish and open your workspace.' },
  },
  firstName: 'First Name',
  lastName: 'Last Name',
  timezone: 'Timezone',
  digest: 'Email Digest',
  digestDescription: 'Save your preference without sending a demo email.',
  back: 'Back',
  continue: 'Save And Continue',
  finish: 'Finish Setup',
  saving: 'Saving',
  reviewTitle: 'Ready To Continue',
  reviewDescription: 'Review your saved choices before completing setup.',
  yes: 'Enabled',
  no: 'Disabled',
  errorTitle: 'Unable To Save Setup',
  invalidNameHint: 'Enter your first and last name.',
  invalidTimezoneHint: 'Choose a valid timezone.',
  completedTitle: 'Setup Complete',
  completedDescription: 'Your account is ready.',
  restart: 'Restart Setup',
  requiredHint: 'Complete account setup before opening this page.',
  invalidStepHint: 'Save the previous steps before continuing.',
} as const;

// Publishing And Media

export const portalPublishingStrings = {
  article: {
    invalidTopicHint: 'Enter a topic between 2 and 80 characters.',
    addTopic: 'Add Topic',
    newTopicLabel: 'New Topic',
    useTopic: 'Use Topic',
    cancelTopic: 'Cancel',
    addCover: 'Add Cover Illustration',
    customCover: 'Custom Illustration',
    coverFromArticle: (title: string) => `Illustration From ${title}`,
    reusableOptionsHint:
      'Save this article to make its new topic and cover available to other articles.',
    optionsErrorHint:
      'Saved topics and covers could not be loaded. Your current choices are still available.',
    retryOptions: 'Retry Saved Choices',

    decorativeAlt: '',
    publicTitle: 'Articles & Stories',
    siteName: 'Portal',
    home: 'Home',
    signIn: 'Sign In',
    demoData: {
      title: 'A Better Starting Point',
      description:
        'A reusable publishing foundation gives every new project a clear place to begin. Explore the blocks, preview a draft, and make it your own.',
      secondTitle: 'Making Space For Clear Ideas',
      secondDescription:
        'Simple structure helps readers find what matters. Use short sections, useful examples, and a clear next step.',
      draftTitle: 'Your Next Article',
      draftDescription:
        'This private working draft is a place to try the editor before publishing an article of your own.',
      heading: 'Start With The Reader',
      body: 'A useful article answers a real question. Give readers context, explain the idea clearly, and leave them with a practical next step.',
      quote: 'Good structure makes room for good ideas.',
      items: [
        'Choose one idea.',
        'Add context and examples.',
        'Preview before publishing.',
      ],
      calloutTitle: 'Make It Your Own',
      callout:
        'Topics, covers, and content blocks belong to your application. Adapt this module to the audience you serve.',
      footer: 'Return to the editor whenever the idea grows.',
    },
    publicEyebrow: 'The Journal',
    publicDescription:
      'Thoughtful reads, lived experiences, and practical ideas for your next project.',
    publicMetadataTitle: 'The Journal',
    allArticles: 'All Articles',
    backToJournal: 'Back To The Journal',
    readArticle: 'Read Article',
    searchLabel: 'Search Articles',
    searchPlaceholder: 'Find a little clarity…',
    clearSearch: 'Clear Search',
    categoryLabel: 'Topic',
    allCategories: 'All Topics',
    categories: {
      ideas: 'Ideas',
      community: 'Community',
      guides: 'Guides',
      stories: 'Stories',
    },
    statuses: { draft: 'Draft', published: 'Published' },
    emptyTitle: 'A New Chapter Is Coming',
    emptyDescription:
      'There are no published articles yet. Come back soon for thoughtful reads from the team.',
    noResultsTitle: 'A Different Path To Explore',
    noResultsDescription:
      'No articles match those filters. Try another topic or a different search.',
    resetFilters: 'View All Articles',
    paginationLabel: 'Article Pages',
    articleRangeHint: (from: number, to: number, total: number) =>
      `${from}–${to} of ${total} articles`,
    authorByline: (author: string) => `By ${author}`,
    readingTime: (minutes: number) => `${minutes} Min Read`,
    coverAlt: (title: string) => `Illustration for “${title}”`,
    relatedTitle: 'More Along The Path',
    articleUnavailableTitle: 'This Read Is Taking A Moment',
    articleUnavailableDescription:
      'We could not load the journal. Please try again in a moment.',
    retry: 'Try Again',
    loadingTitle: 'Opening The Journal',
    loadingDescription: 'Gathering thoughtful reads for your work.',
    notFoundTitle: 'This Article Is Not Here',
    notFoundDescription:
      'It may have moved or is not currently published. There are more reads waiting in the journal.',
    adminTitle: 'Publishing',
    adminDescription:
      'Make room for thoughtful stories. Write, preview, and publish articles at your own pace.',
    newArticle: 'Write An Article',
    newTitle: 'A New Chapter',
    editTitle: 'Edit Article',
    formDescription:
      'A clear, considered read can help readers understand an idea.',
    articleDetails: 'The First Impression',
    articleDetailsDescription:
      'Give your article a clear title, a useful introduction, and a topic that helps readers find it.',
    bodyTitle: 'The Story',
    bodyDescription:
      'Use headings, quotes, and ordered or bulleted lists to give your article a comfortable rhythm. Preview before publishing.',
    titleLabel: 'Article Title',
    titlePlaceholder: 'A small moment worth sharing',
    slugLabel: 'Article Address',
    slugHint:
      'Use lowercase letters, numbers, and hyphens. This becomes the public link.',
    descriptionLabel: 'Introduction',
    descriptionPlaceholder: 'A few sentences to invite the reader in…',
    authorLabel: 'Author',
    coverLabel: 'Cover Illustration',
    coverOptions: { none: 'No Cover' },
    contentLabel: 'Article Content',
    contentHint:
      'Write in Markdown. Headings, quotes, ordered lists, bullets, and links are supported.',
    preview: 'Preview Article',
    previewTitle: 'A Reader’s View',
    previewDescription:
      'This private preview shows the current form. Save your changes before sharing a public link.',
    previewEmptyHint: 'Your story will appear here as you write.',
    closePreview: 'Back To Writing',
    saveDraft: 'Save Draft',
    saveChanges: 'Save Changes',
    publish: 'Publish Article',
    unpublish: 'Unpublish Article',
    delete: 'Delete Article',
    cancel: 'Cancel',
    backToArticles: 'Back To Articles',
    openPublic: 'View Published Article',
    draftHint:
      'Only administrators can see this draft. Publish when the article is ready for readers.',
    publishedHint:
      'This article is public. Saved changes appear in the journal immediately.',
    unsavedHint: 'You have changes waiting to be saved.',
    savedTitle: 'Article Saved',
    savedDescription: 'Your changes are safely saved.',
    publishedTitle: 'Article Published',
    publishedDescription:
      'Your article is now available in the public journal.',
    unpublishedTitle: 'Article Returned To Draft',
    unpublishedDescription:
      'Readers can no longer open this article. You can publish it again when it is ready.',
    deletedTitle: 'Article Deleted',
    deletedDescription: 'The article has been removed from the journal.',
    mutationErrorTitle: 'Your Changes Need Another Moment',
    mutationErrorDescription:
      'We could not save that change. Your writing is still here. Please try again.',
    validationTitle: 'A Few Details Need Your Attention',
    invalidTitleHint: 'Enter a title between 3 and 140 characters.',
    invalidSlugHint:
      'Use 3–100 lowercase letters, numbers, and hyphens, with no hyphen at either end.',
    invalidDescription: 'Write an introduction between 20 and 350 characters.',
    invalidAuthorHint: 'Enter an author name between 2 and 100 characters.',
    invalidBody: 'Write at least 40 characters, up to 50,000 characters.',
    invalidCategoryHint: 'Choose a topic for the article.',
    invalidCoverHint: 'Choose one of the cover illustrations.',
    invalidInputHint: 'Review the article details and try again.',
    duplicateSlugHint:
      'An article already uses that address. Choose a different article address.',
    permissionErrorHint: 'Only administrators can manage journal articles.',
    conflictErrorHint:
      'This article changed since you opened it. Copy your writing, reload the article, and review the latest version before saving.',
    missingArticleHint: 'This article could not be found.',
    publishConfirmTitle: 'Ready To Share This Article?',
    publishConfirmDescription: (title: string) =>
      `“${title}” will be available to everyone in the public journal.`,
    unpublishConfirmTitle: 'Return This Article To Draft?',
    unpublishConfirmDescription: (title: string) =>
      `“${title}” will be removed from the public journal. Its writing will remain available here.`,
    deleteConfirmTitle: 'Delete This Article?',
    deleteConfirmDescription: (title: string) =>
      `“${title}” and its writing will be permanently removed. This cannot be undone.`,
    discardTitle: 'Leave Your Writing Behind?',
    discardDescription:
      'You have changes that have not been saved. Leave this page to discard them, or stay to keep writing.',
    discard: 'Discard Changes',
    keepWriting: 'Keep Writing',
    statusLabel: 'Status',
    allStatuses: 'All Statuses',
    adminSearchPlaceholder: 'Find a title, topic, or author…',
    tableCaption: 'Journal Articles',
    titleColumn: 'Article',
    statusColumn: 'Status',
    topicColumn: 'Topic',
    updatedColumn: 'Last Edited',
    editAction: 'Edit Article',
    adminEmptyTitle: 'Your First Story Starts Here',
    adminEmptyDescription:
      'Create an article, take your time with a draft, and share it when you are ready.',
    adminNoResultsTitle: 'No Articles Found',
    adminNoResultsDescription:
      'Try another search, topic, or publication status.',
    adminLoading: 'Loading Your Articles',
    adminErrorTitle: 'Articles Are Unavailable',
    adminErrorDescription:
      'We could not open your article library. Please try again.',
    draftPreviewLabel: 'Private Draft Preview',
    unsavedPreviewTitle: 'Your Article Title',
    defaultAuthor: 'Editorial Team',
  },
  builder: {
    title: 'Article Builder',
    description:
      'Build the story one block at a time. Drag the handle or use the arrows to change the reading order.',
    addBlock: 'Add A Block',
    cancelUpload: 'Cancel Upload',
    paletteTitle: 'Choose A Block',
    paletteDescription: 'Choose what comes next in your story.',
    closePalette: 'Close Block Choices',
    emptyTitle: 'Make Room For Your Story',
    emptyDescription:
      'Start with a heading, a few words, or an image. Add and arrange more blocks as you go.',
    contentLabel: 'Article Blocks',
    blockLabel: (position: number, type: string) => `${position}. ${type}`,
    moveLabel: (type: string) => `Move ${type}`,
    moveUpLabel: (type: string) => `Move ${type} Up`,
    moveDownLabel: (type: string) => `Move ${type} Down`,
    removeLabel: (type: string) => `Remove ${type}`,
    removeTitle: 'Remove Block',
    removeDescription:
      'This removes the block from your draft. The saved article stays unchanged until you save.',
    remove: 'Remove Block',
    keep: 'Keep Block',
    headingLabel: 'Heading',
    textLabel: 'Text',
    attributionLabel: 'Attribution',
    captionLabel: 'Caption',
    urlLabel: 'HTTPS URL',
    linkLabel: 'Link Text',
    itemsLabel: 'List Items',
    itemsHint: 'Write one item per line.',
    imageLabel: 'Image',
    imageUrlLabel: 'Image URL',
    imageAltLabel: 'Image Description',
    imageAltHint:
      'Describe what someone should know about the image. This is read aloud by screen readers.',
    imageNumberLabel: (position: number) => `Image ${position}`,
    upload: 'Upload Image',
    replaceUpload: 'Replace Image',
    uploadingTitle: 'Uploading Image',
    uploadHint:
      'PNG, JPEG, GIF, or WebP, up to 5 MB. Article images are public; choose images you have permission to share.',
    uploadErrorTitle: 'Image Could Not Be Uploaded',
    uploadErrorDescription:
      'Your writing is safe. Choose the image again or enter an HTTPS image URL.',
    uploadTypeErrorHint: 'Choose a PNG, JPEG, GIF, or WebP image.',
    uploadSizeErrorHint: 'Choose an image smaller than 5 MB.',
    uploadCapacityErrorHint:
      'Demo image storage is full. Reset the demo to clear uploaded images, then try again.',
    uploadMissingErrorHint: 'Choose an image to upload.',
    uploadInvalidErrorHint:
      'This file could not be read as an image. Choose a valid PNG, JPEG, GIF, or WebP file.',
    uploadAltRequiredHint: 'Add an image description before saving.',
    invalidUrlHint:
      'Enter a complete HTTPS URL without a username, password, spaces, or a private network address.',
    invalidImageUrlHint:
      'Upload an image or enter a permanent public HTTPS image URL without query parameters or private document paths.',
    invalidContentHint: 'Add at least one complete content block before saving.',
    invalidBlockHint: 'Complete the required fields in this block before saving.',
    repairTitle: 'Review Saved Article',
    repairDescription:
      'This article contains older values that need attention before saving or publishing. Your original writing is retained. Review the title, introduction, and highlighted blocks; shorten or split text to meet the current limits.',
    invalidStoredContentHint: 'This saved block exceeds the supported data limits.',
    unsupportedStoredFieldsHint:
      'This block includes older fields that cannot be saved by the current editor. Review its saved data, add a replacement block, then explicitly remove the original when its writing is preserved.',
    savedBlockDataLabel: 'View Saved Block Data',
    savedBlockUnavailableDescription:
      'This block needs repair before it can use the current layout. Its original data is shown below.',
    savedBlockAdditionalDescription:
      'This block also includes earlier data. Its complete saved values are shown below.',
    replaceSavedBlockDescription:
      'Copy the writing you need into a new block. Remove this block only after you have preserved its content. Saving will not discard these older fields automatically.',
    invalidHeadingHint: 'Add a heading of up to 200 characters.',
    invalidTextHint: 'Add text of up to 20,000 characters.',
    invalidShortTextHint: 'Add text of up to 4,000 characters.',
    invalidCaptionHint: 'Keep the caption within 1,000 characters.',
    invalidAttributionHint: 'Keep the attribution within 200 characters.',
    invalidLegacyTextHint: 'Keep converted Markdown text within 50,000 characters.',
    invalidItemsHint:
      'Add between 1 and 30 list items, with no more than 1,000 characters each.',
    invalidImageHint: 'Choose an image and add its description.',
    tooManyBlocksHint: 'An article can contain up to 100 blocks.',
    invalidGalleryHint:
      'Add every image and its description before saving the gallery.',
    duplicateBlocksHint:
      'Every block must have its own ID. Add the block again and retry.',
    invalidContentSizeHint:
      'The article is too large. Shorten the text or use fewer blocks.',
    legacyTitle: 'Existing Markdown Story',
    legacyDescription:
      'This article includes an earlier Markdown story. Its exact writing stays available here alongside any saved blocks. Convert it explicitly before saving to keep all of its content.',
    legacyBodyLabel: 'Earlier Markdown Story',
    legacyConversionRequiredHint:
      'Convert this story into a Markdown block before saving or publishing. Conversion appends the complete original text without trimming it; current block and article limits still apply. Shorten or split any highlighted text before saving.',
    convert: 'Convert To Blocks',
    legacyFormatHint:
      'This converted text keeps its original Markdown formatting.',
    dividerHint: 'A quiet break between parts of your story.',
    embedHint:
      'YouTube, Vimeo, and Spotify players load when the reader chooses. Other pages open through their original link.',
    openEmbed: 'Open Embedded Link',
    loadEmbed: 'Load Embedded Media',
    unloadEmbed: 'Close Embedded Media',
    embedConnectionHint: (provider: string) =>
      `Loading this player connects to ${provider}. You can also open the original link.`,
    embedProviders: {
      youtube: 'YouTube',
      vimeo: 'Vimeo',
      spotify: 'Spotify',
    },
    types: {
      header: 'Heading',
      section: 'Text Section',
      footer: 'Closing Note',
      quote: 'Quote',
      bullet: 'Bullet List',
      divider: 'Divider',
      embed: 'Embed URL',
      image: 'Image',
      gallery2: 'Two Images',
      gallery3: 'Three Images',
      gallery4: 'Four Images',
      callout: 'Callout',
      link: 'Link',
    },
    typeDescriptions: {
      header: 'Introduce a new part of the story.',
      section: 'Write a paragraph or a longer section.',
      footer: 'Leave readers with a final thought.',
      quote: 'Give a thought space to stand out.',
      bullet: 'Make a short, easy-to-read list.',
      divider: 'Add a pause between sections.',
      embed: 'Share a video, podcast, or another page.',
      image: 'Upload a picture or use an image URL.',
      gallery2: 'Place two pictures together.',
      gallery3: 'Arrange three pictures in a row.',
      gallery4: 'Create a balanced four-picture gallery.',
      callout: 'Highlight a useful note.',
      link: 'Guide readers to another resource.',
    },
  },
} as const;

export const portalMediaStrings = {
  uploadImage: 'Upload Image',
  replaceImage: 'Replace Image',
  removeImage: 'Remove Image',
  cancelImageUpload: 'Cancel Upload',
  imagePreviewAlt: 'Preview of the selected image',
  imageUploadHint:
    'Upload a PNG, JPEG, WebP, or GIF up to 5 MB, or enter a public HTTPS image URL. Uploaded images are public.',
  imageUrlErrorHint: 'Use a permanent public HTTPS image URL or upload an image.',
  imageTypeErrorHint: 'Choose a PNG, JPEG, WebP, or GIF image.',
  imageSizeErrorHint:
    'Choose an image larger than zero bytes and no larger than 5 MB.',
  imageMissingErrorHint: 'Choose an image to upload.',
  imageInvalidErrorHint:
    'The file contents do not match the selected image format.',
  imageCapacityErrorHint:
    'This demo has reached its image limit. Reset the demo data to upload more images.',
  imageUploadErrorHint:
    'The image could not be uploaded. Your current image is unchanged. Try again.',
  emptyHint: 'No images have been saved for this product.',
  previewUnavailableHint:
    'This image could not be retrieved. Try loading it again.',
} as const;

// Component Library And Motion Settings

export const portalUiStrings = {
  colorInput: {
    hex: 'HEX Color',
    copy: 'Copy',
    done: 'Done',
    invalidHexHint: 'Enter a six-digit HEX color.',
    hexHint: 'Use six hexadecimal digits, with or without #.',
    copied: 'Color Copied',
    copyFailedHint:
      'The color could not be copied. Select and copy the value manually.',
  },
  datePicker: {
    openCalendar: (label: string) => `Open ${label} Calendar`,
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    clearDate: 'Clear Date',
  },
  engagement: { save: 'Save', saved: 'Saved' },
  queryBoundary: {
    refreshFailed: 'Unable To Refresh',
    refreshHint:
      'Showing the last available information. Try again to load the latest changes.',
  },
  library: {
    title: 'Reusable Interactions',
    description:
      'Calendar, disclosure, feedback, save, and scrolling patterns share the active theme and motion preferences.',
    date: 'Scheduled Date',
    dateHint: 'A date-only value with an app-owned calendar.',
    rating: 'Your Rating',
    ratingOption: (value: number) => `${value} Of 5 Stars`,
    ratingValue: (value: number | null) =>
      value ? `${value} Of 5` : 'Choose A Rating',
    ratingSummary: 'Rated 4.5 Out Of 5 From 24 Ratings',
    average: '4.5',
    count: '24 Ratings',
    noRatings: 'No Ratings Yet',
    like: 'Like',
    liked: 'Liked',
    reactions: (count: number) => `${count} Reactions`,
    accordionTitle: 'How Does Disclosure Work?',
    accordionBody:
      'Expand a section with the pointer, Enter, or Space. Each section owns an accessible trigger and preserves its contents while collapsed.',
    accordionSecond: 'What Happens To Motion Preferences?',
    accordionSecondBody:
      'The shared controls respect both the saved motion choice and the device’s reduced motion preference.',
    carousel: 'Reusable Pattern Examples',
    carouselTitles: [
      'Review A Draft',
      'Save A Record',
      'Explore A Collection',
      'Share Feedback',
    ],
    carouselBody:
      'Native scrolling supports touch, trackpad, and keyboard navigation.',
    tabs: 'History-Aware Views',
    tabOverview: 'Overview',
    tabDetails: 'Details',
    tabHistory: 'History',
    tabOverviewBody:
      'Choose another view, then use browser Back to restore this one.',
    tabDetailsBody:
      'Committed view choices create URL history and survive a reload.',
    tabHistoryBody:
      'Browser Back and Forward restore the selected view without leaving the application.',
    limitedSelect: 'Choose Up To Two',
    selectPlaceholder: 'Choose Examples',
    selectionCount: (count: number) => `${count} Selected`,
    options: ['Calendar', 'Disclosure', 'Rating', 'Carousel'],
    clear: 'Clear Selection',
    selectAll: 'Select All',
    color: 'Accent Color',
    menu: 'Example Actions',
    menuOpen: 'Open Component Library',
    menuRemove: 'Remove Example',
    menuRemoved: 'Example Removed',
    transition: 'Refresh Preview',
    transitionValue: (revision: number) =>
      `Preview revision ${revision}. The content transition keeps focus and layout ownership with its caller.`,
  },
} as const;

export const componentExpansionStrings = {
  avatar: {
    decorativeAlt: '',
    unknown: 'Unknown Person',
    fallback: '?',
    statuses: { online: 'Online', offline: 'Offline', busy: 'Busy' },
    withStatus: (name: string, status: string) => `${name}, ${status}`,
    overflow: (count: number) => `+${count}`,
    showMore: (count: number) => `Show ${count} More People`,
    overflowNames: (names: string[]) => names.join(', '),
  },
  upload: {
    fileList: 'Files',
    choose: 'Choose Files',
    cancel: 'Cancel',
    retry: 'Retry',
    remove: 'Remove',
    dropHint: 'Drag files here or choose them from your device.',
    fullHint: 'The file limit is reached. Remove a file to choose another.',
    failedHint: 'This file could not be uploaded. Try again.',
    statuses: {
      ready: 'Ready',
      uploading: 'Uploading',
      complete: 'Complete',
      error: 'Failed',
      cancelled: 'Cancelled',
    },
    cancelFile: (name: string) => `Cancel Upload Of ${name}`,
    retryFile: (name: string) => `Retry Upload Of ${name}`,
    removeFile: (name: string) => `Remove ${name}`,
    progress: (name: string) => `Uploading ${name}`,
    fileSizeData: (bytes: number) =>
      bytes < 1024
        ? `${bytes} B`
        : bytes < 1024 * 1024
          ? `${(bytes / 1024).toFixed(1)} KB`
          : `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    limitsHint: (accept?: string, count?: number, size?: number) => {

      const uploadLimits = [
        accept || 'All file types',
        count === undefined ? 'Multiple files' : `Up to ${count} files`,
        size === undefined
          ? ''
          : `Up to ${Math.round(size / (1024 * 1024))} MB per file`,
      ]
        .filter(Boolean)
        .join(' · ');

      return uploadLimits;

    },
    rejection: (name: string, reason: 'type' | 'size' | 'count') =>
      reason === 'type'
        ? `${name}: choose a supported file type.`
        : reason === 'size'
          ? `${name}: this file exceeds the size limit.`
          : `${name}: the file count limit is reached.`,
  },
  table: {
    selectPage: 'Select All Available Rows On This Page',
    actions: 'Bulk Actions',
    clear: 'Clear Selection',
    selected: (count: number) => `${count} Selected`,
    allSelected: (count: number) => `All ${count} Matching Results Selected`,
    selectMatching: (count: number) => `Select All ${count} Matching Results`,
    selectRow: (name: string) => `Select ${name}`,
  },
  combobox: {
    clear: (label: string) => `Clear ${label}`,
    open: (label: string) => `Open ${label}`,
    loading: 'Loading Options',
    empty: 'No Matching Options',
    unavailable: 'Options Unavailable',
    retry: 'Try Again',
  },
  examples: {
    avatarsTitle: 'Avatars And Groups',
    avatarsDescription:
      'People, image fallbacks, presence, and a compact group with an accessible overflow summary.',
    avatarSizes: 'Sizes',
    avatarFallback: 'Image Fallback',
    avatarPresence: 'Presence',
    avatarGroup: 'Project Team',
    people: [
      'Alex Morgan',
      'Jordan Lee',
      'Sam Rivera',
      'Taylor Kim',
      'Casey Chen',
      'Robin Patel',
    ],
    uploadTitle: 'Upload Field And File List',
    uploadDescription:
      'Choose local files, inspect validation, and explore progress, cancellation, and retry without sending anything.',
    uploadLabel: 'Project Attachments',
    disabledUploadLabel: 'Disabled Upload',
    uploadHint:
      'Images and PDFs only. Up to five files, with a 5 MB limit per file. Files stay in this browser preview.',
    simulate: 'Run Local Upload Preview',
    simulateFailure: 'Preview A Failure',
    reset: 'Reset Example',
    failureHint:
      'This is a simulated upload failure. Retry to complete the local preview.',
    fileNames: ['Workspace Overview.pdf', 'Brand Reference.png'],
    comboTitle: 'Combobox And Autocomplete',
    comboDescription:
      'Search a local collection or explore a simulated remote source with loading, empty, and recovery states.',
    assignee: 'Assignee',
    assigneePlaceholder: 'Search for a teammate…',
    selectedPerson: (name: string) => `Selected: ${name}`,
    unassigned: 'Unassigned',
    remoteLabel: 'Remote Search Preview',
    remoteHint:
      'Results are simulated locally after a short delay. No request leaves this page.',
    remoteError: 'The simulated source is unavailable. Try again.',
    failSearch: 'Simulate Search Failure',
    disabledLabel: 'Disabled Combobox',
    readonlyLabel: 'Read-Only Combobox',
    rangeTitle: 'Date Range Picker',
    rangeDescription:
      'An inclusive date-only range with typed segments, keyboard calendar selection, limits, and clearing.',
    rangeLabel: 'Reporting Period',
    rangeHint:
      'Both endpoints are included. This example permits dates in November and December 2026.',
    rangeDisabled: 'Disabled Range',
    rangeReadOnly: 'Read-Only Range',
    rangeInvalid: 'Invalid Range',
    rangeError: 'Choose a reporting period within the permitted dates.',
    rangeSummary: (start: string, end: string) => `${start} – ${end}`,
    rangeEmpty: 'No Period Selected',
    selectionTitle: 'Table Selection And Bulk Actions',
    selectionDescription:
      'Select individual records or the current page, then explicitly expand the scope to all matching results.',
    nameColumn: 'Name',
    roleColumn: 'Role',
    statusColumn: 'Status',
    memberRole: 'Team Member',
    disabledRole: 'Selection Unavailable',
    archive: 'Archive Selected',
    archiveTitle: 'Archive Selected Records?',
    archiveDescription: (count: number) =>
      `This local preview will archive ${count} selected ${count === 1 ? 'record' : 'records'}. Reset the example to restore them.`,
    cancel: 'Keep Records',
    archived: (count: number) => `${count} Records Archived`,
    partialFailure: 'Preview Partial Failure',
    partialFailureHint:
      'Some records could not be archived. The remaining selection is ready to retry.',
  },
};

export const componentBrowserStrings = {
  title: 'Component Library',
  description: 'Find a building block. Explore its behavior. Make it your own.',
  eyebrow: 'THE PORTAL TOOLKIT',
  catalog: 'All Components',
  back: 'Back To Catalog',
  search: 'Search Components',
  searchPlaceholder: 'Search by name or use case…',
  clearSearch: 'Clear Component Search',
  navigation: 'Component Categories',
  open: (name: string) => `Explore ${name}`,
  results: (count: number) =>
    `${count} Component ${count === 1 ? 'Family' : 'Families'}`,
  preview: 'Interactive Preview',
  previous: 'Previous Family',
  next: 'Next Family',
  emptyTitle: 'No Components Found',
  emptyDescription: 'Try another term or browse all categories.',
  reset: 'Clear Search And Filters',
  localTitle: 'A Local Playground',
  localDescription:
    'Examples use local state. Change values, open menus, and explore states without affecting workspace data.',
  categories: {
    all: 'All Components',
    foundations: 'Foundations',
    inputs: 'Inputs And Selection',
    data: 'Data And Navigation',
    feedback: 'Feedback And Layers',
    media: 'Media And Editing',
  },
  categoryHints: {
    all: 'The complete toolkit, organized around the work you need to do.',
    foundations:
      'Theme, motion, and the building blocks of a consistent interface.',
    inputs: 'Capture values, make choices, and guide people through forms.',
    data: 'Present records, move between views, and act on collections.',
    feedback: 'Explain what is happening and help people move forward.',
    media: 'Work with files, images, rich content, and reviewed suggestions.',
  },
  keywords: {
    theme: 'appearance light dark palette',
    foundations: 'icons typography colors tokens avatar',
    motion: 'animation transition reduced',
    patterns: 'page header breadcrumb directory pagination',
    buttons: 'button icon action cta',
    inputs: 'input password textarea field money color timezone address',
    values:
      'slider range number stepper progress meter activity skeleton loading',
    interactions: 'date accordion rating star reaction bookmark carousel',
    selection: 'checkbox radio switch select dropdown',
    tiles: 'radio card chip selection',
    cards: 'card metric quick actions',
    sections: 'form section actions',
    feedback: 'message badge tooltip popover modal alert sheet toast',
    empty: 'empty error recovery loading',
    table: 'table columns sorting records',
    collections: 'list reorder drag stepper tabs',
    editing: 'markdown editor assistant chat draft',
    media: 'image mosaic preview media file',
    avatars: 'avatar group person profile initials presence',
    uploads: 'upload file list attachment dropzone progress retry cancel',
    combobox: 'combobox autocomplete search async options',
    dateRange: 'date range calendar period start end',
    bulk: 'table selection bulk action select all checkbox',
  },
};

export const portalOverlayMotionStrings = {
  title: 'Overlay Motion',
  description: 'Each theme sets its own motion for dialogs, sheets, menus, and toasts. Customize it here for this browser.',
  durationLabel: 'Entrance Duration',
  durationHint: 'Override entrance timing for all surfaces. Reset to restore each theme’s individual timings.',
  exitDurationLabel: 'Exit Duration',
  exitDurationHint: 'How quickly overlays leave. Theme defaults close faster than they open.',
  scaleLabel: 'Starting Size',
  scaleHint: '100% keeps the overlay at its final size. Smaller values add a gentle zoom.',
  travelLabel: 'Travel Distance',
  travelHint: 'Dialog travel in pixels, or extra distance beyond the edge for sheets and toasts.',
  feelLabel: 'Motion Feel',
  feelHint: 'Choose the character of the entrance.',
  smooth: 'Smooth',
  spring: 'Spring',
  snappy: 'Snappy',
  reset: 'Use Theme Defaults',
  custom: 'Custom Settings',
  theme: 'Theme Defaults',
  savedHint: 'Applies to dialogs, sheets, menus, and toasts throughout the app.',
  reducedTitle: 'Reduced Motion Is Active',
  reducedHint: 'Entrances stay still while your saved or device preference reduces motion. You can keep adjusting these settings for later.',
  disabledTitle: 'Overlay Motion Is Off',
  disabledHint: 'Use theme defaults to turn overlay entrances back on. Reduced motion preferences will still take priority.',
  previewTitle: 'Try Your Entrance',
  previewHint: 'Open an overlay to preview your saved settings.',
  previewToast: 'Preview Toast',
  previewAlert: 'Preview Alert',
  previewSheet: 'Preview Sheet',
  previewToastTitle: 'A Little Motion, Your Way',
  previewToastDescription: 'This toast uses your saved entrance settings.',
  previewAlertTitle: 'Your Alert Entrance',
  previewAlertDescription: 'This alert uses the same entrance as alerts throughout your workspace.',
  previewSheetTitle: 'Your Sheet Entrance',
  previewSheetDescription: 'This panel uses your saved entrance settings.',
  previewSheetBody: 'Sheets enter from their attached edge and use a shorter exit when you close them.',
  close: 'Close',
  failedTitle: 'Could Not Save Motion',
  failedHint: 'Your changes are still here. Try saving again before previewing them.',
  retry: 'Try Saving Again',
};

// Demo Accounts And Developer Settings

export const portalDemoStrings = {
  simulationActive: 'Demo Simulation Is Active',
  normalResponses: 'Use Normal Responses',
  simulationRestoreFailedHint: 'We could not restore normal responses. Try again.',
  simulationDescription: (scenario: string, milliseconds: number) =>
    `This browser is simulating ${scenario.toLowerCase()} responses${milliseconds ? ` with an artificial ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(milliseconds / 1000)}-second delay` : ''}. Normal responses keep your demo data and remove the simulation.`,
  latencyHint: 'Enter a whole number from 0 to 5000 milliseconds.',
  notificationsAvailableHint:
    'Preview notification opt-in for this account. No browser permission or external message is requested.',
  notificationsEnabledHint:
    'Simulated notifications are enabled for this account. No external messages are sent.',
  title: 'Developer Settings',
  description:
    'Preview local accounts, request states, and repeatable setup flows.',
  presetsTitle: 'Demo Accounts',
  presetsDescription:
    'Each account has its own records. All accounts use password123.',
  seedPasswordData: 'password123',
  accountsData: {
    empty: {
      label: 'New User',
      description: 'Completed setup with no private records.',
      email: 'new@example.com',
      firstName: 'Jamie',
      lastName: 'New',
    },
    populated: {
      label: 'Populated User',
      description: 'A workspace with saved requests and activity.',
      email: 'sako@example.com',
      firstName: 'Sako',
      lastName: 'Template',
    },
    onboarding: {
      label: 'Onboarding',
      description: 'Restart setup when you choose this account.',
      email: 'onboarding@example.com',
      firstName: 'Alex',
      lastName: 'Welcome',
    },
    admin: {
      label: 'Admin',
      description: 'Manage shared content and workspace operations.',
      email: 'admin@example.com',
      firstName: 'Morgan',
      lastName: 'Admin',
    },
    superadmin: {
      label: 'SuperAdmin',
      description: 'Manage accounts and platform access.',
      email: 'superadmin@example.com',
      firstName: 'Taylor',
      lastName: 'Owner',
    },
  },
  selectAccount: 'Choose An Account',
  signInPreset: 'Open Demo Account',
  runtimeTitle: 'Runtime',
  runtimeDescription: 'Changing runtime signs you out and clears cached data.',
  demoModeLabel: 'Demo Mode',
  demoModeDescription:
    'Demo data stays in this server process. External integrations are disabled.',
  demoModeStatus: 'Demo Mode',
  liveModeStatus: 'Live Mode',
  scenarioTitle: 'Request Simulation',
  scenarioDescription:
    'Empty responses leave saved data intact. Loading finishes after a bounded delay.',
  scenarioLabel: 'Scenario',
  latencyLabel: 'Latency In Milliseconds',
  scenarios: {
    populated: 'Populated',
    loading: 'Loading',
    empty: 'Empty',
    error: 'Error',
  },
  applyAction: 'Apply Settings',
  savedTitle: 'Settings Saved',
  savedDescription: 'The next request uses these settings.',
  roleTitle: 'Switch Account',
  roleDescription: 'Open another demo account with independently owned data.',
  roleUnavailableDescription: 'Switching accounts is available in demo mode.',
  accountLabel: 'Account',
  switchAction: 'Switch Account',
  roleConfirmationTitle: 'Switch Demo Account',
  roleConfirmationDescription:
    'Unsaved work will be discarded and cached data cleared.',
  resetTitle: 'Reset Demo Data',
  resetDescription:
    'Restore all registered fixtures and remove accounts created during this demo session.',
  resetAction: 'Reset Demo Data',
  resetConfirmationTitle: 'Reset Demo Data',
  resetConfirmationDescription:
    'This resets local demo records for every demo account and invalidates other demo sessions.',
  cancelAction: 'Cancel',
  errorTitle: 'Unable To Save',
  errorDescription: 'Your selections are preserved. Try again.',
  unavailableHint: 'Developer settings are unavailable.',
  demoRequiredHint: 'This action requires an authenticated demo session.',
  accountUnavailableHint:
    'This demo account is unavailable. Reset the demo data to restore it.',
  simulatedErrorHint:
    'The demo request failed. Choose another scenario to continue.',
  signupHint:
    'New demo accounts begin setup and remain available until the demo data is reset.',
} as const;

// Project CLI

// PROJECT_INITIALIZER_COPY_START
export const projectInitializerCopy = {
  helpBody: 'Portal Project Initializer\n\nUsage: npm run initialize -- [options]\n\nWithout flags, a terminal opens the guided setup. Use --yes for defaults.\n\n  --profile minimal|internal-tool|saas|content\n  --name <name>                 Product name\n  --slug <slug>                 Lowercase product identifier\n  --description <text>          Product description\n  --theme portal|studio|atelier|blueprint|arcade|dusk|cupertino\n  --mode light|dark\n  --modules <comma-separated>   Enabled capability IDs; use none for no modules\n  --navigation <IDs>            Ordered visible destinations; use none to hide all\n  --starter-data populated|empty\n  --environment demo|live       Defaults to demo\n  --api-url <url>               Required for live; no credentials/query/hash\n  --app-origin <url>            Optional canonical public origin\n  --firebase-api-key <key>      Required for live; never printed\n  --logo <local-file>           SVG, PNG, WebP, JPEG, or GIF\n  --icon <local-file>           PNG, WebP, JPEG, GIF, or ICO\n  --dry-run, --preview          Validate and preview without writing\n  --yes, --non-interactive      Accept defaults without prompts\n  --force                      Explicitly replace owned settings and .env.local\n  --help\n\nCapability IDs: dashboard, users, featureRequests, chat, backgroundJobs, publishing, media, notifications, accountTools, onboarding, engagement.\nNavigation IDs: dashboard, users, featureRequests, chat, backgroundJobs, publishing, notifications, saved, profile, appearance, account, help.\nLive credentials can instead be passed through PORTAL_INITIALIZER_FIREBASE_API_KEY. Existing environment files are never read.\n',
  prompts: {
    profile: 'Profile',
    name: 'Product Name',
    slug: 'Product Slug',
    description: 'Product Description',
    theme: 'Default Theme',
    mode: 'Default Mode',
    modules: 'Enabled Modules (Comma-Separated IDs Or none)',
    navigation: 'Navigation Order (Comma-Separated IDs Or none)',
    starterData: 'Starter Data',
    environment: 'Environment',
    logo: 'Local Logo Path (Optional)',
    icon: 'Local Icon Path (Optional)',
    apiUrl: 'Live Backend API URL',
    appOrigin: 'Public App Origin (Optional)',
  },
  promptBody: '{label} [{value}]: ',
  errorBody: 'Initialization stopped: {detail}',
  validationBody: 'Invalid {field}. {hint}',
  unknownOptionBody: 'Unknown or repeated option: {option}. Run with --help.',
  missingValueBody: 'Option {option} needs a value.',
  choiceHint: 'Choose one of: {choices}.',
  textHint: 'Use between 1 and {maximum} printable characters.',
  slugHint: 'Use lowercase letters and numbers separated by single hyphens, at most 64 characters.',
  listHint: 'Use unique comma-separated IDs from: {choices}; or none.',
  dependencyHint: 'Navigation item {item} requires module {module}.',
  urlHint: 'Use an absolute HTTP(S) URL without credentials, query, or fragment.',
  originHint: 'Use an HTTP(S) origin without a path, credentials, query, or fragment.',
  liveHint: 'Live mode requires --api-url and --firebase-api-key (or PORTAL_INITIALIZER_FIREBASE_API_KEY).',
  assetHint: 'Use an existing non-symlink local image file up to 5 MiB with a supported extension and matching image signature. SVG logos must contain no active or external content.',
  rootHint: 'Run this command from the Portal project root with package.json, src/strings.ts, .env.example, and src/config/projectConfiguration.ts.',
  catalogHint: 'The initializer catalog markers must contain a single literal export. Restore the catalog block before retrying.',
  existingHint: 'Existing environment, initialized state, custom project settings, or brand assets would be replaced. Review --dry-run and pass --force to explicitly replace them.',
  pathHint: 'A managed destination is outside the project, is a symlink, or is not a regular file/directory. Restore a safe project path before retrying.',
  concurrentHint: 'Another initialization is running or the project changed during preparation. Retry after it finishes.',
  writeHint: 'A filesystem operation failed. Applied changes were rolled back; check permissions and retry.',
  rollbackHint: 'A filesystem operation failed and rollback needs attention. Recover files from {directory} before retrying.',
  cancelledHint: 'Setup was cancelled. No files were changed.',
  terminalHint: 'Use --yes with explicit options in a non-interactive shell, or run in a terminal.',
  previewTitle: 'Project Initialization Preview',
  previewBody: '{plan}',
  dryRunBody: 'Dry run complete. No files were changed. Existing environment values and secrets were not read or printed.',
  completeBody: 'Project initialized. Run npm run dev, then open http://localhost:3001. See docs/PROJECT_INITIALIZER.md for next steps.',
  liveBody: 'Live environment created with a generated server-only session secret. Configure your backend and verify its contract before deployment.',
  overwriteBody: 'Existing managed files will be replaced because --force was supplied.',
  planLabels: {
    profile: 'Profile',
    name: 'Product Name',
    slug: 'Product Slug',
    description: 'Product Description',
    theme: 'Default Theme',
    mode: 'Default Mode',
    modules: 'Enabled Modules',
    navigation: 'Navigation Order',
    starterData: 'Starter Data',
    environment: 'Environment',
    files: 'Files To Write',
    credential: 'Firebase Key Provided',
    force: 'Replace Existing Settings',
  },
};

// PROJECT_INITIALIZER_COPY_END
export const shareCommandCopy = {
  helpBody: 'Usage: npm run share -- [--port 3001] [--help]\nStarts Portal and a temporary Cloudflare tunnel. Control + C stops both.\nSHARE_PORT changes the local port. SHARE_ALLOWED_EMAILS restricts visitors to comma-separated emails.\nInstall cloudflared first: brew install cloudflared\nUses the usual development .env files; PORTAL_APP_ORIGIN is set for this process only.',
  startingBody: 'Starting a temporary Cloudflare link…',
  readyBody: 'Portal is ready: {url}\nLocal port: {port}. Keep this terminal and computer running. Press Control + C to stop sharing.',
  publicBody: 'Anyone with this link can reach the app. Use demo data for previews, or set SHARE_ALLOWED_EMAILS to require an email code.',
  protectedBody: 'Visitors must verify an allowed email address before accessing this link.',
  stoppingBody: 'Stopping the tunnel and the development server…',
  optionsHint: 'Use npm run share -- --port 3001 or npm run share -- --help.',
  invalidPortHint: 'Choose a port between 1 and 65535.',
  installHint: 'Install cloudflared first: brew install cloudflared. Alternatively, set CLOUDFLARED_PATH to its executable.',
  portHint: 'Port {port} is unavailable. Stop the existing server or choose another port; sharing will not reuse it.',
  childHint: 'Could not start {name}. Check its installation and local configuration.',
  exitHint: '{name} stopped unexpectedly ({code}). Stopping the remaining sharing processes.',
  tunnelHint: 'Cloudflare did not connect within 90 seconds. Check your internet connection and cloudflared version, then retry.',
  serverHint: 'The app did not become ready within 120 seconds. Check the server output above, then retry.',
  unexpectedHint: 'Sharing could not start. Check the local configuration and retry.',
};
