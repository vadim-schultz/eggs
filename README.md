# eggs

A hyperlocal marketplace for people who keep chickens to sell their excess eggs. Sellers post what
they have, how much, and roughly where; buyers reserve a listing and arrange pickup in person.

Implementation plans live under [.plans/README.md](.plans/README.md). Start there.

## Local development

```bash
npm install
npm run dev
```

The app needs a Supabase project URL and anon key in `.env.local` (gitignored, copy from
`.env.example`). See chapter 1's
[Manual configuration](.plans/mvp/chapters/01-project-scaffold.md#manual-configuration) section for the
one-time Supabase dashboard step.

`./ci.sh` runs the same lint/typecheck/test/build gate as CI.
