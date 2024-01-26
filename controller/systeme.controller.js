const admin = require("firebase-admin");

const serviceAccount = require("../admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const auth = admin.auth();
const db = admin.firestore();

const authenticated = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await auth.getUserByEmail(email)
    const customToken = await admin.auth().createCustomToken(response.uid);
    res.json({ customToken });
  } catch (error) {
    console.error("Erreur lors de l'authentification de l'utilisateur:", error);
    if (error.code === 'auth/invalid-email') {
      res.status(400).json({ message: 'L\'adresse e-mail est incorrectement formatée.' });
    } else {
      res.status(401).json({ message: 'Erreur d\'authentification' });
    }
  }
};

const addProjet = async (req, res) => {
  const { projet, date, description, priorite } = req.body.values;
  const uid = req.body.uid;

  try {
    const response = await db.collection('projets').add({
      projet,
      date,
      description,
      priorite,
      uid
    });
    res.json({ message: 'projet cree' })
  } catch (error) {

  }
};

const listProjet = async (req, res) => {
  const uid = req.params.uid;

  try {
    const projetRef = db.collection('projets');
    const snapshot = await projetRef.where('uid', '==', `${uid}`).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    const projets = []; 

    snapshot.forEach(doc => {
      projets.push(doc.data()); 
      console.log(projets);
    });

    res.json(projets);
  } catch (error) {

  }
};

module.exports = {
  authenticated,
  addProjet,
  listProjet,
}