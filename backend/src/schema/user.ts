import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export interface UserI {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpiry:number | null;
}

const userSchema = new mongoose.Schema<UserI>(
  {
    email: {
      type: String,
      unique: [true, 'Email must be unique'],
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
      match: [/^[a-zA-Z0-9_]{3,20}$/, 'Please fill valid username']
    },
    avatar: {
      type: String
    },
    isVerified: { 
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpiry:{
      type:Number
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function saveUser(next) {
  if(this.isNew){
    const SALT = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, SALT);
    this.password = hashedPassword;
    this.avatar = `https://robohash.org/${this.username}`;
    this.verificationToken = uuidv4().substring(0, 10).toUpperCase();
    this.verificationTokenExpiry = Date.now() * 3600000;
  }
  next();
});

const User = mongoose.model<UserI>('User', userSchema);

export default User;
