import { Link, Navigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { policies } from '@/data/policies';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { cn } from '@/utils/helpers';

export default function Policy() {
  const { slug } = useParams();
  const policy = policies.find((p) => p.slug === slug);
  useDocumentTitle(policy?.title, policy?.summary);
  if (!policy) return <Navigate to="/policies/shipping" replace />;

  return (
    <>
      <PageHeader compact eyebrow="Customer care" title={policy.title} description={policy.summary} breadcrumbs={[{ label: 'Home', to: '/' }, { label: policy.title }]} />
      <section className="bg-ivory-50 py-14 text-charcoal sm:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
          <nav aria-label="Policies" className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {policies.map((p) => (
              <Link
                key={p.slug}
                to={`/policies/${p.slug}`}
                aria-current={p.slug === policy.slug ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-sm px-3 py-2 text-[15px] transition-colors',
                  p.slug === policy.slug ? 'bg-white font-medium text-charcoal shadow-sm' : 'text-taupe hover:text-charcoal',
                )}
              >
                {p.title}
              </Link>
            ))}
          </nav>
          <div className="max-w-2xl space-y-10">
            {policy.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-medium">{s.heading}</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-taupe">{s.body}</p>
              </div>
            ))}
            <p className="border-t border-line pt-6 text-sm text-taupe">
              Questions? <Link to="/contact" className="text-charcoal underline underline-offset-4">Contact us</Link> — we are happy to help.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
