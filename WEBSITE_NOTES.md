# TRACEROOT website

Seven bilingual public pages: home, catalog, branding, delivery, tracking, company and contact. `npm run build` bundles local assets and checks page links. No remote image download is required at build time.

## Tracking
The current release is a carrier tracking gateway, not a live tracking API. KIT, PEK and CDEK links lead to the official query pages. Customers copy their waybill number and query there. TRACEROOT order status requests open WhatsApp with the order reference; no fabricated shipment events or public order database exists.

To display live events on this domain, supply the actual carriers, authorized API access and the mapping between TRACEROOT orders and waybills. Credentials must be server environment variables, never committed into this public repository. Order-specific information needs authorization before disclosure.

## Inquiry
Category selections prefill the request. Preparing a request produces an editable message; the separate WhatsApp button opens the business number +8613757554679 with that message. The customer sends it in WhatsApp. There is no silent submission or unconfigured backend.

## Content
Product images are supplied company materials. Existing brand partners, company photos, telephone, favicon and brochure are retained. QR codes are not displayed. Language preference is stored locally; shipment/order numbers are not persisted in browser storage.
