import { Request, Response } from "express";
import prisma from "../prisma";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select:{
        userId:true,
        email:true,
        username:true,
        profilePictureUrl:true,
        teamId:true,
        Role:true,
        team:{
          select:{
            teamName:true,
          }
        },
      },
    });
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const UpdateUser = async (req:Request , res: Response) :Promise<void> => {
 console.log(req);
  const {email , username , Role , teamId } = req.body;
  try {
    const user = await prisma.user.update({
      where:{
       email,
      },
      data:{
        username,
        Role,
        teamId:parseInt(teamId),
      },
      select:{
        userId:true,
        email:true,
        username:true,
        profilePictureUrl:true,
        teamId:true,
        Role:true,
      }
    });
    if(!user) res.status(403).json({error:"Error is coming to update Your Data"});
    res.status(200).json({ message:"User updated successfully", user})
  } catch (error:any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: `Something went wrong, ${error.message}` });
  }
}

// export const postUser = async (req: Request, res: Response) => {
//   try {
//     const {
//       username,
//       profilePictureUrl = "i1.jpg",
//       teamId = 1,
//     } = req.body;
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         profilePictureUrl,
//         teamId,
//       },
//     });
//     res.json({ message: "User Created Successfully", newUser });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving users: ${error.message}` });
//   }
// };