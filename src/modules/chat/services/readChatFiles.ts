import { portalChatStrings as copy } from '@/strings';
import { ValidationError } from '@/errors/domainErrors';
import { CHAT_ATTACHMENT_LIMIT, CHAT_ATTACHMENT_TYPES, type ChatAttachmentInput } from '../models/chatAttachment';
import type { UploadFile } from '@/components/ui';
// **************************************
// MARK: - ENCODE CHAT ATTACHMENTS
// **************************************

export async function readChatFiles(files: UploadFile[]): Promise<ChatAttachmentInput[]> {

  const attachments = await Promise.all(files.map(async (item) => {

    const file = item.file;
    if (!file || file.size > CHAT_ATTACHMENT_LIMIT || !CHAT_ATTACHMENT_TYPES.includes(file.type as typeof CHAT_ATTACHMENT_TYPES[number])) {
      throw new ValidationError(copy.validation.attachment);
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    for (let index = 0; index < bytes.length; index += 8192) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
    }
    return {
      name: file.name,
      mimeType: file.type as typeof CHAT_ATTACHMENT_TYPES[number],
      size: file.size,
      data: btoa(binary),
    };

  }));

  return attachments;

}
