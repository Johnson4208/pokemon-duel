# Pokémon Duel

A Vietnamese-language, two-player Pokémon fan game for GitHub Pages.

## Publish

Create a repository named `pokemon-duel`. Upload the contents of this folder so `index.html` is at the repository root. Commit to `master`. In Settings → Pages, choose Deploy from a branch → master → /(root), then Save.

## Play

Pick three Pokémon, create a room, and send its code or invite link to a friend. Both players select Ready to begin. The host must keep the page open. Practice mode works without a second player.

The game uses bundled PeerJS 1.5.5 and the public PeerJS signaling service. It does not require an API key. Some networks need a TURN relay; optional PeerServer and ICE configuration is in `config.js`. Do not store permanent credentials in public frontend files.

This game uses simplified rules: one type per Pokémon, four moves with PP, type effectiveness, switching, guard, one potion per team, automatic replacements after KO, and rematches. It has no accounts, exploration map or persistent online matches. A disconnected match must be restarted. The host controls the authoritative state; it is intended for casual play with friends.

## Local checks

Serve the folder over HTTP (for example `python -m http.server 8000`), then open http://localhost:8000/. Do not open index.html through file://.

With Node.js 20+ run `node --test *.test.mjs`. The 14 automated tests cover battle rules, 120 simulated games, simulated two-client networking, third-player rejection and a DOM-stub UI flow. Actual browser layout and connections between different networks have not been verified.

## Credits

Pokémon sprites: https://github.com/PokeAPI/sprites. Pokémon characters belong to their respective owners; this is an unofficial fan game. PeerJS uses the MIT license included in PEERJS_LICENSE.txt. Fonts load optionally from Google Fonts, with system fallbacks.
