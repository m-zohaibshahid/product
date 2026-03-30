import nodemailer from 'nodemailer';
import Redis from 'ioredis';
const redis = new Redis();

async function generateOtpWithRedis(email: string) {
const otp = Math.floor(100000 + Math.random() * 900000);
await redis.set(email, otp.toString(), 'EX', 60 * 5);
return otp;
}


async function sendOtp(email: string) {
try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const otp = await generateOtpWithRedis(email);
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP Verification',
        text: 'Your OTP is: ' + otp,
    };
    console.log("OTP sent successfully", { ...mailOptions, text: 'Your OTP is: ****' })
    await transporter.sendMail(mailOptions);
} catch (error) {
    console.error("Failed to send OTP", error);
}
}

export { sendOtp };