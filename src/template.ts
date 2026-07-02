import part01 from './template-bin-01.bin';
import part02 from './template-bin-02.bin';
import part03 from './template-bin-03.bin';
import part04 from './template-bin-04.bin';
import part05 from './template-bin-05.bin';
import part06 from './template-bin-06.bin';
import part07 from './template-bin-07.bin';
import part08 from './template-bin-08.bin';
import part09 from './template-bin-09.bin';
import part10 from './template-bin-10.bin';
import part11 from './template-bin-11.bin';
import restBase64 from './template-rest';

let cachedTemplate: Promise<string> | undefined;

function decodeBase64Parts(value: string | readonly string[]): Uint8Array {
  const parts = typeof value === 'string' ? [value] : value;
  const decodedParts = parts.map((part) => {
    const normalized = part.replace(/\s+/g, '');
    const binary = atob(normalized);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  });

  const totalLength = decodedParts.reduce((total, part) => total + part.byteLength, 0);
  const decoded = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of decodedParts) {
    decoded.set(part, offset);
    offset += part.byteLength;
  }

  return decoded;
}

function restoreTemplateArchive(): Uint8Array {
  const binaryParts = [
    part01,
    part02,
    part03,
    part04,
    part05,
    part06,
    part07,
    part08,
    part09,
    part10,
    part11,
  ];
  const restoredRest = decodeBase64Parts(restBase64);
  const totalLength = binaryParts.reduce((total, part) => total + part.byteLength, 0) + restoredRest.byteLength;
  const restored = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of binaryParts) {
    const bytes = new Uint8Array(part);
    for (let index = 0; index < bytes.length; index += 1) {
      restored[offset + index] = bytes[index] ^ 0xa5;
    }
    offset += bytes.length;
  }

  for (let index = 0; index < restoredRest.length; index += 1) {
    restored[offset + index] = restoredRest[index] ^ 0xa5;
  }
  return restored;
}

export function getProposalTemplate(): Promise<string> {
  if (!cachedTemplate) {
    const bytes = restoreTemplateArchive();
    const archive = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const body = new Response(archive).body;
    if (!body) throw new Error('Unable to read the proposal template archive.');
    const decompressed = body.pipeThrough(new DecompressionStream('gzip'));
    cachedTemplate = new Response(decompressed).text();
  }
  return cachedTemplate;
}
