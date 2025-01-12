const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { encrypt, decrypt, generateKeys } = require('./utils/security');
const { generatePass } = require('./utils/generator');
const { benchmark } = require('./utils/benchmark');
const dataPath = './data/data.json';
const keysPath = './data/keys.json';

// Set up security keys if they don't exist
fs.access(keysPath)
.catch(() => {
  return fs.mkdir('./data', { recursive: true })
  .then(() => fs.writeFile(keysPath, JSON.stringify(generateKeys), 'utf8'))
});

// Set up storage if it doesn't exist
fs.access(dataPath)
.catch(() => {
  return fs.mkdir('./data', { recursive: true })
  .then(() => fs.writeFile(dataPath, JSON.stringify([]), 'utf8'))
});

// Serve the HTML page
router.get('/', (req, res) => {
  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    const jsonData = JSON.parse(data);
    let portalList = []
    const dataLength = jsonData.length
    for (let i = 0; i < dataLength; i++) {
      portalList.push(decrypt('auth_portal', Object.keys(jsonData[i])[0]))
    }

    res.render('index.ejs', { root: 'views', data: portalList });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.post('/api/save', (req, res) => {
    const { login, password, auth } = req.body;

    fs.readFile(dataPath, 'utf8')
    .then((data) => {
      let jsonData = JSON.parse(data);
      const dataLength = jsonData.length;
      const encryptedAuth = encrypt('auth_portal', auth)

      for (let i = 0; i < dataLength; i++) {
        const obj = jsonData[i]
        const objKey = Object.keys(obj)[0]

        if (encryptedAuth === objKey) {
          const encryptedlogin = encrypt('login', login)
          const encryptedPassword = encrypt('password', password)

          obj[objKey].push({
            login: encryptedlogin,
            password: encryptedPassword
          });

          break
        }
      }

      const updatedJson = JSON.stringify(jsonData, null, 3);

      fs.writeFile(dataPath, updatedJson, 'utf8')
      .then(() => {
        /* console.log('File updated successfully!'); */
        res.send('File updated successfully!');
      })
      .catch((err) => {
        console.error('Error writing file:', err);
      });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.post('/api/create', (req, res) => {
  const { auth } = req.body;

  if (!auth || auth === "") return

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedAuth = encrypt('auth_portal', auth)

    jsonData.push({
      [encryptedAuth]: []
    });

    const updatedJson = JSON.stringify(jsonData, null, 3);

    fs.writeFile(dataPath, updatedJson, 'utf8')
    .then(() => {
      console.log('File updated successfully!');
      res.send('File updated successfully!');
    })
    .catch((err) => {
      console.error('Error writing file:', err);
    });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.put('/api/edit_portal_name', (req, res) => {
  const { oldName, newName } = req.body;

  if (!newName || newName === "" || newName === oldName) return

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedOldName = encrypt('auth_portal', oldName)
    const encryptedNewName = encrypt('auth_portal', newName)
    const dataLength = jsonData.length

    for (let i = 0; i < dataLength; i++) {
      const obj = jsonData[i]
      const objKey = Object.keys(obj)[0]

      if (encryptedOldName === objKey) {
        obj[encryptedNewName] = obj[objKey]
        delete obj[objKey]
        break
      }
    }

    const updatedJson = JSON.stringify(jsonData, null, 3);

    fs.writeFile(dataPath, updatedJson, 'utf8')
    .then(() => {
      console.log('File updated successfully!');
      res.send('File updated successfully!');
    })
    .catch((err) => {
      console.error('Error writing file:', err);
    });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.delete('/api/delete_portal', (req, res) => {
  const { portal } = req.body;

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedPortal = encrypt('auth_portal', portal)
    const dataLength = jsonData.length

    for (let i = 0; i < dataLength; i++) {
      if (encryptedPortal === Object.keys(jsonData[i])[0]) {
        jsonData.splice(i, 1)
        break
      }
    }

    const updatedJson = JSON.stringify(jsonData, null, 3);

    fs.writeFile(dataPath, updatedJson, 'utf8')
    .then(() => {
      console.log('File updated successfully!');
      res.send('File updated successfully!');
    })
    .catch((err) => {
      console.error('Error writing file:', err);
    });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.get('/api/get_portal', (req, res) => {
  const { portal } = req.query;

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedPortal = encrypt('auth_portal', portal)
    const dataLength = jsonData.length

    for (let i = 0; i < dataLength; i++) {
      const objKey = Object.keys(jsonData[i])[0]

      if (encryptedPortal === objKey) {
        const portalObject = jsonData[i][objKey]
        const portalLength = portalObject.length
        let decryptedObject = {}
        decryptedObject[portal] = []

        for (let i = 0; i < portalLength; i++) {
          const decryptedLogin = decrypt('login', portalObject[i].login)
          const decryptedPassword = decrypt('password', portalObject[i].password)
          decryptedObject[portal].push({ login: decryptedLogin, password: decryptedPassword })
        }
        res.send(decryptedObject)
        break
      }
    }
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.get('/api/generate', (req, res) => {
  const { length, lowercase, uppercase, numbers, symbols } = req.query;
  const useLower = lowercase === 'true'; // 'true' -> true, 'false' -> false
  const useUpper = uppercase === 'true';
  const useNumbers = numbers === 'true';
  const useSymbols = symbols === 'true';

  if (!useUpper && !useLower && !useNumbers && !useSymbols) return;

  const generatedPass = generatePass(length, useLower, useUpper, useNumbers, useSymbols)
  res.send({ password: generatedPass });
});

router.put('/api/edit_credentials', (req, res) => {
  const { type, index, newData, portalName } = req.body;

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedPortal = encrypt('auth_portal', portalName)
    const dataLength = jsonData.length

    for (let i = 0; i < dataLength; i++) {
      const obj = jsonData[i]
      const objKey = Object.keys(obj)[0]

      if (objKey === encryptedPortal) {
        if (type === 'login') {
          const encryptedLogin = encrypt('login', newData)
          obj[encryptedPortal][index].login = encryptedLogin
        } else if (type === 'password') {
          const encryptedPassword = encrypt('password', newData)
          obj[encryptedPortal][index].password = encryptedPassword
        }
        break
      }
    }

    const updatedJson = JSON.stringify(jsonData, null, 3);

    fs.writeFile(dataPath, updatedJson, 'utf8')
    .then(() => {
      console.log('File updated successfully!');
      res.send('File updated successfully!');
    })
    .catch((err) => {
      console.error('Error writing file:', err);
    });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

router.delete('/api/delete_credential', (req, res) => {
  const { index, portalName } = req.body;

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedPortal = encrypt('auth_portal', portalName)
    const dataLength = jsonData.length

    for (let i = 0; i < dataLength; i++) {
      if (Object.keys(jsonData[i])[0] === encryptedPortal) {
        jsonData[i][encryptedPortal].splice(index, 1)
        break
      }
    }

    const updatedJson = JSON.stringify(jsonData, null, 3);

    fs.writeFile(dataPath, updatedJson, 'utf8')
    .then(() => {
      console.log('File updated successfully!');
      res.send('File updated successfully!');
    })
    .catch((err) => {
      console.error('Error writing file:', err);
    });
  })
  .catch((err) => {
    console.error('Error reading file:', err);
  });
});

module.exports = router;