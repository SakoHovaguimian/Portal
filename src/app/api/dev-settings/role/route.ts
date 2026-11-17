import { errorResponse } from '@/services/api/routeSafety';
import { requireDeveloperAccess } from '@/services/demo/demoDevAccess';
import { createDemoIdentitySession } from '@/services/demo/demoIdentity';
import { getDemoState } from '@/services/demo/demoState';
import { DemoRoleInputSchema } from '@/services/demo/models/demoRoleInput';

// **************************************
// MARK: - SWITCH DEMO ACCOUNT ROLE
// **************************************

export async function POST(request: Request) {

  try {

    const { container, session } = await requireDeveloperAccess(request, true);
    const { role } = DemoRoleInputSchema.parse(await request.json());
    const replacement = await createDemoIdentitySession(role);
    getDemoState().refreshTokens.delete(session.auth.refreshToken);
    await container.sessionService.create(replacement);
    return Response.json(container.sessionService.toPublic(replacement), {
      headers: { 'cache-control': 'no-store' },
    });

  } catch (error) {
    return errorResponse(error);
  }

}
