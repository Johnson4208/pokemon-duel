// Optional: supply your own HTTPS PeerServer / short-lived TURN credentials.
// Defaults use the public PeerJS signaling service and its ICE configuration.
// Never put long-lived TURN passwords or admin secrets in a public repository.
window.POKEMON_NETWORK = {};
// Example: { host: 'peer.example.com', port: 443, path: '/peerjs', secure: true,
//   config: { iceServers: [{urls:'stun:stun.l.google.com:19302'},
//     {urls:'turn:turn.example.com:3478',username:'TEMP_USER',credential:'TEMP_PASSWORD'}] } }
