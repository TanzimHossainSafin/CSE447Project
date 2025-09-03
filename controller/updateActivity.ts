import prisma from "../utils/prisma";
const updateActivity = async (req, res) => {
    const { activityId } = req.body;
    try {
    const activity = await prisma.activity.findUnique({
        where: { id: activityId }
    });
    res.status(200).json({ activity });
    } catch (error) {
        res.status(500).json({ message: 'Activity fetching failed', error: error.message});
    }
};
export default updateActivity;