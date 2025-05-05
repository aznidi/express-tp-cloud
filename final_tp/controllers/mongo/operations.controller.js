const {
    getAllOperationsService,
    getOperationByIdService,
    getLastIdOperationService,
    addNewOperationService,
    deleteOperationService,
    updateOperationService
} = require("../../services/mongo/operations.service.js");

// get All Operations from mongoDB
const getAllOperation = async (req, res) => {
    try{
        const operations = await getAllOperationsService();

        return res.status(200).json(
            {   
                status: 'success',
                message: 'All data fetched successfully',
                data: operations
            });
    }catch(err)
    {
        res.status(500).json(
            {
                status: 'error',
                message: 'Inernal server error',
                error: err.message
            }
        )
    }
}


// get All Operations from mongoDB by id
const getOperationById = async (req, res) => {
    try{
        const id = req.params?.idoperation;
        const operation = await getOperationByIdService(parseInt(id));
        if(!id || isNaN(id))
        {
            return res.status(400).json(
                {
                    status: 'error',
                    message: 'ID must be a number',
                    data: null
                }
            )
        }
        if(!operation)
        {
            return res.status(404).json(
                {
                    status: 'error',
                    message: 'Operation not found',
                    data: null
                }
            )
        }
        return res.status(200).json(
            {   
                status: 'success',
                message: 'Operation fetched successfully',
                data: operation
            });
    }catch(err)
    {
        res.status(500).json(
            {
                status: 'error',
                message: 'Inernal server error',
                error: err.message
            }
        )
    }
}

// add a new operation to mongoDB
const addNewOperation = async (req, res) => {
    try{
        const { idclient, dateoperation, typeoperation, montantoperation } = req.body;

        if(!idclient || !dateoperation || !typeoperation || !montantoperation)
        {
            return res.status(400).json(
                {
                    status: 'error',
                    message: 'All fields are required',
                    data: null
                }
            )
        }
        const newOperation = {
            idclient,
            dateoperation,
            typeoperation,
            montantoperation
        }
        const id = await addNewOperationService(newOperation);
        if(!id)
        {
            return res.status(500).json(
                {
                    status: 'error',
                    message: 'An error occurred while adding the operation',
                    data: null
                }
            )
        }
        return res.status(201).json(
            {   
                status: 'success',
                message: 'Operation added successfully',
                data: id
            });
    }catch(err)
    {
        res.status(500).json(
            {
                status: 'error',
                message: 'Inernal server error',
                error: err.message
            }
        )
    }
}


// delete an operation from mongoDB
const deleteOperation = async (req, res) => {
    try{
        const id = req.params?.idoperation;
        if(!id || isNaN(id))
            {
                return res.status(400).json(
                    {
                        status: 'error',
                        message: 'ID must be a number',
                        data: null
                    }
                )
            }
        const deletedCount = await deleteOperationService(parseInt(id));
        
        if(deletedCount === 0)
        {
            return res.status(404).json(
                {
                    status: 'error',
                    message: 'Operation not found',
                    data: null
                }
            )
        }
        return res.status(200).json(
            {   
                status: 'success',
                message: 'Operation deleted successfully',
                deletedCount: deletedCount
            });
    }catch(err)
    {
        res.status(500).json(
            {
                status: 'error',
                message: 'Inernal server error',
                error: err.message
            }
        )
    }
}

// update an operation in mongoDB
const updateOperation = async (req, res) => {
    try{
        const id = req.params?.idoperation || null;
        if(!id || isNaN(id))
        {
            return res.status(400).json(
                {
                    status: 'error',
                    message: 'ID must be a number',
                    data: null
                }
            )
        }
        const { idclient, dateoperation, typeoperation, montantoperation } = req.body;

        const ExistedOperation = await getOperationByIdService(parseInt(id));
        if(!ExistedOperation)
        {
            res.status(404).json({
                status: 'error',
                message: 'Operation not found',
                data: null
            })
        }

        const updatedOperation = {
            idoperation: id,
            idclient: idclient || ExistedOperation.idclient,
            dateoperation: dateoperation || ExistedOperation.dateoperation,
            typeoperation: typeoperation || ExistedOperation.typeoperation,
            montantoperation: montantoperation || ExistedOperation.montantoperation
        }

        const updatedCount = await updateOperationService(parseInt(id), updatedOperation);
        return res.status(200).json(
            {   
                status: 'success',
                message: 'Operation updated successfully',
                data: updatedCount
            });

    }catch(err)
    {
        res.status(500).json(
            {
                status: 'error',
                message: 'Inernal server error',
                error: err.message
            }
        )
    }
}




module.exports = {
    getAllOperation,
    addNewOperation,
    deleteOperation,
    updateOperation,
    getOperationById
};