const express = require("express");
const router = express.Router();

const {
    getAllOperation,
    addNewOperation,
    deleteOperation,
    updateOperation,
    getOperationById,
    uploadMySQLToMongoDB,
    downloadMongoDBToMySQL
} = require("../../controllers/mysql/operations.controller.js");


router.get("/", getAllOperation);
router.get("/:idoperation", getOperationById);
router.post("/", addNewOperation);
router.delete("/:idoperation", deleteOperation);
router.put("/:idoperation", updateOperation);
router.get("/upload/mysql-to-mongodb", uploadMySQLToMongoDB);
router.get("/download/mongodb-to-mysql", downloadMongoDBToMySQL);

module.exports = router;