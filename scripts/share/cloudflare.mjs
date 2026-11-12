import { spawnSync } from 'node:child_process';
import { devNull } from 'node:os';

export function cloudflareEnvironment() {

  // Quick Tunnels must not inherit an existing named tunnel or its token.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('TUNNEL_')));
  return env;

}

export function requireCloudflared(env) {

  const command = env.CLOUDFLARED_PATH || 'cloudflared';
  const result = spawnSync(command, ['--version'], { env, stdio: 'ignore', timeout: 5000 });
  if (result.error || result.status !== 0) { throw new Error('installHint'); }
  return command;

}

export async function startTunnel(processes, command, env, port) {

  const args = ['tunnel', '--config', devNull, '--no-autoupdate', '--url', `http://127.0.0.1:${port}`, '--protocol', 'http2'];
  if (env.SHARE_ALLOWED_EMAILS?.trim()) { args.push('--allowed-mail', env.SHARE_ALLOWED_EMAILS.trim()); }
  const child = processes.start('cloudflared', command, args, env, true);
  let output = '';
  let publicUrl;
  let connected = false;
  const consume = (chunk) => {

    output = (output + chunk.toString()).slice(-32000);
    publicUrl ||= output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com\b/)?.[0];
    connected ||= output.includes('Registered tunnel connection');

  };
  child.stdout.on('data', consume);
  child.stderr.on('data', consume);
  await processes.waitFor(() => publicUrl && connected, 90000, 'tunnelHint');
  return publicUrl;

}
