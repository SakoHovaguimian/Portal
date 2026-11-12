import { portalModules } from '@/config/portalModules';
import { DomainError } from '@/errors/domainErrors';
import type { IdRouteProps } from '@/models/idRouteProps';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { readDemoPublicImage } from '@/services/media/server/demoPublicImages';

// **************************************
// MARK: - READ DEMO PUBLIC IMAGE
// **************************************

export async function GET(
  _request: Request,
  { params }: IdRouteProps,
) {

  if (!portalModules.media || !(await getEffectiveRuntime()).demoMode) { return new Response(null, { status: 404 }); }
  try {
    return readDemoPublicImage((await params).id);
  } catch (error) {

    if (error instanceof DomainError) {

      return Response.json(
        { message: error.message },
        { status: error.status },
      );

    }
    throw error;

  }

}
