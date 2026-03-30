import nodemailer from 'nodemailer';

async function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
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

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP Verification',
        text: 'Your OTP is: ' + generateOtp(),
    };
    console.log("OTP sent successfully", mailOptions)
    await transporter.sendMail(mailOptions);
} catch (error) {
    console.log(error);
}
}

export { sendOtp };