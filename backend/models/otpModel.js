import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: '10m' }, // OTP expires after 10 minutes
});

const Otp = mongoose.model('Otp', OtpSchema);

export default Otp;
