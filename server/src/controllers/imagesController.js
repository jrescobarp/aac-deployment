const Image = require("../models/image");
const Comment = require("../models/comment");
const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
// const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'; 
dotenv.config();

const s3 = new S3Client({
    credentials:{
      accessKeyId: process.env.AWSAccessKeyId,
      secretAccessKey: process.env.AWSSecretKey
    },
    region: 'us-west-1',
  });

exports.get_comments = asyncHandler(async(req, res, next) => {
    // Comment.findById(req.params.id).populate('replies').then((comment) =>{
    //     res.status(200).send(comment);
    // });
});

exports.create_image = asyncHandler(async(req, res, next) => {
    const image = new Image(req.body);
    req.body.imgOrder = JSON.parse(req.body.imgOrder);
    const imgs = req.files.map(f => ({ url: f.location, filename: f.key }));
    image.imgDataArr.push(...imgs);
    image.upvotes = [];

     // Edit Img order
     let correctImgArr = [];
     req.body.imgOrder.forEach((element, index) => {
         image.imgDataArr.forEach((e, i) => {
             if(e.filename.includes(element.filename)){
                 correctImgArr.push(e);
             }
         });
     });
     if(correctImgArr.length === image.imgDataArr.length){
         // make sure no images were deleted due to utf encoding
         image.imgDataArr = correctImgArr;
     }

    const response = await image.save();
    await Recipe.findByIdAndUpdate(req.body.recipe_id, {$push:{images:image._id}}, { new: true } );
    res.status(200).send(response);
});

exports.edit_image = asyncHandler(async(req, res, next) => {
    req.body.imgDataArr = JSON.parse(req.body.imgDataArr);
    req.body.imgOrder = JSON.parse(req.body.imgOrder);
    req.body.deleteImgs = JSON.parse(req.body.deleteImgs);
    const image = new Image(req.body);
    const imgs = req.files.map(f => ({ url: f.location, filename: f.key }));
    image.imgDataArr.push(...imgs);

    // delete images from s3
    if (req.body.deleteImgs.length) {
        let delObjArr = [];
        for (let filename of req.body.deleteImgs) {
            delObjArr.push({Key: filename});
        }
        const command = new DeleteObjectsCommand({
            Bucket: 'aprendamos-a-cocinar',
            Delete: {
              Objects: delObjArr,
            },
        });
        // console.log("FNs: ", delObjArr);
    
        try {
        // await s3.send(command);
        await s3.send(command, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
        console.log(`Successfully deleted objects from S3 bucket. Deleted objects:`);
        } catch (err) {
        console.error(err);
        }
    }

    // Edit Img order
    let correctImgArr = [];
    req.body.imgOrder.forEach((element, index) => {
        image.imgDataArr.forEach((e, i) => {
            if(e.filename.includes(element.filename)){
                correctImgArr.push(e);
            }
        });
    });
    if(correctImgArr.length === image.imgDataArr.length){
        // make sure no images were deleted due to utf encoding
        image.imgDataArr = correctImgArr;
    }

    // update mongo
    const response = await Image.findByIdAndUpdate(req.params.id, {description: image.description, upvotes: image.upvotes, imgDataArr: image.imgDataArr},{ new: true } )
    .catch((err) => {
        console.log("ERROR: ", err);
    });
    console.log(`editImg response: ${JSON.stringify(response)}`);
    res.status(200).send(response);
});

exports.upvote = asyncHandler(async(req, res, next) => {
    const image = new Image(req.body);
    const response = await Image.findByIdAndUpdate(req.params.id, {upvotes: image.upvotes},{ new: true } ).then((res) => {
    }).catch((err) => {
        console.log("ERROR: ", err);
    });
    res.status(200).send(response);
});

exports.delete_image = asyncHandler(async(req, res, next) => {
    req.body.deleteImgs = JSON.parse(req.body.deleteImgs);

    // delete images from s3
    if (req.body.deleteImgs.length) {
        let delObjArr = [];
        for (let filename of req.body.deleteImgs) {
            delObjArr.push({Key: filename});
        }
        const command = new DeleteObjectsCommand({
            Bucket: 'aprendamos-a-cocinar',
            Delete: {
              Objects: delObjArr,
            },
        });
    
        try {
        // await s3.send(command);
        await s3.send(command, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
        console.log(`Successfully deleted objects from S3 bucket. Deleted objects:`);
        } catch (err) {
        console.error(err);
        }
    }

    // update mongo
    const response = await Image.findByIdAndDelete(req.params.id).then((res) => {
    }).catch((err) => {
        console.log("ERROR: ", err);
    });
    res.status(200).send(response);
});