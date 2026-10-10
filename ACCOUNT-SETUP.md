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

- Every new account starts at 0 stars with Pikachu, Eevee, and Venusaur (Bulbasaur's final evolution).
- Mark a vocabulary entry learned for the first time: +1 star. Solve its word puzzle for the first time: +1 star. Vietnamese, English, and Chinese each have separate completion records but share the account's wallet.
- Repeating a reward, unmarking/relearning a word, or replaying a puzzle does not mint another star. Stars never come from battle wins.
- Shop: Charizard 8; Blastoise 8; Gengar 15; Lapras 18; Gardevoir 20; Lucario 25; Snorlax 28; Dragonite 35; Garchomp 45 stars.
- Firestore transactions read the current cloud balance before charging. Spending and adding the Pokémon happen together. Insufficient balance and duplicate purchases are rejected. Signing out clears the displayed account and destroys the embedded battle.
- The rules restrict profile reads/writes to the authenticated owner and validate wallet arithmetic, reward increments, and exact shop prices. Learning completion is a trust-based client activity; these rules are not a server-side exam validator or a competitive anti-cheat system. Peer battle inventory restrictions are enforced by the normal app UI; modified clients are not prevented by an authoritative battle server.

## Languages and avatars

Vietnamese keeps the supplied large vocabulary library and its MP3 files. English reuses those entries with Vietnamese hints. Chinese is a starter course with characters, pinyin, and English hints. Do not imply that Chinese has the same full library size as Vietnamese. The learning selector changes vocabulary, pronunciation language, puzzle tiles, spotlight, and stories. The profile's App language selector translates navigation and key account/Shop actions; explanatory copy and battle instructions are currently mostly English/Vietnamese.

Twenty original SVG animal avatars: fox, cat, dog, panda, koala, rabbit, bear, frog, owl, penguin, duck, lion, tiger, monkey, pig, mouse, raccoon, elephant, deer, and sloth.

## Running and testing

Serve this folder through an HTTP server (not file://). No build step is required. Use GitHub Pages with the supplied workflow or upload the folder to another static host.

Run: `node --test tests/*.test.mjs pokemon/tests/*.test.mjs`

Automated verification covers reward idempotency, exact Shop prices, account isolation, switching users while a mutation is queued, separate language progress, battle mechanics, and two simulated peer clients. Cloud account tests use a simulated Firestore transaction adapter; live Auth, Firestore rules, and cross-device synchronization still require a configured Firebase project and real account checks.

Online duels retain the earlier PeerJS/WebRTC connection setup. Some networks need your own TURN server configured in pokemon/config.js. The prior live two-player browser test timed out; successful two-device connectivity has not been verified. AI practice is available without peer networking.
