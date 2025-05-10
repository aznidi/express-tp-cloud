const { getAllOperationsServiceSQL, addNewOperationServiceSQL } = require("../mysql/operations.service.js");
const { getAllOperationsService, addNewOperationService } = require("../mongo/operations.service.js");

// upload all operations from MySQL to MongoDB
const uploadOperationsToMongoDB = async (operations) => {
    try{
        let uploadedCountItems = 0;
        for(const operation of operations)
        {
            const operationToMongoDB = {
                idclient: operation.idClient,
                dateoperation: operation.dateOperation,
                typeoperation: operation.typeOperation,
                montantoperation: operation.montantOperation
            }
            
            const result = await addNewOperationService(operationToMongoDB);
            if(result)
            {
                uploadedCountItems++;
            }
        }
        return uploadedCountItems;
    }catch(err)
    {
        console.log('An error occurred while uploading operations to MongoDB:', err);
        throw err;
    }
}

// download all operations from MongoDB to MySQL
const downloadOperationsFromMongoDB = async () => {
    try{
        const operations = await getAllOperationsService();
        let downloadedCountItems = 0;
        for(const operation of operations)
        {
            const result = await addNewOperationServiceSQL(operation);
            if(result)
            {
                downloadedCountItems++;
            }
        }
        return downloadedCountItems;
    }catch(err)
    {
        console.log('An error occurred while downloading operations from MongoDB:', err);
        throw err;
    }
}

module.exports = {
    uploadOperationsToMongoDB,
    downloadOperationsFromMongoDB
}; 