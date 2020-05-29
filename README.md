# deviantart-profile-downloader

This is a basic profile downloader (archiver) for Deviantart. All it does is downloading **all images** from the profile that you specify. There are no other functions whatsoever and you will probably going to get ratelimit errors after sometime if specified profile has too much content. (I'm not gonna fix this, downloading images in bulk from Deviantart is probably against Developer ToS anyways.)

You have to fill empty spaces in `config.js`.

```js
module.exports = {
    username: "",       // Username of the profile that you want to download
    client_id: "",      // Client id for the app that you created from https://www.deviantart.com/developers/
    client_secret: "",  // Client secret for the app that created from https://www.deviantart.com/developers/
    limit: 24           // You can change this if you want, but it's not necessary and this is the maximum it can be
}
```
