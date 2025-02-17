import { Router } from "express";
import { get_slots, update_slot_status, bookSlot, getDetails, getPendingSlot, cancel, reset } from "../controllers/slot.js";

const router = Router();

router.get("/", get_slots); // Get all slots (User/Admin)
router.post("/book", bookSlot); // User books a slot
router.get("/pending", getPendingSlot); // Get all pending slots (Admin)
router.patch("/:id", update_slot_status); // Admin updates slot status
router.get("/booked/:id", getDetails ); // Get all booked slots (Admin)
router.patch("/cancelled/:id", cancel ); // Get all cancelled slots (Admin)
router.post("/reset", reset )


export default router;
