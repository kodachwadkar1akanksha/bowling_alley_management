import { Router } from "express";
import { create_admin, create_user, login_user, login_admin, logout,display_user} from "../controllers/auth.js";

const router = Router();        // Create a new router

router.post("/", create_user);

router.post("/userlogin", login_user);

router.post("/admin", create_admin);

router.post("/adminlogin", login_admin);
router.post("/logout", logout );
router.get("/user", display_user);
export default router;