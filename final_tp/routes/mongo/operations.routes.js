const express = require("express");
const router = express.Router();

const {
    getAllOperation,
    addNewOperation,
    deleteOperation,
    updateOperation,
    getOperationById
} = require("../../controllers/mongo/operations.controller.js");


router.get("/", getAllOperation);
router.get("/:idoperation", getOperationById);
router.post("/", addNewOperation);
router.delete("/:idoperation", deleteOperation);
router.put("/:idoperation", updateOperation);


module.exports = router;