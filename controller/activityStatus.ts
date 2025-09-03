import prisma from "../utils/prisma";
export const activityStatus = async (req, res) => {
    try {
    const { activityId } = req.body;
    const activity = await prisma.activity.findUnique({
        where: { id: activityId }
    });
    res.status(200).json({ activity });
    } catch (error) {
        res.status(500).json({ message: 'Activity status failed', error: error.message});
    }
};