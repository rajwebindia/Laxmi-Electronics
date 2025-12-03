# Forms Configuration Summary

This document lists all forms in the Laxmi Electronics website and their SMTP/Admin email configuration status.

## ✅ All Forms Status: CONFIGURED

All forms are properly configured with:
- **Admin Email**: `marketing@laxmielectronics.com`
- **API Endpoint**: `/api/send-email`
- **SMTP Configuration**: Managed via backend `.env` file

---

## 📋 Forms List

### 1. **Contact Us Form** (`src/pages/ContactUs.jsx`)
- **Location**: `/contact-us` page
- **Admin Email**: `marketing@laxmielectronics.com` (Line 121)
- **API Endpoint**: `/api/send-email` (Line 223)
- **Form Fields**:
  - First Name, Last Name
  - Mobile Number, Email
  - Organisation Name, Street Address
  - City, State
  - Requirement, Estimated Volume
  - Order Release Date
  - CAD File, RFQ File (uploads)
- **Email Types**:
  - ✅ Admin notification email
  - ✅ Customer confirmation email
- **Status**: ✅ **FULLY CONFIGURED**

---

### 2. **Home Page Quote Request Form** (`src/pages/Home.jsx`)
- **Location**: Home page (`/`) - "Request a Quote" section
- **Admin Email**: `marketing@laxmielectronics.com` (Line 143)
- **API Endpoint**: `/api/send-email` (Line 204)
- **Form Fields**:
  - Name, Phone, Email
  - Message
- **Email Types**:
  - ✅ Admin notification email
  - ✅ Customer confirmation email
- **Status**: ✅ **FULLY CONFIGURED**

---

### 3. **Quality/Certification Request Form** (`src/pages/Quality.jsx`)
- **Location**: `/quality` page - Certification modal
- **Admin Email**: `marketing@laxmielectronics.com` (Line 112)
- **API Endpoint**: `/api/send-email` (Line 194)
- **Form Fields**:
  - Name, Phone, Email
  - Organisation Name
  - City, State
- **Certifications Available**:
  - ISO 9001:2015
  - ISO 13485:2016
  - AS 9100 D
  - UL Traceability
- **Email Types**:
  - ✅ Admin notification email
  - ✅ Customer confirmation email
- **Status**: ✅ **FULLY CONFIGURED**

---

### 4. **Thermoplastic Molding Certification Form** (`src/pages/ThermoplasticMolding.jsx`)
- **Location**: `/thermoplastic-molding` page - Certification modal
- **Admin Email**: `marketing@laxmielectronics.com` (Line 94)
- **API Endpoint**: `/api/send-email` (Line 176)
- **Form Fields**:
  - Name, Phone, Email
  - Organisation Name
  - City, State
- **Email Types**:
  - ✅ Admin notification email
  - ✅ Customer confirmation email
- **Status**: ✅ **FULLY CONFIGURED**

---

### 5. **Silicone Molding Certification Form** (`src/pages/SiliconeMolding.jsx`)
- **Location**: `/silicone-molding` page - Certification modal
- **Admin Email**: `marketing@laxmielectronics.com` (Line 90)
- **API Endpoint**: `/api/send-email` (Line 170)
- **Form Fields**:
  - Name, Phone, Email
  - Organisation Name
  - City, State
- **Email Types**:
  - ✅ Admin notification email
  - ✅ Customer confirmation email
- **Status**: ✅ **FULLY CONFIGURED**

---

## 🔧 Admin Email Configuration

All forms currently use the same admin email address:
```javascript
const adminEmail = 'marketing@laxmielectronics.com';
```

### To Change Admin Email:

You need to update the admin email in **5 files**:

1. `src/pages/ContactUs.jsx` - Line 121
2. `src/pages/Home.jsx` - Line 143
3. `src/pages/Quality.jsx` - Line 112
4. `src/pages/ThermoplasticMolding.jsx` - Line 94
5. `src/pages/SiliconeMolding.jsx` - Line 90

**Or** create a centralized configuration file (recommended for easier maintenance).

---

## 📧 SMTP Configuration

SMTP settings are configured in the backend `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

**Note**: The `ADMIN_EMAIL` in `.env` is currently not used by the frontend forms. Forms have the admin email hardcoded. To use the environment variable, you would need to:
1. Create an API endpoint to fetch the admin email
2. Or pass it through the email API response
3. Or use a centralized config file

---

## 🔄 API Endpoint

All forms use the same backend API endpoint:
- **Endpoint**: `/api/send-email`
- **Method**: `POST`
- **Location**: `server/index.js` (Line 25)

The endpoint handles:
- Admin notification emails
- Customer confirmation emails
- File attachments (for Contact Us form)

---

## ✅ Verification Checklist

- [x] All 5 forms have email functionality
- [x] All forms use the same admin email: `marketing@laxmielectronics.com`
- [x] All forms use the same API endpoint: `/api/send-email`
- [x] Backend server is configured (`server/index.js`)
- [x] Email service is configured (`server/services/emailService.js`)
- [x] SMTP configuration template exists (`env.example.txt`)
- [x] Vite proxy is configured for development (`vite.config.js`)

---

## 🚀 Testing

To test all forms:

1. **Start Backend Server**:
   ```bash
   npm run server
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Each Form**:
   - Home page: Fill out "Request a Quote" form
   - Contact Us: Fill out contact form
   - Quality: Click certification badge and fill form
   - Thermoplastic Molding: Click certification and fill form
   - Silicone Molding: Click certification and fill form

4. **Verify Emails**:
   - Check `marketing@laxmielectronics.com` inbox for admin notifications
   - Check customer email for confirmation emails

---

## 📝 Notes

- All forms send **two emails** per submission:
  1. Admin notification (to `marketing@laxmielectronics.com`)
  2. Customer confirmation (to form submitter's email)

- The Contact Us form supports file uploads (CAD and RFQ files), but file attachment handling needs to be implemented in the backend if you want to attach files to emails.

- All forms have proper error handling and will not break if email sending fails.

---

## 🔐 Security

- Never commit `.env` file to version control
- Use App Passwords for Gmail (not regular passwords)
- Use environment variables for all sensitive data
- Consider using professional email services (SendGrid, Mailgun) for production

---

**Last Updated**: All forms verified and configured ✅

