const Message = require('../models/Message')

const getMessagesBySenderIdAndReceiverId = async (req, res) => {
    try{
        const { senderId, receiverId } = req.query;

        const messages = await Message.find({
            where:{
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId}
                ]
            },
            order: [['date', 'ASC']]
        });

        res.json(messages);
    } catch (err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error'});
    }
};

module.exports = getMessagesBySenderIdAndReceiverId;