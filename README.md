# House of Riwaze React Frontend

This is a clean React + Vite recreation of the House of Riwaze prototype structure.

## Run locally

```bash
npm install
npm run dev
```

## Routes

- `/` - Home
- `/products` - Public products catalogue
- `/rates` - Metal and diamond rates
- `/ProductDetail` - Default product detail route matching the prototype
- `/product/:id` - Product detail by product id
- `/admin/Dashboard` - Admin dashboard
- `/admin/Inventory` - Inventory table
- `/admin/ProductForm` - Product create/update form
- `/admin/Reports` - Reporting page
- `/admin/AdminSettings` - Admin settings

## Next implementation steps

1. Replace mock data in `src/data` with API calls.
2. Add authentication for admin routes.
3. Connect Product Form to backend create/update endpoints.
4. Add image upload and media storage for product photos.
5. Add rate history and audit logs for stock/rate changes.
