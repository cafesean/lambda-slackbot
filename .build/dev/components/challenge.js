var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  sendChallenge: () => sendChallenge
});
async function sendChallenge(req, res) {
  console.log("req body challenge is:", req.body.challenge);
  res.status(200).send(req.body.challenge);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendChallenge
});
//# sourceMappingURL=challenge.js.map
