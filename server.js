const express = require("express");
const bodyParser = require("body-parser");
const { db, sessionCollection } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.json({ hello: "world" });
});

app.put("/assets/upload", async (req, res) => {
  try {
    const { watermarkUrl, backgroundImageUrl, organizationId, type } = req.body;

    if (type === "watermark") {
      await db.insert({
        organizationId,
        watermarkUrl,
        type: "watermark",
      });
    } else {
      await db.insert({
        organizationId,
        backgroundImageUrl,
        type: "backgroundImage",
      });
    }
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

app.get("/:organizationId/assets", async (req, res) => {
  try {
    const { organizationId } = req.params;
    const assets = await db.find({ organizationId }).toArray();
    res.json({
      success: true,
      data: {
        assets,
      },
      message: "Assets retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

app.put("/:sessionId/assets", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { assetId, type } = req.body;

    let updatedSession;

    // fetch the asset from assets cllection based on the id

    // update the session with the asset id based on the type

    // if (type === "watermarkUrl") {
    //   updatedSession = await db.findOneAndUpdate(
    //     { sessionId },
    //     { $set: { watermarkUrl } },
    //     { new: true }
    //   );
    // } else {
    //   updatedSession = await db.findOneAndUpdate(
    //     { sessionId },
    //     { $set: { backgroundImageUrl } },
    //     { new: true }
    //   );
    // }

    res.status(201).json({
      success: true,
      data: {
        session: updatedSession,
      },
      message: "asset assigned successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
