# Adaptive Pokémon connections and private TURN

The website now tries multiple connection paths automatically. It does not guess whether a VPN is installed or query an IP/VPN lookup service. It reacts to the real connection outcome.

## What the website does

- Starts with normal ICE negotiation: direct candidates plus every configured relay transport.
- On failure, retries the same room/player session, forcing relay candidates on attempt 2 and restricting to configured TCP/TLS relay URLs on attempt 3. If no TCP/TLS URL exists, it repeats relay mode; it does not invent a TLS service.
- Allows up to 3 attempts by default, with 25 seconds for a player handshake per attempt and short increasing backoff. These limits can be changed in `config.js` within bounded ranges.
- Keeps the host's room open after a failed player handshake. Disconnecting pauses actions; reconnecting preserves the room code, player token and host's battle revision.
- Ignores late close/error events from older connections. Brief ICE interruptions receive a grace period before retrying. A signaling-server interruption does not tear down a working game channel.
- Offers **Retry connection** after retries are exhausted, plus connection details showing the attempt, relay configuration and actual selected path when browser statistics are available. A failed/blocked signaling server is separate from a blocked game/relay path.

The default public PeerJS relays remain available. **A private relay is NOT active until an actual server and credential endpoint have been deployed and their endpoint URL has been set.** GitHub Pages cannot host a TURN server or hold server secrets.

## Prepare the private service

The repo contains a deployment template in `relay-server/`:

1. **TURN host:** a Linux host with coturn and a public DNS name, valid TLS certificate, available TCP 443, UDP/TCP 3478 and UDP 49160–49200. Ensure outbound public UDP relay traffic works too. Use a dedicated TURN IP/host: a normal HTTPS site already occupying the same IP's TCP 443 conflicts with coturn unless you deliberately configure a compatible TCP/SNI proxy.
2. Copy `turnserver.conf.example` to a private configuration outside this repository. Replace the hostname/certificate paths and the authentication secret with your own random secret of at least 32 characters. Do not commit the real config or certificate keys. If the host has 1:1 NAT, set `external-ip=PUBLIC_IP/PRIVATE_IP` appropriately. Configure firewall rules for only the required ports, retain the peer-address restrictions, and start/reload coturn following its installation documentation.
3. **Credential endpoint:** deploy `relay-server/credential-worker.mjs` to your own Cloudflare Worker account. This is a template; no Cloudflare account or relay host is provisioned by pushing the repo. An existing compatible authenticated credential service can also be used.
4. In `relay-server/wrangler.jsonc`, replace `TURN_HOST`, check the exact `ALLOWED_ORIGIN`, keep the Firebase project `little-lingua-ab674`, and use a rate-limit namespace ID not shared with an unrelated service. The example rate limit is 10 requests/minute per user and per IP per Cloudflare location; rate limits are approximate, not a global spend cap.
5. From the repo root, use a recent Wrangler CLI (4.36+ for the binding). Set the **same** private secret on the Worker with `npx wrangler secret put TURN_SHARED_SECRET --config relay-server/wrangler.jsonc`; enter it at the terminal prompt. Then deploy with `npx wrangler deploy --config relay-server/wrangler.jsonc`. Only the secret belongs in secret storage; `TURN_HOST`, project ID and allowed origin are ordinary public configuration. Do not put the shared secret in `config.js`, a URL, a GitHub Pages file or chat.
6. Set `turnCredentialsUrl` in the public `config.js` to the deployed HTTPS `/credentials` endpoint and push. Use a URL without query parameters, user/password or fragments. Keep `turnRequireAuth: true`. Both players need to sign in through the main app to obtain private relay access; guest demo can still try the public fallback.

The credential Worker verifies a Firebase ID token against Google's public signing keys, the exact project/audience/issuer, expiry and authentication time. It rejects anonymous Firebase identities, checks Origin, and rate-limits before returning one-hour coturn REST HMAC credentials. It requires all server settings and the rate limiter; missing configuration fails closed. It does not need a service-account key. JWT verification is not an immediate revoked-token check: previously issued ID tokens may remain valid until expiration. Add stronger account eligibility/revocation checks on the server if your operating policy needs them.

The broker response is `Cache-Control: no-store` and contains only short-lived `iceServers` and an `expiresAt` timestamp in milliseconds. The browser sends its Firebase ID token in an Authorization header, omits cookies, and keeps relay credentials in memory only. It refreshes them before expiry for future connections. A failed credential service is shown in connection details and falls back to the configured/public ICE service; this fallback cannot turn a blocked UDP network into a working TLS network by itself.

## Verify before calling it active

1. Inspect the actual TURN listeners and certificate with your server's tools; a hostname in a config file does not prove TCP/TLS works.
2. Sign in on two real devices, keep the host page open and create/join a new room. Confirm connection details show private configuration.
3. Test without VPN, with your actual VPN enabled on either/both devices, and on the restricted network you need to support. Confirm the selected path can show a relay and the game still exchanges actions. Also test a network change mid-match; wait for bounded reconnection, or press Retry after a final failure.
4. To verify TLS specifically, use browser WebRTC diagnostics and the relay server's allocation logs. Check a relay candidate established via the configured TLS/TCP 443 URL; simply seeing the word `Relay` is not proof of TLS.
5. Check rate limits, temporary-key expiry/refresh, and server bandwidth/usage monitoring. Hosting and relay traffic are resources of the owner's chosen infrastructure; this code does not activate billing or guarantee zero cost.

TURN TCP/TLS improves compatibility when UDP is restricted, but cannot guarantee a connection through every VPN, HTTP-only browser proxy, firewall or blocked signaling service.

## Automated verification

- `node --test connection-options.test.mjs network-adaptive.test.mjs network.test.mjs relay-worker.test.mjs`: controlled direct-path failure, forced relay, TCP/TLS selection, retry bounds, cancel/stale-event handling, recovery with unchanged battle/token, endpoint timeouts, credential validation and Worker authorization/HMAC.
- `node scripts/test-network-browser.mjs`: two actual browsers use the bundled PeerJS client and real RTCDataChannels through a local PeerServer. It checks lobby, battle action and automatic reconnect with the same code/token/revision. It does **not** prove a public/private TURN host or a real VPN works.
- Existing battle/UI and teaching-viewer tests run in GitHub Actions too.

Official references: https://peerjs.com/client/api/peer ; https://github.com/coturn/coturn ; https://firebase.google.com/docs/auth/admin/verify-id-tokens ; https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ .
