import { getContainer } from '@/container';
import { OwnershipError } from '@/errors/domainErrors';
import { errorResponse, trustedMutation } from '@/services/api/routeSafety';
import { strings } from '@/strings';

// **************************************
// MARK: - LOG OUT SERVER SESSION
// **************************************

export async function POST(request: Request) {

  try {

    if (!trustedMutation(request)) { throw new OwnershipError(strings.errors.untrusted); }
    await (await getContainer()).sessionService.delete();
    return new Response(null, {
      status: 204,
      headers: { 'cache-control': 'no-store' },
    });

  } catch (error) {
    return errorResponse(error);
  }

}
