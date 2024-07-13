const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const fs = require('fs');
const multer = require('multer');
const ejs = require('ejs');
const sqlite3 = require ('sqlite3').verbose();
const bcrypt = require ('bcrypt');
const crypto = require('crypto');
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
//engine ejs
app.set('view engine', 'ejs');

// Imposta una directory statica per i file client-side



const secretkey = crypto.randomBytes(256).toString('hex');
app.use(session({
  secret: secretkey,
  resave: false,
  saveUninitialized: false
}));


const verificaAutenticazione = (req, res, next) => {
  if (req.session.utenteAutenticato) {
    // Se l'utente è autenticato, passa al prossimo middleware o alla route successiva
    next();
  } else {
    // Se l'utente non è autenticato, reindirizza alla pagina di login
    res.redirect('/login');
  }
};

//database SQLITE 

const db = new sqlite3.Database('database/user.db');


// Creiamo la tabella per gli utenti
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
});



/*const username = 'admin';
const password = 'admin'; // Password da inserire
bcrypt.hash(password, 10, function(err, hash) {
  if (err) {
    console.error(err);
    return;
  }
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, hash], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Utente inserito correttamente nel database');
    }
  });
});  */


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT username, password FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("[Errore nel database]");
    }
    if (!row) {
      return res.status(401).send("[Username non trovato!]");
    }

    const hashPassword = row.password;
    bcrypt.compare(password, hashPassword, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("[Errore durante l'autenticazione!]");
      }

      if (result) {
        req.session.utenteAutenticato = true;
        res.redirect('/');
      } else {
        return res.status(401).send("[Password errata!]");
      }
    });
  });
}); // <-- Aggiunta parentesi chiusa per la funzione di gestione del login




// Configura Multer per la gestione dell'upload dei file

const uploadDirectory = 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname) !== '.stl') {
    return cb(new Error('You can upload only .stl files!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

//configurazione per la visione dei file nella directory /uploads
// ...

app.get('/filelist', verificaAutenticazione, (req, res) => {

});



// Imposta il percorso per il caricamento dei file
app.use('/uploads', express.static(path.join(__dirname, uploadDirectory)));

// Gestisce la richiesta di upload del file
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File caricato con successo!' });
});


app.get('/login', (req,res) => {
  res.sendFile(__dirname + '/public/login.html');
});
// Definisci una route per servire la pagina principale
app.get('/', verificaAutenticazione, (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads'); 
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Errore nella lettura della directory');
    } else {
      const fileList = files.map((file) => ({
        name: file,
        link: path.join('uploads', file), 
      }));
      res.render('../public/index', { files: fileList }); // Passa l'array fileList al template index.ejs
    }
  });
});

app.get('/upload', verificaAutenticazione,(req, res) => {
  res.render('../public/upload');
});





app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));



app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
