import 'server-only';
import { ValidationError } from '@/errors/domainErrors';
import { portalChatStrings as copy } from '@/strings';
import type { ChatAttachmentInput } from '../models/chatAttachment';
// **************************************
// MARK: - VALIDATE CHAT ATTACHMENT CONTENT
// **************************************

export function validateChatAttachment(input: ChatAttachmentInput): Uint8Array {

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input.data)) {
    throw new ValidationError(copy.validation.attachment);
  }
  const bytes = Buffer.from(input.data, 'base64');
  if (bytes.byteLength !== input.size || bytes.toString('base64') !== input.data) {
    throw new ValidationError(copy.validation.attachment);
  }
  const hex = bytes.subarray(0, 12).toString('hex');
  const ascii = bytes.subarray(0, 16).toString('ascii');
  const mime = input.mimeType;
  const valid = (mime === 'image/png' && hex.startsWith('89504e470d0a1a0a')) ||
        (mime === 'image/jpeg' && hex.startsWith('ffd8ff')) ||
        (mime === 'image/gif' && /^GIF8[79]a/.test(ascii)) ||
        (mime === 'image/webp' && ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP') ||
        (mime === 'application/pdf' && ascii.startsWith('%PDF-')) ||
        (mime === 'audio/mpeg' && (ascii.startsWith('ID3') || (bytes[0] === 255 && (bytes[1] & 224) === 224))) ||
        (mime === 'video/mp4' && ascii.slice(4, 8) === 'ftyp') ||
        (mime === 'video/webm' && hex.startsWith('1a45dfa3')) ||
        (mime === 'text/plain' && !bytes.includes(0) && !new TextDecoder('utf-8', { fatal: false }).decode(bytes).includes('\ufffd'));
  if (!valid) {
    throw new ValidationError(copy.validation.attachment);
  }
  return new Uint8Array(bytes);

}
