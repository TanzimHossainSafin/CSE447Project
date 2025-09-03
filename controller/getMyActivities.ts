import prisma from "../utils/prisma";

export const getMyActivities = async (req, res) => {
    try {
        const userId = req.user.id;
        const activities = await prisma.activity.findMany({
            where: { userId: userId }
        });
        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch my activities', error: error.message });
    }
};

export const getAllActivities = async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all activities', error: error.message });
    }
};
