import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { uploadPublicImage } from './uploadPublicImage';

export class PublicImageService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - UPLOAD PUBLIC IMAGE
  // **************************************

  upload(file: File, signal?: AbortSignal) {
    return uploadPublicImage(this.api, file, '/media/images', signal);
  }

}
