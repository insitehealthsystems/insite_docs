// Form validation schemas using Yup
import * as yup from 'yup';

// Appointment booking form validation schema
export const appointmentSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required'),
  organization: yup
    .string(),
  patientType: yup
    .string(),
  gender: yup
    .string(),
  department: yup
    .string(),
  appointmentType: yup
    .string()
    .required('Please select a service'),
  preferredDate: yup
    .string()
    .required('Please select a date'),
  preferredTime: yup
    .string(),
  message: yup
    .string()
    .max(500, 'Message must be less than 500 characters'),
});

// Newsletter subscription validation schema
export const newsletterSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

// Contact form validation schema
export const contactSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});
