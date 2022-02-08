const express = require('express');
const openpgp = require('openpgp');


const app = express();
app.use(express.static('static'));

app.get('/encrypt', (req, res) => {
    
  (async () => {
    const publicKeyArmored = req.query.pubkey;
    try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: req.query.text }), 
        encryptionKeys: publicKey
    });
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GPG | Perry</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/PerryPal21/perry.css@master/perry.css">
</head>
<body>
  <div class="container">
  <h1>Encrypted Text</h1>
  <pre><code>${encrypted}</code></pre>
  </div>
</body>
</html>`)


    } catch (e) {
/*         throw new Error(e.message); */
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GPG | Perry</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/PerryPal21/perry.css@master/perry.css">
</head>
<body>
  <div class="container">
  <h1>${e.message}</h1>
  <p>The process encountered an error, please check whether the public key entered is valid or not</p>
  </div>
</body>
</html>`)
    }
})();
});

app.listen(3003, () => {
  console.log('server started');
});
