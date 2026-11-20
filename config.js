// Website connection settings. Do not put TURN passwords or provider API keys here.
// Set turnCredentialsUrl after deploying the authenticated credential broker in relay-server/.
window.POKEMON_NETWORK = {
 turnCredentialsUrl: '', // Example: https://your-credential-worker.workers.dev/credentials
 turnRequireAuth: true,
 maxConnectionAttempts: 3,
 handshakeTimeoutMs: 25000,
 signalingTimeoutMs: 20000,
 retryDelayMs: 1200,
 disconnectGraceMs: 5000,
 credentialsTimeoutMs: 8000
};
// Optional own PeerServer: host, port:443, path:'/peerjs', secure:true.
// Without a credential endpoint, public PeerJS ICE servers remain the fallback;
// a private TCP/TLS relay is NOT active merely because this file exists.
