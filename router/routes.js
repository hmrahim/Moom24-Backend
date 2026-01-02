const router = require("express").Router();
const {
  CartPostController,
  CartGetController,
  CartDeleteController,
  CartUpdateController,
  confrimOrder,
  getConfirmOrderController,
  getConfirmOrderByEmailController,
  postCustomarInfo,
  confirmOrder,
  confirmOrderController,
  DeleteAllCartController,
  getConfirmOrderByIdController,
  cancelledOrderController,
  updateConfirmOrderStatus,
  geAlltConfirmOrderByEmailController,
  getunConfirmedOrderByEmail,
  promocodePostController,
  promocodeGetControllers,
  getPromoByIdController,
  promoPutController,
  deletePromo,
  getDistanceController,
} = require("../controllers/CartController");
const {
  categoryGetController,
  categoryGetByIdController,
  categoryPostController,
  categoryPutController,
  categoryDeleteController,
} = require("../controllers/CategoryController");
const {
  productGetController,
  productPostController,
  productPutController,
  productFindOneById,
  productDeleteController,
  productSeacrhController,
  infinitScroll,
} = require("../controllers/productController");
const {
  getRiderController,
  getRiderByEmailController,
  getAllRidersDataController,
} = require("../controllers/RiderController");
const {
  settingsPostController,
  getSettingsData,
} = require("../controllers/SettingsController");

const {
  userGetController,
  userPostController,
  userPutController,
  userGetControllerBYEmail,
} = require("../controllers/UserController");
const {
  visitorsPostController,
  visitorsGetController,
} = require("../controllers/VisitorsController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const categoryValidator = require("../validations/categoryValidator");
const productValidation = require("../validations/productValidation");
const userValidator = require("../validations/userValidation");
// ==============public api===============
router.get("/product", productGetController);
router.get("/product/:id", productFindOneById);
router.get("/infinite-scroll", infinitScroll);

// ==================protected api===================
router.post(
  "/product",
  authMiddleware,
  productValidation,
  productPostController
);
router.put("/product/:id", authMiddleware, productPutController);
router.delete("/product/:id", authMiddleware, productDeleteController);
router.get("/search", authMiddleware, productSeacrhController);

//================= Categor routes=================
router.post(
  "/category",
  authMiddleware,
  categoryValidator,
  categoryPostController
);
router.get("/category", authMiddleware, categoryGetController);
router.get("/category/:id", authMiddleware, categoryGetByIdController);
router.put("/category/:id", authMiddleware, categoryPutController);
router.delete("/category/:id", authMiddleware, categoryDeleteController);

// =========================User Routes =============================
router.get("/user", authMiddleware, userGetController);
router.get("/user/:email", userGetControllerBYEmail);
router.post("/user", userValidator, userPostController);
router.put("/user", userPutController);

// =========================Cart======================
router.post("/cart", authMiddleware, CartPostController);
router.get("/cart/:email",authMiddleware, CartGetController);
router.delete("/cart/:id", authMiddleware, CartDeleteController);
router.put("/cart/:id", authMiddleware, CartUpdateController);
router.post("/confirm-order", authMiddleware, postCustomarInfo);
router.get("/distence-customer/:email", authMiddleware, getDistanceController);

//============== confrim order route==========
router.get("/confirm-order/:email", authMiddleware, getunConfirmedOrderByEmail);
router.get("/confirm-order", authMiddleware, getConfirmOrderController);

router.get(
  "/confirm-order-by-id/:id",
  authMiddleware,
  getConfirmOrderByIdController
);

router.get(
  "/confirm-order/customer/:email",
  authMiddleware,
  getConfirmOrderByEmailController
);
router.get(
  "/confirm-order/history/:email",
  authMiddleware,
  geAlltConfirmOrderByEmailController
);
router.put("/confirm-order/:email", authMiddleware, confirmOrderController);
router.put("/cancel-order/:id", cancelledOrderController);
router.patch("/update-confirm-order/:id", updateConfirmOrderStatus);
// ================rider routes ==============
router.get("/riders", authMiddleware, getRiderController);
router.get("/riders/:email", authMiddleware, getRiderByEmailController);
router.get(
  "/riders/all-data/:email",
  authMiddleware,
  getAllRidersDataController
);

// ===================settings==========================
router.put(
  "/settings",
  authMiddleware,
  upload.single("image"),
  settingsPostController
);
router.get("/settings", getSettingsData);

// ======================================visitors========================
router.post("/visitors", visitorsPostController);
router.get("/visitors", authMiddleware, visitorsGetController);

// ===============================Promocode controllers ===============================
router.post("/promocode", authMiddleware, promocodePostController);
router.get("/promocode", authMiddleware, promocodeGetControllers);
router.get("/promocode/:id", authMiddleware, getPromoByIdController);
router.put("/promocode/:id", authMiddleware, promoPutController);
router.delete("/promocode/:id", authMiddleware, deletePromo);

module.exports = router;
