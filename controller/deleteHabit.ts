import prisma from "../utils/prisma";
export const deleteHabit = async (req, res) => {
    try {
    const { habitId } = req.body;
    const habit = await prisma.habit.delete({
        where: { id: habitId }
    });
    res.status(200).json("Habit deleted successfully");
    } catch (error) {
        res.status(500).json({ message: 'Habit deletion failed', error: error.message});            
    }
};