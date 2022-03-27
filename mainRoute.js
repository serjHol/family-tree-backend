const Router = require("express");
const router = new Router();
const controller = require("./mainController.js")
router.get("", controller.getFamily);
router.get("/member", controller.getMember);
router.post("", controller.createMember);
router.delete("", controller.deleteMember);
router.put("", controller.updateMember);

module.exports = router;