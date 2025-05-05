const data =[
    {
      "id": 1,
      "nom": "Paris Saint-Germain",
      "country": "France"
    },
    {
      "id": 2,
      "nom": "FC Barcelone",
      "country": "Espagne"
    },
    {
      "id": 3,
      "nom": "Juventus Turin",
      "country": "Italie"
    },
    {
      "id": 4,
      "nom": "Bayern Munich",
      "country": "Allemagne"
    },
    {
      "id": 5,
      "nom": "Benfica Lisbonne",
      "country": "Portugal"
    },
    {
      "id": 6,
      "nom": "RSC Anderlecht",
      "country": "Belgique"
    },
    {
      "id": 7,
      "nom": "Ajax Amsterdam",
      "country": "Pays-Bas"
    },
    {
      "id": 8,
      "nom": "Manchester United",
      "country": "Angleterre"
    },
    {
      "id": 9,
      "nom": "FC Bâle",
      "country": "Suisse"
    },
    {
      "id": 10,
      "nom": "Red Bull Salzbourg",
      "country": "Autriche"
    },
    {
      "id": 1745418978195,
      "nom": "Wydad AC",
      "country": "Maroc"
    }
  ];


// const getAllTeams = async () => {
//     try {
//       const [rows] = await db.query('SELECT * FROM teams');
//       return rows;
//     } catch (err) {
//       console.error('Error fetching teams:', err);
//       return []; 
//     }
// };

const getAllTeams = () => {
    return data;
};

const getTeamById = (id) => {
    const team = data.find(team => team.id === parseInt(id));
    return team;
};


const createTeam = (team) => {
    if (!team?.nom || !team?.country) {
       return false;
    }
    try {
       data.push({
        id: Date.now(),
        nom: team.nom,
        country: team.country
    });
        return true;
    } catch (error) {
        console.error('Error writing to data file:', error);
        return false;
    }
};


const updateTeam = (id, team) => {
    const index = data.findIndex(team => team.id === parseInt(id));
    if (index === -1) {
        return false;
    }
    data[index] = {
        id: parseInt(id),
        nom: team.nom,
        country: team.country
    };
    return true;
};

const deleteTeam = (id) => {
    const index = data.findIndex(team => team.id === parseInt(id));
    if (index === -1) {
        return false;
    }
    data.splice(index, 1);
    return true;
};


// const writeData = (dataToWrite) => {
//     const fs = require('fs');
//     const path = require('path');
//     const filePath = path.join(__dirname, '../data/equipes.json');
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2), 'utf8');
//     } catch (error) {
//         console.error('Error writing to file:', error);
//         throw error;
//     }
// };

// const readData = () => {
//     const fs = require('fs');
//     const path = require('path');
//     const filePath = path.join(__dirname, '../data/equipes.json');
//     try {
//         const rawData = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(rawData);
//     } catch (error) {
//         console.error('Error reading data file:', error);
//         return [];
//     }
// };

module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
};