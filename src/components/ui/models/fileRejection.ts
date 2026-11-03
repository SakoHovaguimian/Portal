export interface FileRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
}
