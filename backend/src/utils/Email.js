import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendPasswordResetOtp = async (email, otp) => {
  await transporter.sendMail({
    from: `"Forever" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Forever Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2>Reset your Forever password</h2>

        <p>
          We received a request to reset your Forever account password.
        </p>

        <p>Your OTP is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

        <p>
          — Forever Team
        </p>

      </div>
    `,
  });
};

export { sendPasswordResetOtp };