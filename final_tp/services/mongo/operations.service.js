const { connect } = require("../../db/mongo/connection.js");

// get All Operations from mongoDB
const getAllOperationsService = async () => {
    try{ 
        const db = await connect();

        const operations = await db.collection("operations").find({}).toArray();

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
        const db = await connect();
        const query = {idoperation: id}
        const operation = await db.collection("operations").findOne(query);
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
const addNewOperationService = async (operation) => {
    try{
        const db = await connect();
        const lastId = await getLastIdOperationService();
        operation.idoperation = lastId + 1;

        const result = await db.collection("operations").insertOne(operation);

        if(result.acknowledged)
        {
            return result.insertedId;
        }
    }catch(err)
    {
        console.log('An error occurred while adding a new operation:', err);
        throw err

    }
}

// get Last ID of operation from mongoDB
const getLastIdOperationService = async () => {
    try{ 
        const db = await connect();

        const lastOperation = await db.collection("operations").find().sort({ idoperation: -1 }).limit(1).toArray();
        if(lastOperation.length === 0)
        {
            return 0;
        }
        return lastOperation[0].idoperation;
    }catch(err)
    {
        console.log('An error occurred while getting last operation:', err);
        throw err;
    }
}

// Delete an operation from mongoDB
const deleteOperationService = async (id) => {
    try{ 
        const db = await connect();


        const result = await db.collection("operations").deleteOne({ idoperation: id });
        
        return result.deletedCount;
    }catch(err)
    {
        console.log('An error occurred while deleting operation:', err);
        throw err;
    }
}

// update an operation in mongoDB
const updateOperationService = async (id, operation) => {
    try{ 
        const db = await connect();

        const query = { idoperation: id };
        const existingOperation = await getOperationByIdService(id);
        if (!existingOperation) {
            return null;
        }

        const newOperation = {
            idoperation: parseInt(id),
            ...existingOperation,
            ...operation
        };
        delete newOperation._id;
        const result = await db.collection("operations").updateOne({ idoperation: id }, { $set: newOperation });
        
        return result.modifiedCount;
    }catch(err)
    {
        console.log('An error occurred while updating operation:', err);
        throw err;
    }
}


module.exports = {
    getAllOperationsService,
    getOperationByIdService,
    getLastIdOperationService,
    addNewOperationService,
    deleteOperationService,
    updateOperationService
};