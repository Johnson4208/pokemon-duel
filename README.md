# Little Lingua + Pokémon

Learn Vietnamese, English, and Chinese; earn stars; collect Pokémon; play with a friend.

Cloud sign-in uses Firebase Email/Password and Firestore. Configure the Web app in `firebase-config.js`; follow [ACCOUNT-SETUP.md](ACCOUNT-SETUP.md). The guest demo works without Firebase.

Original Vietnamese recordings and the 33 locally bundled Pokémon PNG/GIF sprites are compressed in `speech-audio.zip`. Other collection sprites load from the PokeAPI sprite repository. The Pages workflow unpacks the audio bundle into the deployed site. For local hosting, unzip this archive into the repository root first.

Run tests with `node --test *.test.mjs`.

The collection has 48 Pokémon: 12 free choices and 36 star rewards. Pure-support Pokémon have one weak attack and three support moves; attrition Pokémon can inflict poison or burn; tanks have more HP and weaker attacks; strikers hit harder, and balanced Pokémon rely on flexible attacks. The 16 legendary and mythical rewards cost 128–260 stars. Every exchange spends the full current balance and resets available stars to zero.

Firebase purchases require the current `firestore.rules` to be published in Firebase Console. GitHub Pages does not publish Firebase security rules automatically. See the Firebase owner action in [ACCOUNT-SETUP.md](ACCOUNT-SETUP.md).
