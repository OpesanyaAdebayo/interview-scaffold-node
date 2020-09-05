const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    type: { type: String, required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    watermarkUrl: String,
    backgroundImageUrl: String,
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = { Asset };