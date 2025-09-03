import prisma from "../utils/prisma";

export const addHabit = async (req, res) => {
    const { encryptedName, encryptedDescription } = req.body;
    // Validate required fields
    if (!encryptedName || !encryptedDescription) {
        return res.status(400).json({ 
            message: 'Missing required fields', 
            error: 'encryptedName and encryptedDescription are required' 
        });
    }
    
    try {
        // Get user's private key from database or request
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const habit = await prisma.habit.create({
            data: {
                name: encryptedName,
                description: encryptedDescription,
                userId: req.user.id 
            }
        });
        
        res.status(201).json({ message: 'Habit added successfully', habit: habit});
    } catch (error) {
        console.error('Error adding habit:', error);
        res.status(500).json({ message: 'Habit addition failed', error: error.message});
    }
}