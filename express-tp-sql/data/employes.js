
const employes = [
  {
    matricule: 5678,
    nom: "JAMIL",
    prenom: "Jaafar",
    fonction: "Chef service",
    affectation: "Direction commerciale",
    salaire: 12340.5,
    age: 27,
    adresse: {
      rue: "Les orangers, Imm Houda appt 5",
      ville: "Casablanca",
      localite: "Anfa",
      postalcode: 20100
    }
  },
  {
    matricule: 1234,
    nom: "ALAMI",
    prenom: "Karim",
    fonction: "Directeur",
    affectation: "Direction générale",
    salaire: 25000.0,
    age: 45,
    adresse: {
      rue: "Rue des Fleurs, Résidence Jasmin appt 10",
      ville: "Rabat",
      localite: "Agdal",
      postalcode: 10000
    }
  },
  {
    matricule: 2345,
    nom: "BENANI",
    prenom: "Samira",
    fonction: "Responsable RH",
    affectation: "Ressources humaines",
    salaire: 15000.75,
    age: 38,
    adresse: {
      rue: "Avenue Mohammed V, Imm Safae appt 3",
      ville: "Casablanca",
      localite: "Maarif",
      postalcode: 20330
    }
  },
  {
    matricule: 3456,
    nom: "TAZI",
    prenom: "Younes",
    fonction: "Ingénieur",
    affectation: "Direction technique",
    salaire: 18500.25,
    age: 32,
    adresse: {
      rue: "Rue Ibn Sina, Résidence Al Fath appt 7",
      ville: "Marrakech",
      localite: "Guéliz",
      postalcode: 40000
    }
  },
  {
    matricule: 4567,
    nom: "CHAOUI",
    prenom: "Fatima",
    fonction: "Comptable",
    affectation: "Direction financière",
    salaire: 11200.0,
    age: 29,
    adresse: {
      rue: "Boulevard Zerktouni, Imm Atlas appt 12",
      ville: "Casablanca",
      localite: "Racine",
      postalcode: 20100
    }
  },
  {
    matricule: 6789,
    nom: "IDRISSI",
    prenom: "Mohammed",
    fonction: "Technicien",
    affectation: "Maintenance",
    salaire: 8500.5,
    age: 35,
    adresse: {
      rue: "Rue Al Madina, Résidence Nour appt 2",
      ville: "Tanger",
      localite: "Centre ville",
      postalcode: 90000
    }
  },
  {
    matricule: 7890,
    nom: "BERRADA",
    prenom: "Nadia",
    fonction: "Assistante",
    affectation: "Direction générale",
    salaire: 9800.25,
    age: 31,
    adresse: {
      rue: "Avenue Hassan II, Imm Yasmine appt 8",
      ville: "Fès",
      localite: "Ville nouvelle",
      postalcode: 30000
    }
  },
  {
    matricule: 8901,
    nom: "OUAZZANI",
    prenom: "Ahmed",
    fonction: "Commercial",
    affectation: "Direction commerciale",
    salaire: 13400.0,
    age: 33,
    adresse: {
      rue: "Rue Abou Bakr Seddik, Résidence Amira appt 4",
      ville: "Casablanca",
      localite: "Bourgogne",
      postalcode: 20050
    }
  },
  {
    matricule: 9012,
    nom: "BENJELLOUN",
    prenom: "Laila",
    fonction: "Analyste",
    affectation: "Direction informatique",
    salaire: 16700.5,
    age: 30,
    adresse: {
      rue: "Avenue Moulay Ismail, Imm Orchidée appt 9",
      ville: "Rabat",
      localite: "Hassan",
      postalcode: 10020
    }
  },
  {
    matricule: 1122,
    nom: "CHRAIBI",
    prenom: "Omar",
    fonction: "Développeur",
    affectation: "Direction informatique",
    salaire: 17800.75,
    age: 28,
    adresse: {
      rue: "Rue Ibn Khaldoun, Résidence Salma appt 6",
      ville: "Casablanca",
      localite: "Gauthier",
      postalcode: 20060
    }
  },
  {
    matricule: 2233,
    nom: "FASSI",
    prenom: "Hind",
    fonction: "Responsable marketing",
    affectation: "Direction marketing",
    salaire: 14900.0,
    age: 36,
    adresse: {
      rue: "Boulevard Anfa, Imm Cristal appt 15",
      ville: "Casablanca",
      localite: "Anfa",
      postalcode: 20370
    }
  },
  {
    matricule: 3344,
    nom: "ZIANI",
    prenom: "Rachid",
    fonction: "Technicien",
    affectation: "Direction technique",
    salaire: 9200.5,
    age: 34,
    adresse: {
      rue: "Rue Al Farabi, Résidence Jawhara appt 3",
      ville: "Agadir",
      localite: "Talborjt",
      postalcode: 80000
    }
  },
  {
    matricule: 4455,
    nom: "LAHLOU",
    prenom: "Salma",
    fonction: "Assistante RH",
    affectation: "Ressources humaines",
    salaire: 8900.25,
    age: 26,
    adresse: {
      rue: "Avenue Mohammed VI, Imm Malak appt 11",
      ville: "Marrakech",
      localite: "Hivernage",
      postalcode: 40020
    }
  },
  {
    matricule: 5566,
    nom: "BENNANI",
    prenom: "Youssef",
    fonction: "Auditeur",
    affectation: "Direction financière",
    salaire: 19500.0,
    age: 40,
    adresse: {
      rue: "Rue Abdelmoumen, Résidence Riad appt 14",
      ville: "Casablanca",
      localite: "Quartier des hôpitaux",
      postalcode: 20360
    }
  },
  {
    matricule: 6677,
    nom: "TAHIRI",
    prenom: "Amina",
    fonction: "Chargée de projet",
    affectation: "Direction technique",
    salaire: 13800.5,
    age: 32,
    adresse: {
      rue: "Boulevard Ghandi, Imm Ghita appt 7",
      ville: "Casablanca",
      localite: "Maarif",
      postalcode: 20330
    }
  },
  {
    matricule: 7788,
    nom: "MANSOURI",
    prenom: "Khalid",
    fonction: "Responsable logistique",
    affectation: "Direction logistique",
    salaire: 14200.75,
    age: 39,
    adresse: {
      rue: "Rue Ibnou Mounir, Résidence Firdaous appt 5",
      ville: "Tanger",
      localite: "Ibéria",
      postalcode: 90060
    }
  },
  {
    matricule: 8899,
    nom: "RADI",
    prenom: "Sanaa",
    fonction: "Commerciale",
    affectation: "Direction commerciale",
    salaire: 11800.0,
    age: 29,
    adresse: {
      rue: "Avenue Hassan I, Imm Zina appt 8",
      ville: "Rabat",
      localite: "Océan",
      postalcode: 10040
    }
  },
  {
    matricule: 9900,
    nom: "SAADI",
    prenom: "Hamza",
    fonction: "Ingénieur réseau",
    affectation: "Direction informatique",
    salaire: 16500.5,
    age: 31,
    adresse: {
      rue: "Rue Oued Ziz, Résidence Kamal appt 12",
      ville: "Kénitra",
      localite: "Mimosas",
      postalcode: 14000
    }
  },
  {
    matricule: 1010,
    nom: "MOUSSAOUI",
    prenom: "Leila",
    fonction: "Responsable qualité",
    affectation: "Direction qualité",
    salaire: 15800.25,
    age: 37,
    adresse: {
      rue: "Boulevard Mohammed V, Imm Bahia appt 9",
      ville: "Casablanca",
      localite: "Derb Omar",
      postalcode: 20250
    }
  },
  {
    matricule: 2020,
    nom: "FILALI",
    prenom: "Kamal",
    fonction: "Architecte",
    affectation: "Direction technique",
    salaire: 21000.0,
    age: 42,
    adresse: {
      rue: "Rue Tarik Ibn Ziad, Résidence Alya appt 10",
      ville: "Rabat",
      localite: "Souissi",
      postalcode: 10170
    }
  }
]
module.exports = { employes };
