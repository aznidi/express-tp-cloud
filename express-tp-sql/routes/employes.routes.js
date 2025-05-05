const express = require("express");
const router = express.Router();
const { getAllEmployes, getEmployeByMatricule, addEmploye, updateEmploye, deleteEmploye, getEmployesByFilter, getEmployesBySalary } = require("../controllers/employes.controller");

/**
 * @swagger
 * /employes:
 *   get:
 *     summary: Récupérer tous les employés
 *     responses:
 *       200:
 *         description: Liste de tous les employés
 */
router.get("/", getAllEmployes);

/**
 * @swagger
 * /employes/{matricule}:
 *   get:
 *     summary: Récupérer un employé par son matricule
 *     parameters:
 *       - in: path
 *         name: matricule
 *         required: true
 *         schema:
 *           type: string
 *         description: Le matricule de l'employé
 *     responses:
 *       200:
 *         description: Employé trouvé
 *       404:
 *         description: Employé non trouvé
 */
router.get("/:matricule", getEmployeByMatricule);

/**
 * @swagger
 * /employes:
 *   post:
 *     summary: Ajouter un nouvel employé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricule
 *               - nom
 *               - prenom
 *               - fonction
 *               - affectation
 *               - salaire
 *               - age
 *               - rue
 *               - ville
 *               - localite
 *               - postalcode
 *             properties:
 *               matricule:
 *                 type: integer
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               fonction:
 *                 type: string
 *               affectation:
 *                 type: string
 *               salaire:
 *                 type: number
 *               age:
 *                 type: integer
 *               rue:
 *                 type: string
 *               ville:
 *                 type: string
 *               localite:
 *                 type: string
 *               postalcode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employé créé avec succès
 *       500:
 *         description: Erreur lors de la création de l'employé
 */
router.post("/", addEmploye);

/**
 * @swagger
 * /employes/{matricule}:
 *   put:
 *     summary: Mettre à jour un employé
 *     parameters:
 *       - in: path
 *         name: matricule
 *         required: true
 *         schema:
 *           type: string
 *         description: Le matricule de l'employé à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               fonction:
 *                 type: string
 *               affectation:
 *                 type: string
 *               salaire:
 *                 type: number
 *               age:
 *                 type: integer
 *               rue:
 *                 type: string
 *               ville:
 *                 type: string
 *               localite:
 *                 type: string
 *               postalcode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employé mis à jour avec succès
 *       404:
 *         description: Employé non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.put("/:matricule", updateEmploye);

/**
 * @swagger
 * /employes/{matricule}:
 *   delete:
 *     summary: Supprimer un employé
 *     parameters:
 *       - in: path
 *         name: matricule
 *         required: true
 *         schema:
 *           type: string
 *         description: Le matricule de l'employé à supprimer
 *     responses:
 *       200:
 *         description: Employé supprimé avec succès
 *       404:
 *         description: Employé non trouvé
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete("/:matricule", deleteEmploye);

/**
 * @swagger
 * /employes/filter-by-age/{age}:
 *   get:
 *     summary: Récupérer les employés par âge
 *     parameters:
 *       - in: path
 *         name: age
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'âge des employés à rechercher
 *     responses:
 *       200:
 *         description: Liste des employés filtrés par âge
 *       500:
 *         description: Erreur lors de la récupération
 */
router.get("/filter-by-age/:age", getEmployesByFilter);

/**
 * @swagger
 * /employes/filter-by-salary/{min}/{max}:
 *   get:
 *     summary: Récupérer les employés par plage de salaire
 *     parameters:
 *       - in: path
 *         name: min
 *         required: true
 *         schema:
 *           type: number
 *         description: Le salaire minimum
 *       - in: path
 *         name: max
 *         required: true
 *         schema:
 *           type: number
 *         description: Le salaire maximum
 *     responses:
 *       200:
 *         description: Liste des employés filtrés par salaire
 *       500:
 *         description: Erreur lors de la récupération
 */
router.get("/filter-by-salary/:min/:max", getEmployesBySalary);

module.exports = router;