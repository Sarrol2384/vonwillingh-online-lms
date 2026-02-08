# Debug Student Login - Frontend Issue

## The Situation

- ✅ **Backend API works** - Tested directly with curl, returns success
- ✅ **Logo fixed** - VonWillingh Online logo showing correctly
- ❌ **Frontend shows error** - "Invalid email or password" even though backend works

---

## Diagnostic Steps

### Open Browser Developer Tools

1. **Open the login page:** https://vonwillingh-online-lms.pages.dev/student-login
2. **Press F12** to open Developer Tools
3. **Go to "Console" tab**
4. **Enter credentials** and click "Sign In"
5. **Look for:**
   - Any red error messages in Console
   - POST request to `/api/student/login` in Network tab
   - The response from that request

---

## What to Check

### Console Tab
Look for JavaScript errors like:
- `Uncaught ReferenceError`
- `TypeError`
- `Failed to fetch`
- Any red error messages

### Network Tab
1. Click "Network" tab in DevTools
2. Filter by "Fetch/XHR"
3. Try logging in
4. Click on the `/api/student/login` request
5. Check:
   - **Status Code:** Should be 200
   - **Response:** Should show `{"success":true,...}`
   - **Request Payload:** Should show your email/password

---

## Possible Issues

### 1. JavaScript Not Loaded
If `axios` isn't loaded, the request won't work.

**Check:** Look in Console for: `axios is not defined`

### 2. CORS Issue
If the API is being blocked by CORS.

**Check:** Look for: `CORS policy` error in Console

### 3. Wrong API Endpoint
If the frontend is calling a different URL.

**Check:** Network tab shows correct URL `/api/student/login`

### 4. Response Parsing Error
If the response is successful but JavaScript can't parse it.

**Check:** Console shows parsing error

---

## Quick Test in Browser Console

**Try this in the Console tab:**

```javascript
// Test if axios is loaded
console.log('axios loaded:', typeof axios !== 'undefined');

// Test login directly from console
axios.post('/api/student/login', {
  email: 'sarrolvonwillingh@co.za',
  password: 'rpnr9mufk2lU6OIC'
}).then(response => {
  console.log('Login response:', response.data);
}).catch(error => {
  console.error('Login error:', error.response?.data || error.message);
});
```

**This will show you exactly what's happening!**

---

## Alternative: Check if Email Has Whitespace

Sometimes copy-paste adds invisible whitespace.

**Try manually typing** the email instead of pasting:
```
sarrolvonwillingh@co.za
```

**Or check in SQL:**
```sql
SELECT 
    email,
    length(email) as email_length,
    email = 'sarrolvonwillingh@co.za' as exact_match
FROM students
WHERE email LIKE '%sarrol%';
```

---

## Action Items

**1. Open DevTools (F12)**
**2. Try logging in and check:**
   - Console tab for JavaScript errors
   - Network tab for the API request/response

**3. Run the JavaScript test above** in Console tab

**4. Share with me:**
   - Any error messages from Console
   - The response from Network tab
   - What the JavaScript test shows

**Let me know what you see in the browser console!** 🔍

---

## Files

- This guide: `/home/user/webapp/DEBUG_FRONTEND_LOGIN.md`
