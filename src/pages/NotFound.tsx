import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <section className="flex min-h-[80vh] items-center bg-ink-950 pt-20 gold-glow">
      <EmptyState
        tone="dark"
        headingLevel="h1"
        icon={Compass}
        title="This page has wandered off"
        description="The page you are looking for doesn’t exist or has moved. Let us take you somewhere beautiful instead."
        action={
          <>
            <ButtonLink to="/" variant="gold">
              Return home
            </ButtonLink>
            <ButtonLink to="/shop" variant="outline">
              Browse the shop
            </ButtonLink>
          </>
        }
      />
    </section>
  );
}
