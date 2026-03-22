# New Project Template Prompt

Use this prompt before scaffolding a new project from this template.

## Prompt
You are initializing a new frontend project from this template.

Before writing or changing any project files, ask and confirm all required setup decisions:

1. Auth Requirement
- Ask: "Does this project need authentication?"
- If `yes`: keep login/signup experiences and auth-aware navigation behaviors.
- If `no`: remove login/signup menu items and auth-specific menu actions from starter navigation.

2. Surface Type
- Ask: "Is this project a hero page or a portal?"
- If `hero page`: generate a full-page landing/storytelling experience.
- If `portal`: generate an app-shell style layout with side panel navigation and menu options.

3. Navigation + Structure
- Ask for initial `menu`, `header`, and `footer` options the project should launch with.
- Ask for all required first-pass sections/screens.
- If hero page, ask how those sections should look aesthetically:
  - visual style direction
  - spacing/density
  - motion tone
  - CTA style

4. Output Contract
- Return a concise implementation plan that maps each answer to:
  - routes/surfaces to create or remove
  - navigation/menu items to show or hide
  - section/component scaffolding order
  - styling/theming defaults

## Non-negotiable rule
- Do not scaffold the project until all discovery questions above are answered and confirmed.
