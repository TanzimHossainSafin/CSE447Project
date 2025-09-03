import prisma from "../utils/prisma";

export const getHabits = async (req, res) => {
    try {
        const userId = req.user.id;
        const habits = await prisma.habit.findMany({
            where: { userId: userId }
        });
        res.status(200).json({ habits });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch habits', error: error.message });
    }
};

export const getAllUsersHabits = async (req, res) => {
    try {
        const habits = await prisma.habit.findMany({
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
        res.status(200).json({ habits });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all habits', error: error.message });
    }
};
