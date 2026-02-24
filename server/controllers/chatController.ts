import { Response } from "express";
import Message from "../models/Message.ts";

export const getMessages = async (req: any, res: Response) => {
  try {
    const { matchId } = req.params;
    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
