const express = require('express');
const app = express();
const mysql = require('mysql');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Skapa en anslutning till MySQL-databasen
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cropdb'
});

// Anslut till databasen
connection.connect((err) => {
  if (err) {
    console.error('Anslutning till MySQL misslyckades: ' + err.stack);
    return;
  }
  console.log('Ansluten till MySQL-databasen med ID ' + connection.threadId);
});

// Ange EJS som visningsmotor
app.set('view engine', 'ejs');

// Ange sökvägen till mappen med EJS-filer (vyer)
//__dirname variabel i Node.js som innehåller den absoluta sökvägen till den aktuella modulen (filen) som körs.
app.set('views', __dirname + '/views');

// Route för rotvägen ("/") för att rendera index.ejs
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/user', (req, res) => {
    // Skicka vyen till klienten
    res.render('user');
  });

app.get('/loggad', (req, res) => {
    
    // Skicka vyen till klienten
    res.render('loggad');
  });


/// Hantera POST-begäran för att skapa en ny användare
///CRUD, CREATE
// ...

app.post('/createUser', (req, res) => {
    const användarnamn = req.body.anvandarnamn;
    const epost = req.body.epost;


        const förnamn = req.body.fornamn;
        const efternamn = req.body.efternamn;
      
        // Reguljärt uttryck för att kontrollera att förnamn och efternamn bara innehåller bokstäver och mellanslag
        const regex = /^[A-Za-z\s]+$/;
      
        if (!förnamn.match(regex) || !efternamn.match(regex)) {
          // Ogiltig inmatning, förnamn eller efternamn innehåller ogiltiga tecken
          res.send('Förnamn och efternamn får bara innehålla bokstäver och mellanslag.');
          <a href="/">Return</a>
          return;
        }


  
    // Kolla om användarnamn eller e-post redan finns i databasen
    const checkQuery = 'SELECT COUNT(*) AS count FROM Användare WHERE Användarnamn = ? OR Epost = ?';
    const checkValues = [användarnamn, epost];
  
    connection.query(checkQuery, checkValues, (err, result) => {
      if (err) {
        console.error('Fel vid sökning i databasen: ' + err);
        res.send('Ett fel uppstod vid kontroll av användarnamn och e-post.');
        return;
      }
  
      const count = result[0].count;
  
      if (count > 0) {
        // Användarnamn eller e-post finns redan i databasen
        res.send('Användarnamn eller e-post finns redan i databasen.');
      } else {
        // Skapa en ny användare i databasen
        const lösenord = req.body.losenord;
        const förnamn = req.body.fornamn;
        const efternamn = req.body.efternamn;
        const födelsedatum = req.body.fodelsedatum;
        const bostadsort = req.body.bostadsort;
  
        const insertQuery = 'INSERT INTO Användare (Användarnamn, Lösenord, Förnamn, Efternamn, Epost, Födelsedatum, Bostadsort) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [användarnamn, lösenord, förnamn, efternamn, epost, födelsedatum, bostadsort];
  
        connection.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error('Fel vid sparande av användare i databasen: ' + err);
            res.send('Ett fel uppstod vid sparande av användaren.');
          } else {
            console.log('Användaren har sparats i databasen med ID ' + result.insertId);
            res.send('Användaren har sparats i databasen.');
          }
        });
      }
    });
  });

  app.post('/login', (req, res) => {
    const användarnamn = req.body.anvandarnamn;
    const lösenord = req.body.losenord;
  
    // Kolla om användarnamn och lösenord matchar en användare i databasen
    const sql = 'SELECT * FROM Användare WHERE Användarnamn = ? AND Lösenord = ?';
    const values = [användarnamn, lösenord];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Fel vid sökning i databasen: ' + err);
        res.send('Ett fel uppstod vid inloggning.');
        return;
      }
  
      if (result.length > 0) {
        // Inloggningen lyckades, användarnamn och lösenord matchar en användare i databasen
        res.redirect('loggad');
      } else {
        // Inloggningen misslyckades, ingen matchning hittades
        res.send('Fel användarnamn eller lösenord.');
      }
    });
  });
  
  app.post('/createUser', (req, res) => {
    // Kod för att skapa en ny användare...
  });
  
  app.get('/login', (req, res) => {
    res.render('login');
  });
  
  app.post('/login', (req, res) => {
    if (result.length > 0) {
        // Inloggningen lyckades, användarnamn och lösenord matchar en användare i databasen
        const user = result[0]; // Hämta användarobjektet från resultatet
        res.render('loggad', { user: user }); // Skicka vyen och användarobjektet till klienten
      } else {
        // Inloggningen misslyckades, ingen matchning hittades
        res.send('Fel användarnamn eller lösenord.');
      }
  });
  


  

app.listen(3000, () => {
  console.log('Servern lyssnar på port 3000...');
});