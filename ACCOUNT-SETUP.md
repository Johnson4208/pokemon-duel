# Little Lingua: cloud account setup

The app now combines learning, Pokémon Play, the star Shop, and learner profiles. It is still a static GitHub Pages app. Firebase handles email/password authentication and Firestore holds one private profile per user.

## Connect your Firebase project

1. Open https://console.firebase.google.com/ and create or select a project. Register a Web app.
2. In Authentication, enable **Email/Password**. Under Settings → Authorized domains, add `johnson4208.github.io` (or your own Pages hostname).
3. Create a **Cloud Firestore** database in production mode. Paste `firestore.rules` into its Rules editor and publish. Do not use public read/write test-mode rules.
4. Copy the Web app's configuration from Project settings. Replace `window.LINGUA_FIREBASE = null` in `firebase-config.js` with that configuration object. Its Web apiKey identifies the project; it is not a service-account private key. Never include admin SDK/service-account credentials in this repository.
5. Commit the config file and reload the site. Create two distinct test accounts in the app. Learn words with account A, sign out, and sign in as account B: B must show its own stars and collection. Sign in as A on a second device and verify that A's balance and collection match. Firebase console access is not included in this ZIP; live cloud sign-in cannot work until steps 1–4 are completed.

The Firestore SDK loads from Google's CDN only when a Firebase project is configured. Without a config the login page clearly says cloud accounts are not connected and offers a separate guest demo. Guest progress is held in sessionStorage, never uploaded into a newly registered account. Passwords go directly to Firebase Auth and are never saved by application code.

## Stars and collection

- Every account starts at 0 stars and can freely select Pikachu, Eevee, Bulbasaur, Charmander, Squirtle, Jigglypuff, Psyduck, Meowth, Vulpix, Rowlet, Riolu, and Venusaur. Existing documents retain their original three stored starters; the other free picks are granted by the catalog without changing saved records.
- Mark a vocabulary entry learned for the first time: +1 star. Solve its word puzzle for the first time: +1 star. Vietnamese, English, and Chinese each have separate completion records but share the account's wallet.
- Repeating a reward, unmarking/relearning a word, or replaying a puzzle does not mint another star. Stars never come from battle wins.
- Shop: Charizard 12; Blastoise 12; Arcanine 15; Umbreon 18; Sylveon 18; Gengar 23; Mimikyu 23; Lapras 27; Gardevoir 30; Greninja 33; Lucario 38; Snorlax 42; Incineroar 45; Dragonite 53; Salamence 60; Garchomp 68; Mew 68; Mewtwo 75; Rayquaza 90; Groudon 98; Kyogre 98 stars. These are minimum requirements. Each confirmed exchange consumes the entire current star wallet and resets it to 0, including surplus stars. Lifetime earned stars and learning progress remain saved.
- Firestore transactions read the current cloud balance before exchanging. A stale confirmation is rejected if the wallet changes. Spending and adding the Pokémon happen together. Insufficient balance and duplicate purchases are rejected. Signing out clears the displayed account and destroys the embedded battle.
- The rules restrict profile reads/writes to the authenticated owner and validate wallet arithmetic, reward increments, and shop thresholds and full-wallet resets. Learning completion is a trust-based client activity; these rules are not a server-side exam validator or a competitive anti-cheat system. Peer battle inventory restrictions are enforced by the normal app UI; modified clients are not prevented by an authoritative battle server.

## Languages and avatars

Vietnamese keeps the supplied large vocabulary library and its MP3 files. English reuses those entries with Vietnamese hints. Chinese is a starter course with characters, pinyin, and English hints. Do not imply that Chinese has the same full library size as Vietnamese. The learning selector changes vocabulary, pronunciation language, puzzle tiles, spotlight, and stories. The profile's App language selector translates navigation and key account/Shop actions; explanatory copy and battle instructions are currently mostly English/Vietnamese.

Twenty original SVG animal avatars: fox, cat, dog, panda, koala, rabbit, bear, frog, owl, penguin, duck, lion, tiger, monkey, pig, mouse, raccoon, elephant, deer, and sloth.

## Running and testing

Serve this folder through an HTTP server (not file://). No build step is required. Use GitHub Pages with the supplied workflow or upload the folder to another static host.

Run: `node --test tests/*.test.mjs pokemon/tests/*.test.mjs`

Automated verification covers reward idempotency, exact Shop prices, account isolation, switching users while a mutation is queued, separate language progress, battle mechanics, and two simulated peer clients. Cloud account tests use a simulated Firestore transaction adapter; live Auth, Firestore rules, and cross-device synchronization still require a configured Firebase project and real account checks.

Online duels retain the earlier PeerJS/WebRTC connection setup. Some networks need your own TURN server configured in pokemon/config.js. The prior live two-player browser test timed out; successful two-device connectivity has not been verified. AI practice is available without peer networking.

## Collection update: Firebase owner action

Before signed-in learners use the expanded Shop, open Firebase Console → little-lingua-ab674 → Build → Firestore Database → Rules. Replace the rules with this release’s complete `firestore.rules`, then click Publish. Existing rules charge only the item price and will reject the new full-wallet reset and new species. The app shows an error and keeps the balance/collection unchanged if Firestore rejects a save.

Verify using an account with more than 12 stars: exchange for Charizard, confirm 0 stars, sign out and back in, and check Charizard is still unlocked. Then earn one new star and verify it is saved as 1. Sign in with another user to check their independent balance. Automated cloud tests use a mock adapter; publishing rules and live account synchronization still need verification.

## Ranking and battle effects

Selection is adapted for children from the transcript of WolfeyVGC’s “I Ranked Literally Every Pokemon”: https://www.youtube.com/watch?v=1QwPt9YsnOE . The video combines competitive performance, recognizability, and design; its positions are not a pure popularity chart. We retain the original familiar species and past purchases, add more friendly free choices, and choose notable evolved/legendary rewards instead of importing the whole 1,025-species ranking. Video top-ten reward picks include Kyogre (#1), Groudon (#2), Charizard (#3), Incineroar (#4), Garchomp (#7), Rayquaza (#8), Salamence (#9), and Mimikyu (#10). Game stats, prices, and simplified single types are custom balance decisions.

Sprites animate locally; move visuals use type colors. Burn: 6 HP after each of 3 own actions. Poison: 8 HP after each of 3 own actions. Chill: 20% less attack damage for 2 own actions. Drain restores half actual damage; heal restores 30% max HP; focus boosts the next successful attack by 25%; pierce ignores Guard. Switching benches a status until that Pokémon acts again. Reduced-motion users get static battlers and selection sprites. Art assets come from https://github.com/PokeAPI/sprites . Pokémon rights remain with their respective owners.
