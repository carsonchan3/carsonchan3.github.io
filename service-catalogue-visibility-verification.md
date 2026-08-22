# Service Catalogue Visibility Verification

The production Manus Services page at `https://velolab-gkpolzge.manus.space/services` returns all six service entries, including Consulting as item 05 and Drone Services as item 06. The new records are therefore present in the live full-stack catalogue.

The static GitHub Pages URL at `https://carsonchan3.github.io/velocity_lab_innovation/services` returns a GitHub Pages 404 when accessed directly. This explains why a visitor using the static preview would not reach the Services route or see the two database-backed entries.

A fresh cache-busted Manus production request at `https://velolab-gkpolzge.manus.space/services?catalogue=160d337e` rendered the four legacy fallback cards rather than the database-backed list. The mismatch indicates that the public `services.list` request is intermittently failing or falling back, rather than that the two records are absent from the database.

Directly refetching the production `services.list` endpoint with `cache: "no-store"` returned all six database-backed records, including Consulting and Drone Services. The public query path is therefore cache-sensitive; the client should explicitly bypass stale HTTP responses for catalogue requests.

Desktop production verification confirmed that the Services API returns all six cards, but the lower dynamic cards render as blank space above the footer. The affected cards retain desktop reveal classes after the asynchronous catalogue query resolves, indicating that dynamically inserted reveal targets are not being registered by the reveal controller.
