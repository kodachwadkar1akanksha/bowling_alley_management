import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all slots (for User/Admin)
export async function get_slots(req, res) {
    try {
        const slots = await prisma.slot.findMany();
        return res.status(200).json(slots);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function bookSlot(req, res) {
    const { slotId } = req.body;  
  
    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }
  
    try {
      // Find the slot by ID
      const slot = await prisma.slot.findUnique({
        where: { id: slotId },
      });
  
      if (!slot) {
        return res.status(404).json({ message: 'Slot not found' });
      }
  
      // Check if the slot is already booked or pending
      if (slot.status !== 'available') {
        return res.status(400).json({ message: 'Slot is already booked or pending' });
      }
  
      // Update the slot status to 'pending' (waiting for admin approval)
      const updatedSlot = await prisma.slot.update({
        where: { id: slotId },
        data: {
          status: 'pending',
        },
      });
  
      return res.status(200).json({ message: 'Slot booked successfully. Awaiting admin approval.', updatedSlot });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
//show pending status slots to admin
export async function getPendingSlot(req, res) {
    try {
      const pendingSlots = await prisma.slot.findMany({
        where: {
          status: 'pending',  // Fetch only pending slots
        },
      });
  
      return res.status(200).json(pendingSlots);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching pending slots', error: error.message });
    }
  }

// Update slot status (Admin)
export async function update_slot_status(req, res) {
    const { id } = req.params;
    const { status } = req.body; // "available" or "not available"

    try {
        const updatedSlot = await prisma.slot.update({
            where: { id },
            data: { status }
        });

        return res.status(200).json({ message: "Slot status updated", updatedSlot });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getDetails(req, res) {
    const { id } = req.params; // Getting the slotId from the route parameters
    
      if (!id) {
        return res.status(400).json({ message: 'Slot ID is required' });
      }
    
      try {
        // Find the slot by its ID
        const slot = await prisma.slot.findUnique({
          where: { id: id },
        });
    
        if (!slot) {
          return res.status(404).json({ message: 'Slot not found' });
        }
    
        return res.status(200).json({
          message: 'Slot details fetched successfully',
          slot,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };


    export async function cancel(req, res) {
        const { id } = req.params; // Getting the slotId from the route parameters
      
        if (!id) {
          return res.status(400).json({ message: 'ID is required' });
        }
      
        try {
          // Find the slot by its ID
          const slot = await prisma.slot.findUnique({
            where: { id: id },
          });
      
          if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
          }
      
          // Check if the slot is already available
          if (slot.status === 'available') {
            return res.status(400).json({ message: 'Slot is already available' });
          }
      
          // Update the slot status to 'available' (slot is now free)
          const updatedSlot = await prisma.slot.update({
            where: { id },
            data: {
              status: 'available',
            },
          });
      
          return res.status(200).json({ message: 'Slot cancelled successfully', updatedSlot });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      }

      export async function reset(req, res) {
        try {
          // Reset all slots to 'available'
          const updatedSlots = await prisma.slot.updateMany({
            where: { status: 'pending' },
            data: {
              status: 'available',
            },
          });
      
          return res.status(200).json({ message: 'All slots reset successfully', updatedSlots });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      }

     