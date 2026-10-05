import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
}

/** Accessible accordion. Height animates via a grid-rows transition — no JS measurement. */
export function Accordion({ items, defaultOpen, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-charcoal"
              >
                {item.title}
                <Plus
                  className={cn('size-4 shrink-0 text-gold-700 transition-transform duration-300', open && 'rotate-45')}
                  strokeWidth={1.6}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            >
              <div className="overflow-hidden" inert={!open}>
                <div className="pb-6 text-[15px] leading-relaxed text-taupe">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
