# 🔐 AUTHENTICATION RUNTIME TEST MATRIX
**Manual Verification Required - User Execution Only**

**Tester:** carloearl@glyphlock.com (Admin)  
**Test Environment:** https://glyphlock.base44.app (until custom domain active)  
**Date:** 2026-01-23  
**Status:** ⏳ PENDING USER EXECUTION

---

## 📋 TEST SCENARIOS (7 Critical Flows)

### **1. Login Persistence Across Page Refresh**
**Objective:** Verify user session survives browser refresh

**Steps:**
1. Open incognito window
2. Navigate to https://glyphlock.base44.app
3. Click "Sign In" button (top right)
4. Complete login with valid credentials
5. Verify: User name shows in top-right dropdown
6. Press F5 (refresh page)
7. Wait for page reload

**Expected Result:**
- ✅ User remains logged in
- ✅ User name still visible in top-right
- ✅ No redirect to login page

**Actual Result:** [ ]  
**Status:** ⬜ NOT TESTED  
**Notes:** ___________________________________________

---

### **2. Login Persistence Across New Tab**
**Objective:** Verify session shares across browser tabs

**Steps:**
1. Complete test #1 (be logged in)
2. Open new tab (Ctrl+T)
3. Navigate to https://glyphlock.base44.app/command-center
4. Observe page behavior

**Expected Result:**
- ✅ User logged in immediately (no login prompt)
- ✅ CommandCenter loads with user data
- ✅ No redirect to home page

**Actual Result:** [ ]  
**Status:** ⬜ NOT TESTED  
**Notes:** ___________________________________________

---

### **3. Logout Persistence Across Refresh**
**Objective:** Verify logout state survives refresh

