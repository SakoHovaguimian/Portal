import 'server-only';
import { NotFoundError, ValidationError } from '@/errors/domainErrors';
import { portalMediaStrings as copy } from '@/strings';
import type { DemoPublicImage } from './models/demoPublicImage';
import { validatePublicImageUpload } from './validatePublicImageUpload';

const demoGlobal = globalThis as typeof globalThis & {
  portalDemoPublicImages?: Map<string, DemoPublicImage>;
};

// **************************************
// MARK: - GET DEMO PUBLIC IMAGE STORE
// **************************************

const images = () => (demoGlobal.portalDemoPublicImages ??= new Map());

// **************************************
// MARK: - STORE DEMO PUBLIC IMAGE
// **************************************

export async function uploadDemoPublicImage(
  request: Request,
): Promise<Response> {

  const file = await validatePublicImageUpload(request);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const storedBytes = [...images().values()].reduce(
    (size, image) => size + image.bytes.byteLength,
    0,
  );
  if (images().size >= 20 || storedBytes + bytes.length > 25 * 1024 * 1024) { throw new ValidationError(copy.imageCapacityError); }
  const id = crypto.randomUUID();
  images().set(id, { bytes, type: file.type });
  return Response.json(
    {
      fileName: id,
      thumbnailFileName: null,
      visibility: 'public',
      url: `/api/public/media/${id}`,
      thumbnailUrl: null,
    },
    { status: 201, headers: { 'cache-control': 'no-store' } },
  );

}

// **************************************
// MARK: - READ DEMO PUBLIC IMAGE
// **************************************

export function readDemoPublicImage(id: string): Response {

  const image =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
      ? images().get(id)
      : null;
  if (!image) { throw new NotFoundError(copy.previewUnavailable); }
  return new Response(Buffer.from(image.bytes), {
    headers: {
      'content-type': image.type,
      'content-length': String(image.bytes.length),
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'; sandbox",
    },
  });

}

// **************************************
// MARK: - RESET DEMO PUBLIC IMAGES
// **************************************

export function resetDemoPublicImages() {
  demoGlobal.portalDemoPublicImages = new Map();
}
