const data = require('../data/equipes.json');
const express = require('express');
const { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam } = require('../controllers/teams.controller');

const router = express.Router();


// router.get('/', async (req, res) => {
//     const teams = await getAllTeams();
//     res.json(teams);
// });

router.get('/', (req, res) => {
    res.json(getAllTeams());
});




router.get('/:id', (req, res) => {

    const id = req?.params?.id;
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    const team = getTeamById(id);
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
});


router.post('/', (req, res) => {
    const team = req.body;
    const isCreated = createTeam(team);
    if (!isCreated) {
        return res.status(400).json({ message: 'Team data is required' });
    }
    res.json({ message: 'Team created successfully' });
});


router.put('/:id', (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    const team = req.body;
    if (!team?.nom || !team?.country) {
        return res.status(400).json({ message: 'Team data is required' });
    }
    const isUpdated = updateTeam(id, team);
    if (!isUpdated) {
        return res.status(400).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team updated successfully' });
});


router.delete('/:id', (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    const isDeleted = deleteTeam(id);
    if (!isDeleted) {
        return res.status(400).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
});

module.exports = router;

