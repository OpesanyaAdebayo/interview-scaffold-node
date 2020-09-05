const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    organizationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    watermarkUrl: String,
    backgroundImageUrl: String,
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };