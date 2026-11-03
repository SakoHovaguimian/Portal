import { getContainer } from '@/container';
import { NotFoundError, OwnershipError } from '@/errors/domainErrors';
import { errorResponse, trustedMutation } from '@/services/api/routeSafety';
import {
  isDevSettingsAvailable,
  writeDemoSettings,
} from '@/services/demo/demoRuntime';
export async function POST(request: Request) {
  try {
    if (!isDevSettingsAvailable()) throw new NotFoundError();
    if (!trustedMutation(request)) throw new OwnershipError();
    const container = await getContainer();
    await writeDemoSettings({
      demoMode: true,
      scenario: 'populated',
      latencyMs: 0,
    });
    await container.sessionService.delete();
    return Response.json(
      { demoMode: true },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