**Steps:**
1. Be logged in (from test #1)
2. Click user dropdown (top right)
3. Click "Sign Out"
4. Wait for logout redirect
5. Press F5 (refresh)

**Expected Result:**
- ✅ User stays logged out
- ✅ Top-right shows "Sign In" button
- ✅ No automatic re-login

**Actual Result:** [ ]  
**Status:** ⬜ NOT TESTED  
**Notes:** ___________________________________________

---

### **4. Session Timeout Test**
**Objective:** Verify session expires after inactivity

**Steps:**
1. Login successfully
2. Navigate to /command-center
3. Leave tab idle for 30 minutes (do not close)
4. Return and click any button/link

**Expected Result:**
- ⚠️ UNKNOWN: Base44 platform behavior
- Option A: Session still valid (long-lived token)
- Option B: Auto-logout + redirect to login

**Actual Result:** [ ]  
**Status:** ⬜ NOT TESTED  
**Timeout Duration Observed:** ___________ minutes  
**Notes:** ___________________________________________

---

### **5. Protected Route Access (Not Authenticated)**
**Objective:** Verify protected routes redirect unauthenticated users

**Steps:**
1. Open incognito window (ensure not logged in)
2. Navigate directly to: https://glyphlock.base44.app/command-center
3. Observe page behavior

**Expected Result:**
- ✅ Redirect to home page (/)
- ✅ "Sign In" button visible
- ❌ CommandCenter should NOT render

**Actual Result:** [ ]  
**Status:** ⬜ NOT TESTED  
**Notes:** ___________________________________________

---

### **6. Cross-Tab Logout Synchronization**
**Objective:** Verify logout in one tab logs out all tabs

**Steps:**
1. Login in Tab 1
2. Open Tab 2 → navigate to /command-center (should be logged in)
3. In Tab 1: Click logout
4. Switch to Tab 2
5. Click any link or refresh

**Expected Result:**
- ✅ Tab 2 detects logout
- ✅ Tab 2 redirects to home or shows "Sign In"
- ⚠️ May require refresh if Base44 doesn't use WebSockets

**Actual Result:** [ ]  
**Synchronization Method:** [ ] Immediate [ ] On Refresh [ ] None  
**Status:** ⬜ NOT TESTED  
**Notes:** ___________________________________________

---

### **7. Role-Based Access Control**
**Objective:** Verify non-admin users see limited features

**Prerequisites:** Create a test user with role="user" (not admin)

**Steps:**
1. Logout admin account
2. Login with test user (role: user, NOT admin)
3. Navigate to /command-center
4. Observe available tabs/features
5. Try to access /nups-owner or /nups-staff

**Expected Result:**
- ✅ CommandCenter loads (all users can access)
- ⚠️ Some tabs may be hidden (implementation dependent)
- ❌ NUPS pages should block or hide features (if role-gated)

**Actual Result:** [ ]  
**Admin-Only Features Hidden:** [ ] Yes [ ] No  
**Status:** ⬜ NOT TESTED  
**Notes:** ___________________________________________

---

## 📊 TEST RESULTS SUMMARY

**Date Executed:** ___________  
**Tester:** ___________  
**Environment:** [ ] glyphlock.base44.app [ ] glyphlock.io  

**Results:**
- [ ] 1. Login Persistence (Refresh): ⬜ PASS ⬜ FAIL
- [ ] 2. Login Persistence (New Tab): ⬜ PASS ⬜ FAIL
- [ ] 3. Logout Persistence: ⬜ PASS ⬜ FAIL
- [ ] 4. Session Timeout: ⬜ PASS ⬜ FAIL ⬜ N/A
- [ ] 5. Protected Route Redirect: ⬜ PASS ⬜ FAIL
- [ ] 6. Cross-Tab Logout: ⬜ PASS ⬜ FAIL
- [ ] 7. Role-Based Access: ⬜ PASS ⬜ FAIL

**Overall Pass Rate:** ___/7 (___ %)

**Critical Failures (if any):**
_____________________________________________
_____________________________________________

**Recommendations:**
_____________________________________________
_____________________________________________

---

## 🔧 TROUBLESHOOTING GUIDE

### **Issue: Session Lost After Refresh**
**Symptoms:** Login works, but F5 logs user out

**Possible Causes:**
1. Base44 auth cookies not persisting (SameSite/Secure flags)
2. Token stored in sessionStorage (cleared on refresh)
3. Auth check failing silently in Layout.js

**Debug Steps:**
1. Open Browser DevTools → Application → Cookies
2. Check for cookies from base44.app domain
3. Verify cookie attributes: HttpOnly, Secure, SameSite=Lax
4. Check Console for auth errors during reload

**Fix:** Contact Base44 support if cookies not persisting

---

### **Issue: Protected Routes Accessible Without Login**
**Symptoms:** Can access /command-center without authentication

**Possible Causes:**
1. Auth check bypassed in CommandCenter.js
2. base44.auth.isAuthenticated() returning true incorrectly
3. Navigation guard not executing

**Debug Steps:**
1. Add console.log in CommandCenter.js (line 2041):
   ```javascript
   const isAuth = await base44.auth.isAuthenticated();
   console.log('AUTH CHECK:', isAuth);
   ```
2. Reload page and check console output

**Fix:** Report to Base44 if auth check returns false positives

---

### **Issue: Logout Doesn't Work in All Tabs**
**Symptoms:** Logout in Tab 1, Tab 2 still shows user as logged in

**Possible Causes:**
1. Base44 doesn't broadcast logout events
2. Tabs don't re-check auth state automatically
3. Token revocation not propagated

**Workaround:** Instruct users to close all tabs after logout

---

## ✅ SIGN-OFF

**I certify that I have:**
- [ ] Executed all 7 test scenarios
- [ ] Documented pass/fail for each
- [ ] Reported any critical failures immediately
- [ ] Noted any unexpected behavior

**Tester Signature:** ___________________  
**Date Completed:** ___________________

---

**MATRIX CREATED:** 2026-01-23 21:41 UTC  
**Status:** ⏳ AWAITING MANUAL EXECUTION BY USER  
**Next Step:** User must complete tests and report results