import { ACTIVATION_GRAPHIC_HTML } from './render-graphics';

export function injectActivationGraphic(html: string): string {
  const marker = 'src="{{ACTIVATION_IMAGE}}"';
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return html;
  const tagStart = html.lastIndexOf('<img', markerIndex);
  const tagEnd = html.indexOf('>', markerIndex);
  if (tagStart < 0 || tagEnd < 0) return html;
  return `${html.slice(0, tagStart)}${ACTIVATION_GRAPHIC_HTML}${html.slice(tagEnd + 1)}`;
}
