import { useEffect } from 'react';

const SUFFIX = 'Sindhoora Jewels';
const DEFAULT_DESCRIPTION =
  'Sindhoora Jewels — antique and temple jewellery curated by Soumya. Where elegance becomes a legacy.';

/** Sets the page title and meta description for the current route. */
export function useDocumentTitle(title: string | undefined, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : `${SUFFIX} | Signature by Soumya`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description ?? DEFAULT_DESCRIPTION;
  }, [title, description]);
}
