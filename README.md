# Mozilla Builders Forum

![](https://github.com/hunterlarco/forum.mozillabuilders.com/workflows/ci/badge.svg)

## Contributing

### Configure your local repository

```sh
# Install Git LFS (large file storage).
git lfs install

# Enable Git LFS file locking verification
git config lfs.http://github.com/hunterlarco/forum.mozillabuilders.com.git/info/lfs.locksverify true

# Pull files stored in Git LFS (necessary if lfs was installed after clone).
git lfs pull
```

### Install project dependencies

Most dependencies can be installed via `npm`, however a few need to be handled
manually:

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)

```sh
npm install
```

### Local Development

```sh
cli/fido.js run-local
```

### Local Firestore UI

Welcome to a world of pain. `cli/fido.js run-local` will by default bring up a
Firestore server, however there's no admin UI for it. If you want an admin UI
you're going to need to clone
[firebase-tools-ui](https://github.com/firebase/firebase-tools-ui) and start the
Firestore server manually using the below config + invocation:

```json
{
  "emulators": {
    "firestore": {
      "port": 9000
    }
  }
}
```

```sh
PORT=4000 BROWSER=none firebase emulators:exec \
    --project moz-unfck-forum
    --only firestore \
    'npm start'
```

Once the Firestore emulator is running, bring up the local development stack
while disabling the default Firestore server like so:

```sh
cli/fido.js run-local --no-firestore
```

If during local usage you don't see any documents in the Firestore UI, try
making sure that your local machine is authorized with `firebase login`.

### Deployments

Deployments will require credentials from
[hunterlarco](https://github.com/hunterlarco) for both Firebase Hosting and the
Google Cloud project.

```sh
# Use `firebase login:ci` to gain a firebase token to authorize the deployment.
cli/fido.js web:deploy --firebase-token $FIREBASE_TOKEN

# Use `gcloud auth login` to authorize your local machine for server
# deployments.
cli/fido.js server:deploy
```

### Pull Requests

Please submit all contributions via pull requests where your branch matches the
pattern `<username>/<branch-name>`.
