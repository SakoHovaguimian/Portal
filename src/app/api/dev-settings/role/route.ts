import { z } from 'zod';
import { UserRoleSchema } from '@/models/userRole';
import { errorResponse } from '@/services/api/routeSafety';
import { requireDeveloperAccess } from '@/services/demo/demoDevAccess';
import { createDemoIdentitySession } from '@/services/demo/demoIdentity';
import { getDemoState } from '@/services/demo/demoState';
export async function POST(request: Request) {
  try {
    const { container, session } = await requireDeveloperAccess(request, true);
    const { role } = z
      .object({ role: UserRoleSchema })
      .strict()
      .parse(await request.json());
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
