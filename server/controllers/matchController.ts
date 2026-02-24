import { Response } from "express";
import Match from "../models/Match.ts";
import User from "../models/User.ts";

export const swipeRight = async (req: any, res: Response) => {
  try {
    const currentUserId = req.user.id;
    const { targetId } = req.body;

    if (currentUserId === targetId) {
      return res.status(400).json({ message: "You cannot swipe on yourself" });
    }

    // Check if the other user has already swiped right on us
    const existingMatch = await Match.findOne({
      swipedBy: targetId,
      swipedOn: currentUserId,
      status: "pending"
    });

    if (existingMatch) {
      // It's a match!
      existingMatch.status = "matched";
      existingMatch.users = [currentUserId, targetId];
      await existingMatch.save();
      return res.json({ status: "matched", match: existingMatch });
    }

    // Otherwise, create a pending match
    try {
      const newMatch = new Match({
        swipedBy: currentUserId,
        swipedOn: targetId,
        users: [currentUserId, targetId],
        status: "pending"
      });
      await newMatch.save();
      res.json({ status: "pending", match: newMatch });
    } catch (err: any) {
      // If already swiped (unique index), just return pending
      if (err.code === 11000) {
        return res.json({ status: "pending", message: "Already swiped" });
      }
      throw err;
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMatches = async (req: any, res: Response) => {
  try {
    const matches = await Match.find({
      users: req.user.id,
      status: "matched"
    }).populate("users", "-password");
    
    // Filter out the current user from the users array in each match for easier UI consumption
    const formattedMatches = matches.map(m => {
      const otherUser = (m.users as any[]).find(u => u._id.toString() !== req.user.id);
      return {
        _id: m._id,
        otherUser,
        createdAt: m.createdAt
      };
    });

    res.json(formattedMatches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingMatches = async (req: any, res: Response) => {
  try {
    const pending = await Match.find({
      swipedOn: req.user.id,
      status: "pending"
    }).populate("swipedBy", "-password");
    
    res.json(pending);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
