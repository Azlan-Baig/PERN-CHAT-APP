import { Request, Response } from "express";
import primsa from "../db/prisma.js";
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await primsa.conversation.findFirst({
      where: {
        participantsId: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    if (!conversation) {
      conversation = await primsa.conversation.create({
        data: {
          participantsId: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    const newMessage = await primsa.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await primsa.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });

      return res.status(201).json(newMessage)
    }
  } catch (error: any) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMessages = async(req: Request, res: Response)=>{
  try {
		const { id: userToChatId } = req.params;
		const senderId = req.user.id;

		const conversation = await primsa.conversation.findFirst({
			where: {
				participantsId: {
					hasEvery: [senderId, userToChatId],
				},
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (!conversation) {
			return res.status(200).json([]);
		}

		res.status(200).json(conversation.messages);
	} catch (error: any) {
		console.error("Error in getMessages: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getUsersForSidebar = async (req: Request, res: Response) => {
	try {
		const authUserId = req.user.id;

		const users = await primsa.user.findMany({
			where: {
				id: {
					not: authUserId,
				},
			},
			select: {
				id: true,
				fullName: true,
				profilePic: true,
			},
		});

		res.status(200).json(users);
	} catch (error: any) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};