# Little Lingua + Pokémon

Learn Vietnamese, English, and Chinese; earn stars; collect Pokémon; play with a friend.

Cloud sign-in needs a Firebase project configured in `firebase-config.js`. See [ACCOUNT-SETUP.md](ACCOUNT-SETUP.md). The guest demo works immediately.

Original Vietnamese recordings and 33 Pokémon PNG/GIF sprites are compressed in `speech-audio.zip`. The Pages workflow unpacks them into the deployed site. For local hosting, unzip this archive into the repository root first.

Tests: `node --test *.test.mjs`.

The collection includes 12 free companions and 21 star rewards, with animated sprites and status/healing effects. Exchanges reset the entire available star wallet to zero. Publish the updated `firestore.rules` in Firebase Console before using cloud exchanges; see ACCOUNT-SETUP.md.
