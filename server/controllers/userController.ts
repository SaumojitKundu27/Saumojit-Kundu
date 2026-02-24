import { Response } from "express";
import User from "../models/User.ts";

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, bio, subjects, availability } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (subjects) user.subjects = subjects;
    if (availability) user.availability = availability;

    await user.save();
    
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        subjects: user.subjects,
        availability: user.availability,
        rating: user.rating
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    // Basic discovery: find users who are NOT the current user
    // In a real app, we'd filter by subjects or use the matching algorithm
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-password")
      .limit(20);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedMatches = async (req: any, res: Response) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const userSubjects = currentUser.subjects.map(s => s.name);
    
    // Simple matching: users who share at least one subject
    const matches = await User.find({
      _id: { $ne: req.user.id },
      "subjects.name": { $in: userSubjects }
    })
    .select("-password")
    .limit(10);

    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
