# Clubem

Clubem is an internal operations platform for processing large restaurant Group Orders received as PDFs from third‑party food‑ordering platforms.

It acts as the **control plane** between raw PDF uploads and finalized POS‑ready order outputs.

---

## What Clubem Does

- Accepts multiple PDF uploads per order
- Sends PDFs to an external extraction engine
- Validates and normalizes returned JSON
- Enables admin oversight and manual correction
- Generates standardized outputs:
  - Google Sheets
  - Excel
  - PDF
- Automatically emails results

---

## What Clubem Does NOT Do

- OCR or PDF parsing
- Image processing
- Data extraction logic

Those are handled by a dedicated external engine.

---

## Supported Platforms

- Grubhub
- Forkable
- Sharebite
- CaterCow
- EzCater
- ClubFeast
- Hungry

---

## User Roles

### Admin
- Full system access
- Manage platforms, templates, and users
- View and correct all orders

### User
- Upload PDFs
- View own uploads and orders
- No system configuration access

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- uploadthing (uploads)
- External extraction engine (integration)

---

## Project Structure (High-Level)

- /login – Authentication UI
- /admin – Admin dashboard
- /app – User dashboard
- /components – Reusable UI components
- /templates – Output interpretation profiles

---

## Order Lifecycle

1. Upload PDFs
2. Engine extraction
3. Template validation
4. Manual review (if required)
5. Output generation
6. Email delivery

---

## Development Notes

- UI-only authentication
- Role-based routing
- No UI libraries
- Designed for extension with backend services

---

## License

Internal use only.
