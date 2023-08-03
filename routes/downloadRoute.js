const express = require("express");
const router = express.Router();

// Controllers
const { sendDownloadFile } = require("../services/downloadService");

router.get("/patch", sendDownloadFile("conqista-co-patch.rar"));
router.get("/client", sendDownloadFile("conqista-co-client.exe"));

module.exports = router;
