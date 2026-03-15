# Meta Graph API Proxy (Cloudflare Worker)

Lightweight proxy for `graph.facebook.com` and `graph.instagram.com`, intended
for environments where those domains are blocked by egress policy.

## Deploy

```bash
cd integrations/meta-proxy
npm install
npx wrangler login        # authenticate with Cloudflare
npx wrangler deploy       # deploy to workers.dev
```

## Usage

Replace the Meta domain with your worker URL:

```
# Before (blocked)
https://graph.facebook.com/v19.0/17841468585961185?fields=id,username&access_token=...

# After (via proxy)
https://meta-graph-proxy.<you>.workers.dev/facebook/v19.0/17841468585961185?fields=id,username&access_token=...
```

Supported prefixes:
- `/facebook/...` → `graph.facebook.com`
- `/instagram/...` → `graph.instagram.com`

## Security

The worker does **not** store or inject credentials. You must pass your
`access_token` as a query parameter or header, just like a direct API call.
