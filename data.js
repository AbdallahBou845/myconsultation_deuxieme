// data.js





const questions = [
  {
    id: 1,
    text: 'Question 1: Est-ce que vous êtes suivi pour l\'une des maladies suivantes?',
    options: ['Aucune', 'Hypertension artérielle', 'Asthme', 'Diabète', 'Insuffisance rénale', 'Epilepsie', 'Dyslipidémie', 'Anémie', 'Troubles psychiatriques', 'Cardiopathie', 'Ulcère gastrique', 'Endocrinopathie'],
    comment: [], // Default comment value
    audio: 'audio1',
  },
  {
    id: 2,
    text: 'Quels sont les médicaments que vous prenez actuellement (précisez le nom du médicament, le nombre de prises et l’horaire de la prise)?',
    options: [],
    comment: '', // Default comment value
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-045345_182100.mp3',
  },
  {
    id: 3,
    text: 'Est-ce que vous avez effectué des opérations avant?',
    options: ['Non', 'Oui'],
    comment: '', // Default comment value
    audio: 'https://s5-10.ttsmaker-file.com/file/2023-12-03-045550_164256.mp3',
  },
  {
    id: 4,
    text: 'Laissez un commentaire (facultatif):',
    options: [],
    comment: '', // Default comment value
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-045807_172389.mp3',
  },

  
  {
    id: 5,
    text: 'Est-ce que vous aviez un recours à une anesthésie pour une autre raison (endoscopie, accouchement)?',
    options: ['Non', 'Oui'],
    comment: 'Préciser',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 6,
    text: 'Est-ce que vous avez rencontré des complications chirurgicales ou anesthésiques?',
    options: ['Non', 'Oui'],
    comment: 'Préciser',
    audio: 'https://s5-9.ttsmaker-file.com/file/2023-12-03-070237_106641.mp3',
  },
  {
    id: 7,
    text: 'Est-ce que vous étiez hospitalisé avant (à part pour être opérer)?',
    options: ['Non', 'Oui'],
    comment: 'Préciser la cause',
    audio: 'https://s5-4.ttsmaker-file.com/file/2023-12-03-070542_147492.mp3',
  },
  {
    id: 8,
    text: 'Est-ce que vous présentez une allergie pour un médicament?',
    options: ['Non', 'Oui'],
    comment: 'Préciser',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070829_145905.mp3',
  },
  {
    id: 9,
    text: 'Est-ce que vous fumez (ou Neffa)?',
    options: ['Non', 'Oui'],
    comment: 'Nombre de cigarette par jour… Nombre d’année de tabagisme …',
    audio: 'https://s5-10.ttsmaker-file.com/file/2023-12-03-070925_102745.mp3',
  },
  {
    id: 10,
    text: 'Est-ce que vous buvez de l’alcool?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5-9.ttsmaker-file.com/file/2023-12-03-071853_193998.mp3',
  },
 
  {
    id: 11,
    text: 'Est-ce que vous présentez un saignement répété?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-071958_149613.mp3',
  },
  {
    id: 12,
    text: 'Est-ce que vous présentez un saignement prolongé lors d’une plaie?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5-10.ttsmaker-file.com/file/2023-12-03-072114_167542.mp3',
  },
  {
    id: 13,
    text: 'Est-ce que vous présentez des ecchymoses fréquentes sans cause évidente?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5-2.ttsmaker-file.com/file/2023-12-03-072204_154548.mp3',
  },
  {
    id: 14,
    text: 'Est-ce que vous avez rencontré une hémorragie inhabituelle lors d’une opération (ou lors d’une extraction dentaire…)?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  // ... Ajouter d'autres questions au besoin
  {
    id: 15,
    text: 'Est-ce que vous avez reçu une transfusion de sang avant (lors d’une chirurgie ou autre cause)?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 16,
    text: 'Est-ce que vous avez quelqu’un dans la famille qui présente un trouble de la coagulation?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 17,
    text: 'Est-ce que vous avez quelqu’un dans la famille qui présente une maladie musculaire héréditaire?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 18,
    text: 'Est-ce que vous avez quelqu’un dans la famille qui a rencontré un incident en rapport avec l’anesthésie?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 19,
    text: 'Est-ce que vous rencontrez une difficulté à monter deux étages sans repos?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 20,
    text: 'Est-ce que vous rencontrez une difficulté à monter un étage sans repos?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 21,
    text: 'Est-ce que vous présentez une dyspnée lors de l’exercice d’un effort?',
    options: ['Non', 'Oui'],
    comment: '',
    audio: 'https://s5.ttsmaker-file.com/file/2023-12-03-070109_122619.mp3',
  },
  {
    id: 22,
    text: 'Est-ce que vous présentez une douleur thoracique lors de l’exercice d’un effort?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 23,
    text: 'Est-ce que vous ronflez la nuit?',
    options: ['Non', 'Parfois', 'Toujours'],
    comment: '',
  },
  {
    id: 24,
    text: 'Quelqu\'un a-t-il observé que vous vous arrêtiez de respirer pendant votre sommeil?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 25,
    text: 'Sentez-vous souvent fatigué, épuisé ou somnolent pendant la journée?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 26,
    text: 'Sentez-vous des palpitations sans cause évidente?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 27,
    text: 'Présentez-vous parfois une vertige ou syncope?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 28,
    text: 'Avez-vous une prothèse dentaire?',
    options: ['Non', 'Dents fixes', 'Dents instables'],
    comment: '',
  },
  {
    id: 29,
    text: 'Avez-vous une pathologie en rapport avec la colonne vertébrale?',
    options: ['Non', 'Douleur', 'Autres problèmes'],
    comment: 'Préciser',
  },
  // ... Ajouter d'autres questions au besoin
  {
    id: 30,
    text: 'Quels sont vos chiffres tensionnels habituels :',
    options: ['Moins 8','Entre 8 et 13 ','Plus 13'],
    comment: '',
  },
  
   
  {
    id: 31,
    text: 'Marchez-vous à l\'intérieur (par exemple vous déplacer autour de votre maison)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 32,
    text: 'Marchez-vous 1 à 2 blocs de maisons sur un sol plat (par exemple sur environ 200m sur chemin plat)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 33,
    text: 'Est-ce que vous pouvez monter un escalier ou une colline (par exemple un étage d\'un escalier)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 34,
    text: 'Est-ce que vous pouvez courir sur une courte distance?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 35,
    text: 'Est-ce que vous pouvez faire des travaux légers à la maison (par exemple nettoyer la poussière, laver les vaisselles)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 36,
    text: 'Est-ce que vous pouvez faire des travaux modérés à la maison (par exemple, passer l\'aspirateur, balayer le sol, porter les courses)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 37,
    text: 'Est-ce que vous pouvez faire de gros travaux à la maison (par exemple, soulever ou déplacer des meubles lourds)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 38,
    text: 'Est-ce que vous pouvez faire du jardinage (par exemple ratisser les feuilles, désherber, pousser la tondeuse du gazon)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 39,
    text: 'Est-ce que vous pouvez avoir des relations sexuelles?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 40,
    text: 'Est-ce que vous pouvez participer à des activités récréatives modérées (par exemple, golf, bowling, danse, tennis en double, lancer une balle de baseball)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 41,
    text: 'Est-ce que vous pouvez participer à des sports intenses (par exemple, natation, tennis en simple, football, basket-ball, ski)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 42,
    text: 'Est-ce que vous avez présenté des nausées et des vomissements après une opération (dans les 24 heures suivant l’opération) ou vous avez un mal de transport?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 43,
    text: 'Est-ce que votre activité usuelle entraîne soit fatigue, dyspnée, douleurs angineuses ou palpitations?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 44,
    text: 'Est-ce que vous êtes confortable au repos, mais l\'activité physique habituelle entraîne fatigue, palpitations ou dyspnée?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 45,
    text: 'Est-ce que vous présentez une dyspnée, palpitations ou fatigue au repos et en cas d\'effort, la gêne augmente?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 46,
    text: 'Est-ce que vous avez présenté une infection respiratoire dans le mois précédent?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  // Pour les femmes
  {
    id: 47,
    text: 'Est-ce que vous êtes enceinte (ou vous pouvez l’être)?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 48,
    text: 'Est-ce que vous êtes allaitante?',
    options: ['Non', 'Oui'],
    comment: '',
  },
  {
    id: 49,
    text: 'Nombre de grossesse :',
    options: ['1','2','3','plus'],
    comment: '',
  },
  {
    id: 50,
    text: 'Nombre d’accouchement :',
    options: ['1','2','3','plus'],
    comment: '',
  },
  {
    id: 51,
    text: 'Nombre d’enfant vivant :',
    options: ['1','2','3','plus'],
    comment: '',
  },
  // Pour les enfants
  {
    id: 52,
    text: 'Né par : ',
    options: ['Voie basse','Césarienne'],
    comment: '',
  },
  {
    id: 53,
    text: 'Est-ce qu’il est prématuré : ',
    options: ['Non','Oui'],
    comment: '',
  },
  {
    id: 54,
    text: 'Est-ce que les parents sont apparentés : ',
    options: ['Non','Oui'],
    comment: '',
  },
  {
    id: 55,
    text: 'Est-ce qu’il était hospitalisé après la naissance : ',
    options: ['Non','Oui'],
    comment: '',
  },
  {
    id: 56,
    text: 'Est-ce que le développement psychomoteur est normal : ',
    options: ['Non','Oui'],
    comment: '',
  },
  {
    id: 57,
    text: 'Est-ce qu’il a reçu tous les vaccins nécessaires :',
    options: ['Non','Oui'],
    comment: '',
  },
  {
    id: 58,
    text: 'Est-ce qu’il a présenté des convulsions fébriles durant l’enfance :',
    options: ['Non','Oui'],
    comment: '',
  },
  {
    id: 59,
    text: 'Sexe :',
    options: ['Féminin','Masculin '],
    comment: '',
  },
];


module.exports = { questions };
