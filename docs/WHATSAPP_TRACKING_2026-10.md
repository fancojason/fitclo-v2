# Fitclo WhatsApp attribution and data gaps (2026-10-20)

The site uses the existing GA4 tag `G-VT6KCKVKPD` in `BaseLayout.astro`. No second tag or GTM container was added.

## Event meaning

- `page_view`: GA4 page visit. It does not imply interest or contact.
- `whatsapp_click`: a user clicked a WhatsApp link or floating WhatsApp control. Parameters: `page_path`, `product_name`, `style_code`, `cta_location`, `source_component` (plus non-personal route context). It does **not** prove that a message was sent.
- `quote_form_submit`: the `/submit` endpoint confirmed acceptance of the quote form. `generate_lead` remains the existing accepted-inquiry event. Neither proves delivery to the inbox or buyer qualification.
- `style_code_copy`: copying a style code succeeded.
- `catalog_search` and `catalog_filter_use`: actual search or filter interactions; the search text is not sent to GA4.

A WhatsApp message sent, a buyer reply, and a qualified inquiry require WhatsApp-side or CRM evidence. Do not infer these from link clicks or from the prefilled text.

In GA4 Admin, confirm the existing web stream receives `whatsapp_click` and `quote_form_submit` in DebugView/Realtime. If reporting by style or CTA is needed, register event-scoped custom dimensions for `style_code`, `product_name`, `cta_location`, and `source_component` on the existing property. Do not register email, phone, or message text as dimensions. A click-to-WhatsApp event should not be marked as a qualified lead conversion.

## Homepage cards without a verified style code

These legacy presentation cards have a name but no `styleCode` in their source data. Their WhatsApp message identifies the displayed name and asks Fitclo to confirm the code; it never invents one. Add a verified style code and corresponding detail/catalog record before treating them as SKU-level conversion data:

- High-Waisted Leggings
- Off-Shoulder Yoga T-Shirt
- Gym Workout Tank Top
- Yoga Biker Shorts
- One-Piece Yoga Jumpsuit
- Full-Zip Training Jacket
- Quick-Dry Running Shorts
- Men's Performance T-Shirt
- Tennis & Golf Skirt Set
- Halter Neck Flare Set
- Cross-Waist Yoga Set
- Capri Yoga Set
- 350GSM Heavy Hoodie
- Halter Back Flare Yoga Set
- Wide-Leg Studio Workout Set
- Custom Zip Performance Set
- Deep-V Open Back Jumpsuit
- Zip-Bra & Cross-Waist Set
- Flared Compression Jumpsuit
- Premium Yoga Shorts Set
- Essential Yoga Leggings Set
- Contrast Binding Longline Sports Bra
- Active Performance Tennis Dress
