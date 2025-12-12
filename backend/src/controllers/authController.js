import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signUp = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;
        
        if (!full_name || !email || !password) {
            return res.status(400).json({ 
                message: "Không thể thiếu full_name, email, password" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                message: "Email đã được sử dụng" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            full_name,
            email,
            password_hash: hashedPassword,
            role: role || "user",
        });

        return res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: newUser._id,
                full_name: newUser.full_name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Vui lòng nhập email và password" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: "Email hoặc password không chính xác" 
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Email hoặc password không chính xác" 
            });
        }

        return res.status(200).json({
            message: "Đăng nhập thành công",
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};