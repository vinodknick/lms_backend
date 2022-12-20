const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Document = require("../models/documentModel");

 
//************* file upload on s3Busket */
exports.uploadDocument = catchAsyncErrors(async(req, res,next)=> {
 const userId = req.user._id;
 const {docTitle,matter,receiveDate,category} = req.body

if(receiveDate==""){
   return next(new Error("Receive date is required"));
}
const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

if(!regex.test(receiveDate)){
   return next(new Error("Receive date is invalid"));
}
 var docs = [];
 for (let i = 0; i < req?.files.length; i++) {
     docs[i] = req?.files[i].location;
 }
 const upload = await Document.create({
    userId,
    docTitle,
    matter,
    category,
    receiveDate,
    files: docs
 })
 return res.status(201).json({
    success: true,
    message: "Document upload successfully",
    data: upload,
  }); 
});


// ******** get documents **********
// exports.getDocuments = catchAsyncErrors(async(req, res,next)=> {
//    const documents = await Document.find().populate("userId");
//    console.log("documents", documents)

//    return res.status(200).json({
//     success: true,
//     message: "Get documents successfully",
//     data: documents,
//    });
// });
  



