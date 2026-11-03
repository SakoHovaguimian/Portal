import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { readDemoPublicImage } from '@/services/media/server/demoPublicImages';
import { DomainError } from '@/errors/domainErrors';
import { portalModules } from '@/config/portalModules';
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!portalModules.media || !(await getEffectiveRuntime()).demoMode)
    return new Response(null, { status: 404 });
  try {
    return readDemoPublicImage((await params).id);
  } catch (error) {
    if (error instanceof DomainError)
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    throw error;
  }
}
