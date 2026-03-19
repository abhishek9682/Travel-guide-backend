const OTP = require('../models/otpModel');
const User = require('../models/userModel');
const generateOTP = require('../utils/otpGenerator');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/tokenGenerator');

// @desc    Send OTP to user's email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Generate a new 4-digit OTP
        const otpCode = generateOTP();

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email });

        // Save new OTP to database
        const otpEntry = await OTP.create({
            email,
            otp: otpCode
        });

        // Send email
        const emailSent = await sendEmail({
            email,
            subject: 'Your Travel Guide App OTP Code',
            message: `Your OTP for login/registration is ${otpCode}. It is valid for 5 minutes.`
        });

        if (!emailSent) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to email',
            data: { email: otpEntry.email }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP and Log in or Register the User
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp, name } = req.body; // name is optional, required only on first registration if needed

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        // If user doesn't exist, we create one. If name is missing we can use a placeholder.
        if (!user) {
            user = await User.create({
                email,
                name: name || email.split('@')[0], // Give simple default name if not provided
                role: 'user'
            });
        }

        // Delete OTP after successful verification
        await OTP.deleteMany({ email });

        // Generate JWT Token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendOtp,
    verifyOtp
};
