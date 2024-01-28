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
  const id = req.body.id;

  try {
    const response = await db.collection('projets').add({
      id,
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

const editProjet = async (req, res) => {

  const { projet, date, description, priorite } = req.body.values;
  const uid = req.body.uid;
  const id = req.body.id;

  try {
    const projetRef = db.collection('projets');
    const snapshot = await projetRef.where('id', '==', id).get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.status(404).json({ error: 'Aucun projet trouvé pour cet utilisateur.' });
    }

    snapshot.forEach(async (doc) => {
      try {
        await projetRef.doc(doc.id).update({
          projet: projet || doc.data().projet,
          date: date || doc.data().date,
          description: description || doc.data().description,
          priorite: priorite || doc.data().priorite
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du projet :', error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du projet.' });
      }
    });

    return res.json({ message: 'Projet mis à jour avec succès.' });

  } catch (error) {
    console.error('Erreur lors de la récupération des projets :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des projets.' });
  }
};

const deleteProjet = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const projetRef = db.collection('projets');
    const snapshot = await projetRef.where('id', '==', id).get();

    snapshot.forEach(async (doc) => {
      const documentRef = db.collection('projets').doc(doc.id);
      await documentRef.delete();
      console.log('Document supprimé avec succès');
    });

    
    return res.json({ message: 'Projet mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression des documents :', error);
    res.status(500).send('Erreur lors de la suppression des documents');
  }
};


// Vérifiez d'abord si le document avec l'ID spécifié existe
//   const projetRef = db.collection('projets');
//   const snapshot = await projetRef.where('id', '==', id).get();

//   // Vérifiez si le document existe
//   if (snapshot.empty) {
//     console.log('Aucun document trouvé avec cet ID :', id);
//     return res.status(404).send('Aucun document trouvé avec cet ID');
//   }

//   // Si le document existe, procédez à sa suppression
//   const documentRef = db.collection('projets').doc(id);
//   await documentRef.;

//   console.log('Document supprimé avec succès');
//   res.status(200).send('Document supprimé avec succès');
// } catch (error) {
//   console.error('Erreur lors de la suppression du document :', error);
//   res.status(500).send('Erreur lors de la suppression du document');
// }




module.exports = {
  authenticated,
  addProjet,
  editProjet,
  deleteProjet
}