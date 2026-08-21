import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const signupSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().min(10, 'Enter a valid phone number').required('Phone number is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  vehicleType: Yup.string().required('Vehicle type is required'),
  plateNumber: Yup.string().required('Plate number is required'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  token: Yup.string().required('Reset token is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export const profileSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().min(10, 'Enter a valid phone number').required('Phone number is required'),
  vehicleMake: Yup.string().required('Vehicle make is required'),
  vehicleModel: Yup.string().required('Vehicle model is required'),
  plateNumber: Yup.string().required('Plate number is required'),
});

export const photoCaptureSchema = Yup.object({
  notes: Yup.string().max(300, 'Keep notes under 300 characters'),
  type: Yup.string().oneOf(['before', 'after', 'document']).required('Photo type is required'),
});

export const cashoutSchema = Yup.object({
  amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
});

export const verificationSchema = Yup.object({
  code: Yup.string().length(6, 'Enter the 6-digit code').required('Verification code is required'),
});
