import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const generateUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;
    console.log(fileName , fileType);
    
    if (!fileName || !fileType) {
      return res.status(400).json({ error: "Missing fileName or fileType" });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 180 });
    return res.status(200).json({ url });
    
  } catch (err) {
    console.error("S3 Presign error:", err);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

export const DeleteImage = async (req:Request,res : Response)=>{
  const {fileName} = req.body;

  if(!fileName){
    return res.status(400).json({error:"Missing FileName For Deletion"});
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket:process.env.AWS_BUCKET_NAME!,
      Key: fileName,
    });

    await s3.send(command);
    res.status(200).json({message: "Image deleted successfully"});
  } catch (err){
   console.error("Error deleting image:", err);
   res.status(500).json({error: "Failed to delete image"});
  }
};