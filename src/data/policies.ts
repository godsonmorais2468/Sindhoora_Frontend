// Placeholder policy copy for the prototype — to be reviewed and replaced by the business.

export interface Policy {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

export const policies: Policy[] = [
  {
    slug: 'shipping',
    title: 'Shipping',
    summary: 'Every piece is insured, discreetly packed and shipped across India.',
    sections: [
      { heading: 'Delivery times', body: 'In-stock pieces are dispatched within 2 working days and usually arrive within 3–7 working days, depending on your pincode.' },
      { heading: 'Shipping charges', body: 'Shipping is complimentary on orders above ₹10,000. A flat insured shipping fee of ₹250 applies to smaller orders.' },
      { heading: 'Packaging', body: 'Each piece arrives in a Sindhoora keepsake box inside tamper-evident outer packaging. Orders above ₹50,000 require an OTP at delivery.' },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns',
    summary: 'If a piece is not right for you, we will make it right.',
    sections: [
      { heading: '7-day returns', body: 'Unworn pieces in their original packaging may be returned within 7 days of delivery for a full refund or exchange.' },
      { heading: 'How to return', body: 'Write to us or message us on WhatsApp with your order number. We will arrange an insured pickup from your address.' },
      { heading: 'Exceptions', body: 'Customised and altered pieces, and earrings for hygiene reasons, cannot be returned unless they arrive damaged.' },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    summary: 'We only collect what we need to serve you, and we never sell your data.',
    sections: [
      { heading: 'What we collect', body: 'Your name, contact details and delivery address, used only to process and deliver your orders and to answer your enquiries.' },
      { heading: 'Payments', body: 'Payments will be processed by a certified payment provider. Sindhoora never stores card details.' },
      { heading: 'Your choices', body: 'You can unsubscribe from our emails at any time, and ask us to delete your information by writing to us.' },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms',
    summary: 'The terms that apply when you shop with Sindhoora Jewels.',
    sections: [
      { heading: 'Product details', body: 'Handcrafted pieces can vary slightly in finish and weight from the photographs. Weights listed are approximate.' },
      { heading: 'Pricing', body: 'All prices are in Indian Rupees and include applicable taxes. Prices may change without notice, but never after an order is confirmed.' },
      { heading: 'Orders', body: 'An order is confirmed once you receive a confirmation from us. We may cancel and fully refund an order if a piece becomes unavailable.' },
    ],
  },
];
