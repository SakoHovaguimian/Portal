import { errorResponse } from '@/services/api/routeSafety';
import { requireDeveloperAccess } from '@/services/demo/demoDevAccess';
import { createDemoIdentitySession } from '@/services/demo/demoIdentity';
import { demoPresetForUser } from '@/services/demo/demoPresets';
import { resetRegisteredDemoState } from '@/services/demo/demoResetRegistry';
import { writeDemoSettings } from '@/services/demo/demoRuntime';

// **************************************
// MARK: - RESET REGISTERED DEMO DATA
// **************************************

export async function POST(request: Request) {

  try {

    const { container, session } = await requireDeveloperAccess(request, true);
    const preset = demoPresetForUser(session.user.id) ?? 'populated';
    resetRegisteredDemoState();
    await writeDemoSettings({
      demoMode: true,
      scenario: 'populated',
      latencyMs: 0,
    });
    const restored = await createDemoIdentitySession(preset);
    await container.sessionService.create(restored);
    return Response.json(container.sessionService.toPublic(restored), {
      headers: { 'cache-control': 'no-store' },
    });

  } catch (error) {
    return errorResponse(error);
  }

}
