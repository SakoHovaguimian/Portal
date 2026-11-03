import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { createModules, profiles, visibleNavigation } from './configuration.mjs';
import { formatInitializerCopy } from './catalog.mjs';
import { initializerError } from './options.mjs';

export async function promptOptions(copy, identity) {

  if (!stdin.isTTY || !stdout.isTTY) { throw initializerError('terminalHint'); }
  const terminal = createInterface({ input: stdin, output: stdout });
  const options = {};
  const defaults = {
    profile: 'saas',
    name: identity.name,
    description: identity.description,
    theme: 'portal',
    mode: 'light',
    'starter-data': 'populated',
    environment: 'demo',
    logo: '',
    icon: '',
  };
  try {

    for (const key of ['profile', 'name', 'slug', 'description', 'theme', 'mode', 'modules', 'navigation', 'starter-data', 'environment', 'logo', 'icon']) {

      const enabled = profiles[options.profile || 'saas'] || profiles.saas;
      if (key === 'slug') { defaults.slug = options.name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
      if (key === 'modules') { defaults.modules = enabled.join(','); }
      if (key === 'navigation') {

        const modules = options.modules === 'none' ? [] : options.modules.split(',').map((id) => id.trim());
        defaults.navigation = visibleNavigation(createModules(modules)).join(',') || 'none';

      }
      if (key === 'starter-data' && options.profile === 'minimal') { defaults[key] = 'empty'; }
      const label = copy.prompts[key === 'starter-data' ? 'starterData' : key];
      const answer = await terminal.question(formatInitializerCopy(copy, 'promptBody', { label, value: defaults[key] }));
      if (answer.trim() || defaults[key]) { options[key] = answer.trim() || defaults[key]; }

    }
    if (options.environment === 'live') {

      for (const [key, label] of [['api-url', copy.prompts.apiUrl], ['app-origin', copy.prompts.appOrigin]]) {

        const answer = await terminal.question(formatInitializerCopy(copy, 'promptBody', { label, value: '' }));
        if (answer.trim()) { options[key] = answer.trim(); }

      }

    }
    return options;

  } catch {
    throw initializerError('cancelledHint');
  } finally { terminal.close(); }

}
