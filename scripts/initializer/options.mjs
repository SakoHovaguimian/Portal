import { formatInitializerCopy } from './catalog.mjs';
import { createModules, defaultConfiguration, moduleIds, navigationModules, profiles, themeIds, visibleNavigation } from './configuration.mjs';

const booleanOptions = new Set(['help', 'yes', 'non-interactive', 'force', 'dry-run', 'preview']);
const valueOptions = new Set(['profile', 'name', 'slug', 'description', 'theme', 'mode', 'modules', 'navigation', 'starter-data', 'environment', 'api-url', 'app-origin', 'firebase-api-key', 'logo', 'icon']);

export function initializerError(key, values = {}) {

  const error = new Error(key);
  error.values = values;
  return error;

}

export function parseOptions(argumentsList) {

  const options = {};
  for (let index = 0; index < argumentsList.length; index++) {

    const argument = argumentsList[index];
    const match = /^--([a-z-]+)(?:=(.*))?$/.exec(argument);
    if (!match || (!booleanOptions.has(match[1]) && !valueOptions.has(match[1]))) { throw initializerError('unknownOptionBody', { option: match ? `--${match[1]}` : '--' }); }
    const key = match[1];
    if (Object.hasOwn(options, key)) { throw initializerError('unknownOptionBody', { option: `--${key}` }); }
    if (booleanOptions.has(key)) {

      if (match[2] !== undefined) { throw initializerError('unknownOptionBody', { option: `--${key}` }); }
      options[key] = true;
      continue;

    }
    const value = match[2] ?? argumentsList[++index];
    if (!value || value.startsWith('--')) { throw initializerError('missingValueBody', { option: `--${key}` }); }
    options[key] = value;

  }
  return options;

}

export function choice(value, choices, field, copy) {

  if (!choices.includes(value)) { throw initializerError('validationBody', { field, hint: formatInitializerCopy(copy, 'choiceHint', { choices: choices.join(', ') }) }); }
  return value;

}

function text(value, maximum, field, copy) {

  if (!value || value.length > maximum || /[\x00-\x1f\x7f\u2028\u2029]/.test(value)) { throw initializerError('validationBody', { field, hint: formatInitializerCopy(copy, 'textHint', { maximum }) }); }
  return value;

}

function list(value, choices, field, copy) {

  if (value === 'none') { return []; }
  const values = value.split(',').map((item) => item.trim());
  if (new Set(values).size !== values.length || values.some((item) => !choices.includes(item))) { throw initializerError('validationBody', { field, hint: formatInitializerCopy(copy, 'listHint', { choices: choices.join(', ') }) }); }
  return values;

}

function url(value, origin, field, copy) {

  if (!value) { return ''; }
  let parsed;
  try { parsed = new URL(value); } catch { throw initializerError('validationBody', { field, hint: copy[origin ? 'originHint' : 'urlHint'] }); }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || /[\s\x00-\x1f\x7f]/.test(value) || (origin && parsed.pathname !== '/')) { throw initializerError('validationBody', { field, hint: copy[origin ? 'originHint' : 'urlHint'] }); }
  return origin ? parsed.origin : parsed.toString().replace(/\/$/, '');

}

export function buildSettings(options, copy, defaultIdentity) {

  const configuration = defaultConfiguration();
  const profile = choice(options.profile || 'saas', Object.keys(profiles), 'profile', copy);
  const name = text((options.name || defaultIdentity.name).trim(), 80, 'name', copy);
  const slug = options.slug || name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) { throw initializerError('validationBody', { field: 'slug', hint: copy.slugHint }); }
  const identity = {
    name,
    description: text((options.description || defaultIdentity.description).trim(), 300, 'description', copy),
  };
  configuration.profile = profile;
  configuration.slug = slug;
  configuration.appearance = {
    themeId: choice(options.theme || 'portal', themeIds, 'theme', copy),
    mode: choice(options.mode || 'light', ['light', 'dark'], 'mode', copy),
  };
  configuration.modules = createModules(options.modules ? list(options.modules, moduleIds, 'modules', copy) : profiles[profile]);
  configuration.navigation = options.navigation ? list(options.navigation, Object.keys(navigationModules), 'navigation', copy) : visibleNavigation(configuration.modules);
  for (const item of configuration.navigation) {

    const capability = navigationModules[item];
    if (capability && !configuration.modules[capability]) { throw initializerError('validationBody', { field: 'navigation', hint: formatInitializerCopy(copy, 'dependencyHint', { item, module: capability }) }); }

  }
  configuration.starterData = choice(options['starter-data'] || (profile === 'minimal' ? 'empty' : 'populated'), ['populated', 'empty'], 'starter-data', copy);
  const environment = choice(options.environment || 'demo', ['demo', 'live'], 'environment', copy);
  const apiUrl = url(options['api-url'], false, 'api-url', copy);
  const appOrigin = url(options['app-origin'], true, 'app-origin', copy);
  const firebaseApiKey = options['firebase-api-key'] || process.env.PORTAL_INITIALIZER_FIREBASE_API_KEY || '';
  if (firebaseApiKey && !/^[A-Za-z0-9_-]{10,200}$/.test(firebaseApiKey)) { throw initializerError('validationBody', { field: 'firebase-api-key', hint: copy.liveHint }); }
  if (environment === 'live' && (!apiUrl || !firebaseApiKey)) { throw initializerError('validationBody', { field: 'environment', hint: copy.liveHint }); }
  return { configuration, identity, environment, apiUrl, appOrigin, firebaseApiKey, logo: options.logo, icon: options.icon };

}
