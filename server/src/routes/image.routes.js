"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageRouter = express_1.default.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const imageController = require('../controllers/imagesController');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey
    },
    region: 'us-west-1',
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'aprendamos-a-cocinar',
        metadata: (req, file, cb) => {
            cb(null, { fieldname: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    })
});
// imageRouter.get("/:id",imageController.get_images);
imageRouter.post('/', isLoggedIn, upload.array('form-imgs'), imageController.create_image);
imageRouter.put("/upvotes/:id", isLoggedIn, imageController.upvote);
imageRouter.put("/:id", isLoggedIn, upload.array('form-imgs'), imageController.edit_image);
imageRouter.delete("/:id", isLoggedIn, upload.array('form-imgs'), imageController.delete_image);
module.exports = imageRouter;
//# sourceMappingURL=image.routes.js.map