const imageMimetype = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const documentMimetype = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/rtf'
]

const videoMimetype = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', 'video/x-ms-wmv', 'video/x-flv', 'video/webm']

const audioMimetype = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'audio/mp4']

const compressedMimetype = ['application/zip', 'application/vnd.rar', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip']

const codeMimetype = [
  'text/html',
  'text/css',
  'application/javascript',
  'application/json',
  'application/xml',
  'application/x-httpd-php',
  'text/x-java-source',
  'text/x-python',
  'text/x-csrc',
  'text/x-c++src'
]

const fontMimetype = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2']

module.exports = {
  imageMimetype,
  documentMimetype,
  videoMimetype,
  audioMimetype,
  compressedMimetype,
  codeMimetype,
  fontMimetype
}
