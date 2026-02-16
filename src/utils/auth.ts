import { User } from '@/types';
import { storage } from './storage';

// Simulate OTP generation
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate sending OTP (in production, use SMS API like Twilio, MSG91, etc.)
export const sendOTP = async (phone: string): Promise<{ success: boolean; otp?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const otp = generateOTP();
      console.log(`OTP for ${phone}: ${otp}`);
      // In production, send via SMS API
      resolve({ success: true, otp });
    }, 1000);
  });
};

// Validate phone number (Indian format)
export const validateIndianPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Verify OTP
export const verifyOTP = async (_phone: string, otp: string, sentOTP: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(otp === sentOTP);
    }, 500);
  });
};

// Generate JWT token (simulated)
export const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Date.now(),
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

// Login/Register user
export const authenticateUser = async (phone: string, name?: string): Promise<User> => {
  let user = storage.getUser();
  
  if (!user || user.phone !== phone) {
    user = {
      id: `user_${Date.now()}`,
      phone,
      name: name || 'User',
      createdAt: new Date(),
    };
    storage.setUser(user);
  }
  
  const token = generateToken(user.id);
  storage.setAuthToken(token);
  
  return user;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = storage.getAuthToken();
  const user = storage.getUser();
  return !!(token && user);
};

// Logout
export const logout = () => {
  storage.clearUser();
};
