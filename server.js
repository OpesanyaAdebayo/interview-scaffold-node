const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { Session } = require("./models/Session");
const { Asset } = require("./models/Asset");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
  });

app.get("/", async (req, res) => {
  res.json({ hello: "world" });
});

app.post("/assets/upload", async (req, res) => {
  const requestSchema = Joi.object({
    watermarkUrl: Joi.when("type", {
      is: "watermark",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    backgroundImageUrl: Joi.when("type", {
      is: "backgroundImage",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    organizationId: Joi.string().required(),
    type: Joi.string().valid("watermark", "backgroundImage"),
  }).or("backgroundImageUrl", "watermarkUrl");

  try {
    const validation = requestSchema.validate(req.body);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        error: validation.error.details[0].message,
      });
    }
    const { watermarkUrl, backgroundImageUrl, organizationId, type } = req.body;

    const asset = new Asset({
      organizationId,
      watermarkUrl,
      backgroundImageUrl,
      type,
    });

    await asset.save();
    return res.status(201).json({
      success: true,
      message: "Asset uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

app.get("organizations/:organizationId/assets", async (req, res) => {
  try {
    const { organizationId } = req.params;
    const assets = await Asset.find({ organizationId });
    res.json({
      success: true,
      data: {
        assets,
      },
      message: "Assets retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

app.put("/sessions/:sessionId/asset", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { assetId } = req.body;

    const asset = await Asset.findOne({ _id: mongoose.Types.ObjectId(assetId) });
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "Could not find an asset associated with this ID",
      });
    }

    const session = await Session.findOne({ sessionId: mongoose.Types.ObjectId(sessionId) });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Could not find a session with this ID",
      });
    }

    if (asset.type === 'watermark') {
     session.watermarkUrl = asset.watermarkUrl;
    } else {
     session.backgroundImageUrl = asset.backgroundImageUrl
    }
    await session.save();

    return res.status(200).json({
      success: true,
      message: "asset updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

app.get('/sessions/:sessionId/assets', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.find({ sessionId }, 'watermarkUrl backgroundImageUrl');
    return res.json({
      success: true,
      data: {
        assets: session,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
