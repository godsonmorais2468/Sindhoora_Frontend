/**
 * Every remote image used by the prototype lives here.
 * Photos are from Unsplash (free licence) and are served via its image CDN.
 * Components never build image URLs themselves — they size these via `utils/image.ts`.
 *
 * When the Django backend lands, product images will come from the API instead;
 * editorial images can move to the CMS or `public/assets`.
 */

interface FocalPoint {
  /** 0–1 horizontal focal point */
  x: number;
  /** 0–1 vertical focal point */
  y: number;
  /** Zoom factor for detail crops (1 = none) */
  zoom?: number;
}

function unsplash(photoId: string, focal?: FocalPoint): string {
  const params = new URLSearchParams({ fit: 'crop' });
  if (focal) {
    params.set('crop', 'focalpoint');
    params.set('fp-x', String(focal.x));
    params.set('fp-y', String(focal.y));
    if (focal.zoom && focal.zoom !== 1) params.set('fp-z', String(focal.zoom));
  }
  return `https://images.unsplash.com/${photoId}?${params.toString()}`;
}

/** A full view plus a close-up of the same piece — gives every product a real detail shot. */
function withDetail(photoId: string, focal: FocalPoint, zoom = 2): string[] {
  return [unsplash(photoId, { x: focal.x, y: focal.y }), unsplash(photoId, { ...focal, zoom })];
}

export const editorialImages = {
  hero: unsplash('photo-1601121141412-75c39efebac9', { x: 0.62, y: 0.5 }),
  heroMobile: unsplash('photo-1601121141412-75c39efebac9', { x: 0.42, y: 0.55 }),
  brandIntro: unsplash('photo-1788889488698-136eda40797a', { x: 0.45, y: 0.5 }),
  heritage: unsplash('photo-1710552524607-a34efe984194', { x: 0.5, y: 0.5 }),
  craftDetail: unsplash('photo-1740416649851-e16cff7d4f9a', { x: 0.5, y: 0.45 }),
  portrait: unsplash('photo-1751606615009-30f61ff1a510', { x: 0.5, y: 0.35 }),
  newsletter: unsplash('photo-1601121141499-17ae80afc03a', { x: 0.5, y: 0.6 }),
  contact: unsplash('photo-1600862754152-80a263dd564f', { x: 0.3, y: 0.4 }),
  pageHeader: unsplash('photo-1601121141461-9d6647bca1ed', { x: 0.5, y: 0.5 }),
} as const;

export const productImages = {
  lakshmiTempleNecklace: withDetail('photo-1601121141122-e62a764f15c9', { x: 0.45, y: 0.55 }),
  antiqueKasuMala: withDetail('photo-1626784215013-13322cb0e471', { x: 0.5, y: 0.5 }),
  rubyHeritageHaram: withDetail('photo-1601121141461-9d6647bca1ed', { x: 0.42, y: 0.6 }),
  mangoDesignNecklace: withDetail('photo-1601121141499-17ae80afc03a', { x: 0.42, y: 0.65 }),
  templeJhumka: withDetail('photo-1651160670627-2896ddf7822f', { x: 0.5, y: 0.6 }),
  antiqueGoldBangles: withDetail('photo-1758995116383-f51775896add', { x: 0.5, y: 0.5 }),
  lakshmiVaddanam: withDetail('photo-1615957579676-d1db3be6effe', { x: 0.5, y: 0.45 }),
  kempuNecklace: [
    unsplash('photo-1724594746613-3676fae25675', { x: 0.55, y: 0.5 }),
    unsplash('photo-1724594963412-d98c3cd9eab6', { x: 0.5, y: 0.5 }),
    unsplash('photo-1724594746613-3676fae25675', { x: 0.55, y: 0.45, zoom: 2 }),
  ],
  peacockNakshiHaram: withDetail('photo-1721807644561-9efcabee5c42', { x: 0.5, y: 0.5 }),
  heritageChandbali: [
    unsplash('photo-1600862754152-80a263dd564f', { x: 0.8, y: 0.62 }),
    unsplash('photo-1600862754152-80a263dd564f', { x: 0.8, y: 0.62, zoom: 1.8 }),
    unsplash('photo-1600862754152-80a263dd564f', { x: 0.3, y: 0.5 }),
  ],
  antiqueCoinNecklace: withDetail('photo-1601121141461-920cb1993441', { x: 0.5, y: 0.6 }),
  templeDesignEarrings: withDetail('photo-1626784215021-2e39ccf971cd', { x: 0.5, y: 0.5 }),
  rubyStoneJhumka: withDetail('photo-1740416649851-e16cff7d4f9a', { x: 0.5, y: 0.45 }, 1.7),
  keralaNecklace: withDetail('photo-1758995115682-1452a1a9e35b', { x: 0.5, y: 0.45 }),
  antiqueKada: withDetail('photo-1787769499046-8a94b2de1f62', { x: 0.5, y: 0.5 }),
  bridalHaram: withDetail('photo-1742627032795-1dfb552448ce', { x: 0.5, y: 0.5 }),
  lakshmiCoinHaram: withDetail('photo-1721103418312-b0057a8c31c2', { x: 0.5, y: 0.6 }),
  antiquePendantSet: withDetail('photo-1601121141418-c1caa10a2a0b', { x: 0.5, y: 0.55 }),
  templeGoldEarrings: withDetail('photo-1695050049047-54e27a908898', { x: 0.55, y: 0.5 }),
  classicHeritageRing: withDetail('photo-1626784214536-d859187e0bd0', { x: 0.5, y: 0.5 }),
  polkiNecklace: withDetail('photo-1719862057229-4dd650b5ccee', { x: 0.5, y: 0.45 }),
  rubyStoneBangles: withDetail('photo-1617191880362-aac615de3c26', { x: 0.5, y: 0.5 }),
  kempuPendantSet: withDetail('photo-1724594888502-34f2b647ce33', { x: 0.5, y: 0.4 }),
  antiqueFloralRing: withDetail('photo-1611955167811-4711904bb9f8', { x: 0.5, y: 0.5 }),
  goldLaceNecklace: withDetail('photo-1758995115785-d13726ac93f0', { x: 0.5, y: 0.5 }),
  heritageBanglePair: withDetail('photo-1611598935678-c88dca238fce', { x: 0.5, y: 0.5 }),
  antiqueBroochSet: withDetail('photo-1631832721838-44118cd1fad8', { x: 0.5, y: 0.45 }),
} satisfies Record<string, string[]>;

export const categoryImages = {
  temple: productImages.kempuNecklace[0],
  necklaces: productImages.mangoDesignNecklace[0],
  haram: productImages.peacockNakshiHaram[0],
  jhumkas: productImages.templeJhumka[0],
  earrings: productImages.heritageChandbali[0],
  bangles: productImages.antiqueGoldBangles[0],
  bridal: productImages.bridalHaram[0],
  rings: productImages.classicHeritageRing[0],
  accessories: productImages.lakshmiVaddanam[0],
} as const;

export const collectionImages = {
  temple: productImages.rubyHeritageHaram[0],
  bridal: productImages.bridalHaram[0],
  antique: productImages.antiqueKada[0],
  statement: productImages.polkiNecklace[0],
} as const;
