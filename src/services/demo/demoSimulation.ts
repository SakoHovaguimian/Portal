import 'server-only';
import { ApiError } from '@/errors/domainErrors';
import type { DemoContext } from '@/models/demoContext';
import { portalDemoStrings } from '@/strings';

// **************************************
// MARK: - SIMULATE DEMO REQUEST
// **************************************

export async function simulateDemoRequest(
  context: DemoContext,
  signal?: AbortSignal,
) {

  const delay =
    context.scenario === 'loading'
      ? Math.max(context.latencyMs, 2500)
      : context.latencyMs;
  if (delay) {

    await new Promise<void>((resolve, reject) => {

      signal?.throwIfAborted();

      // **************************************
      // MARK: - FINISH SIMULATED DELAY
      // **************************************

      const finish = () => {

        signal?.removeEventListener('abort', abort);
        resolve();

      };
      const timer = setTimeout(finish, delay);

      // **************************************
      // MARK: - ABORT SIMULATED DELAY
      // **************************************

      const abort = () => {

        clearTimeout(timer);
        reject(signal?.reason);

      };
      signal?.addEventListener('abort', abort, { once: true });

    });

  }
  signal?.throwIfAborted();
  if (context.scenario === 'error') { throw new ApiError(portalDemoStrings.simulatedError, 503); }

}
