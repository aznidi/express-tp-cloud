const express = require("express");
const router = express.Router();

const {
    getAllOperation,
    addNewOperation,
    deleteOperation,
    updateOperation,
    getOperationById,
    uploadMongoDBToMySQL,
    downloadMySQLToMongoDB
} = require("../../controllers/mongo/operations.controller.js");


router.get("/", getAllOperation);
router.get("/:idoperation", getOperationById);
router.post("/", addNewOperation);
router.delete("/:idoperation", deleteOperation);
router.put("/:idoperation", updateOperation);
router.get("/upload/mongodb-to-mysql", uploadMongoDBToMySQL);
router.get("/download/mysql-to-mongodb", downloadMySQLToMongoDB);

module.exports = router;