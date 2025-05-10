const connection = require("../../db/mysql/connection.js");
const { promisify } = require("util");

const db = promisify(connection.query).bind(connection);
// get All Operations from mongoDB
const getAllOperationsServiceSQL = async () => {
    try{ 
        const sql = "SELECT * FROM operations";
        const operations = await db(sql);
        return operations;
    }catch(err)
    {
        console.log('An error occurred while getting all operations:', err);
        throw err;
    }
}

// get All Operations from mongoDB by id
const getOperationByIdService = async (id) => {
    try{ 
        const sql = 'SELECT * FROM operations WHERE idoperation = ?';
        const [operation] = await db(sql, [id]);
        if(!operation)
        {
            return null;
        }
        return operation;
    }catch(err)
    {
        console.log('An error occurred while getting all operations:', err);
        throw err;
    }
}

// add a new operation to mongoDB
const addNewOperationServiceSQL = async (operation) => {
    try{
        const sql = 'INSERT INTO operations(idClient, dateOperation, typeOperation, montantOperation) VALUE (?, ?, ?, ?);';
        const result = await db(sql, [operation.idclient, operation.dateoperation, operation.typeoperation, operation.montantoperation]);

        if(result.affectedRows > 0)
        {
            return operation;
        }
        return null;
    }catch(err)
    {
        console.log('An error occurred while adding a new operation:', err);
        throw err;
    }
}

// Delete an operation from mongoDB
const deleteOperationService = async (id) => {
    try{ 
        const sql = 'DELETE FROM operations WHERE idoperation = ?';
        const result = await db(sql, [id]);
        if(result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }catch(err)
    {
        console.log('An error occurred while deleting operation:', err);
        throw err;
    }
}

// update an operation in mongoDB
const updateOperationService = async (id, operation) => {
    try{ 
        const existingOperation = await getOperationByIdService(id);
        if(!existingOperation)
        {
            return null;
        }
        if(!operation.idclient) operation.idclient = existingOperation.idClient;
        if(!operation.dateoperation) operation.dateoperation = existingOperation.dateOperation;
        if(!operation.typeoperation) operation.typeoperation = existingOperation.typeOperation;
        if(!operation.montantoperation) operation.montantoperation = existingOperation.montantOperation;

        const sql = 'UPDATE operations SET idClient = ?, dateOperation = ?, typeOperation = ?, montantOperation = ? WHERE idoperation = ?';
        const result = await db(sql, [operation.idclient, operation.dateoperation, operation.typeoperation, operation.montantoperation, id]);
        if(result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }catch(err)
    {
        console.log('An error occurred while updating operation:', err);
        throw err;
    }
}

module.exports = {
    getAllOperationsServiceSQL,
    getOperationByIdService,
    addNewOperationServiceSQL,
    deleteOperationService,
    updateOperationService
};