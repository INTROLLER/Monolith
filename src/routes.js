const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { encrypt, decrypt, generateKeys } = require('./utils/security');
const { generatePass } = require('./utils/generator');
const { benchmark } = require('./utils/benchmark');
const { json } = require('body-parser');
const dataPath = './data/data.json';
const keysPath = './data/keys.json';

async function backupFiles() {
  try {
      // Ensure the backup directory exists
      await fs.mkdir('./backup', { recursive: true });

      // Copy data file
      await fs.copyFile(dataPath, './backup/data.json');
      console.log('Backup of data was issued');

      // Copy keys file
      await fs.copyFile(keysPath, './backup/keys.json');
      console.log('Backup of keys was issued');
  } catch (err) {
      console.error('Error during backup:', err);
  }
}

// Set up security keys if they don't exist
fs.access(keysPath)
.catch(() => {
  return fs.mkdir('./data', { recursive: true })
  .then(() => fs.writeFile(keysPath, JSON.stringify(generateKeys()), 'utf8'));
})

// Set up storage if it doesn't exist
.then(() => fs.access(dataPath))
.catch(() => {
  return fs.mkdir('./data', { recursive: true })
  .then(() => fs.writeFile(dataPath, JSON.stringify([]), 'utf8'));
})

// Only issue the backup after both checks are complete
.then(() => {
  backupFiles();
})
.catch((err) => {
  console.error('Error during setup or backup:', err);
});

// Serve the HTML page
router.get('/', (req, res) => {
  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    const jsonData = JSON.parse(data);
    const dataLength = jsonData.length;
    let portalList = []

    for (let i = 0; i < dataLength; i++) {
      const obj = jsonData[i]
      const portalTitle = decrypt('auth_portal', obj.title)

      portalList.push({ title: portalTitle, starred: obj.starred })
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
      const encryptedPortal = encrypt('auth_portal', auth)

      for (let i = 0; i < dataLength; i++) {
        const obj = jsonData[i]

        if (obj.title === encryptedPortal) {
          const encryptedlogin = encrypt('login', login)
          const encryptedPassword = encrypt('password', password)

          obj.credentials.push({
            login: encryptedlogin,
            password: encryptedPassword
          });

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

router.post('/api/create', (req, res) => {
  const { auth } = req.body;

  if (!auth || auth === "") return

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedPortal = encrypt('auth_portal', auth)

    jsonData.push({
      title: encryptedPortal,
      starred: false,
      credentials: []
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

      if (obj.title === encryptedOldName) {
        obj.title = encryptedNewName
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
      const obj = jsonData[i]
      if (obj.title === encryptedPortal) {
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
      const obj = jsonData[i]

      if (obj.title === encryptedPortal) {
        const credentialsList = jsonData[i].credentials
        const portalLength = credentialsList.length
        let decryptedList = []

        for (let i = 0; i < portalLength; i++) {
          const decryptedLogin = decrypt('login', credentialsList[i].login)
          const decryptedPassword = decrypt('password', credentialsList[i].password)
          decryptedList.push({ login: decryptedLogin, password: decryptedPassword })
        }
        res.send(decryptedList)
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

      if (obj.title === encryptedPortal) {
        if (type === 'login') {
          const encryptedLogin = encrypt('login', newData)
          obj.credentials[index].login = encryptedLogin
        } else if (type === 'password') {
          const encryptedPassword = encrypt('password', newData)
          obj.credentials[index].password = encryptedPassword
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
      const obj = jsonData[i]
      if (obj.title === encryptedPortal) {
        obj.credentials.splice(index, 1)
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

router.put('/api/toggle_star', (req, res) => {
  const { portalName, isStarred } = req.body;

  fs.readFile(dataPath, 'utf8')
  .then((data) => {
    let jsonData = JSON.parse(data);
    const encryptedPortal = encrypt('auth_portal', portalName)
    const dataLength = jsonData.length

    for (let i = 0; i < dataLength; i++) {
      const obj = jsonData[i]
      if (obj.title === encryptedPortal) {
        obj.starred = isStarred
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