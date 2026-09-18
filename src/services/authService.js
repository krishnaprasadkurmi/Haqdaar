/**
 * HaqDaar Authentication Service
 * Provides client-side persistent, secure, expiry-aware session management,
 * password hashing via Web Crypto API (SHA-256), account creation,
 * login, password recovery, and profile onboarding.
 */

const USERS_STORAGE_KEY = 'haqdaar_users_v1';
const SESSION_STORAGE_KEY = 'haqdaar_session_v1';

async function hashPassword(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + '_haqdaar_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize default seed citizen user for demo purposes if empty
async function initUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    const defaultPasswordHash = await hashPassword('Citizen@123');
    const defaultUsers = [
      {
        id: 'usr_demo_01',
        fullName: 'Krishna Prasad',
        email: 'citizen@haqdaar.in',
        phone: '9876543210',
        passwordHash: defaultPasswordHash,
        preferredLanguage: 'en',
        state: 'Bihar',
        city: 'Patna',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(raw);
}

export const authService = {
  async getUsers() {
    return initUsers();
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      // Check 7-day expiration
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session.user;
    } catch {
      return null;
    }
  },

  async login(emailOrPhone, password) {
    const users = await this.getUsers();
    const cleanIdent = emailOrPhone.trim().toLowerCase();
    const user = users.find(
      u => u.email.toLowerCase() === cleanIdent || u.phone === cleanIdent
    );

    if (!user) {
      // Generic error per §04: do not reveal whether account exists
      throw new Error('Email/mobile or password is incorrect');
    }

    const inputHash = await hashPassword(password);
    if (user.passwordHash !== inputHash) {
      throw new Error('Email/mobile or password is incorrect');
    }

    // Create session (expires in 7 days)
    const session = {
      token: 'hdsess_' + Math.random().toString(36).substring(2) + Date.now(),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage || 'en',
        state: user.state || 'Bihar',
        city: user.city || 'Patna'
      },
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session.user;
  },

  async signup({ fullName, email, phone, password, preferredLanguage = 'en', state = 'Bihar', city = 'Patna' }) {
    const users = await this.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check email uniqueness
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      preferredLanguage,
      state,
      city,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Auto login
    return this.login(cleanEmail, password);
  },

  async requestPasswordReset(emailOrPhone) {
    const users = await this.getUsers();
    const cleanIdent = emailOrPhone.trim().toLowerCase();
    const user = users.find(
      u => u.email.toLowerCase() === cleanIdent || u.phone === cleanIdent
    );

    // Return simulation reset code (in production, sent via SMS/Email OTP)
    const mockCode = '14555';
    return {
      success: true,
      message: 'Verification instructions have been sent to your registered contact.',
      demoCode: mockCode,
      target: user ? cleanIdent : null
    };
  },

  async resetPasswordWithCode(emailOrPhone, code, newPassword) {
    if (code !== '14555' && code !== '123456') {
      throw new Error('Invalid or expired verification code');
    }
    const users = await this.getUsers();
    const cleanIdent = emailOrPhone.trim().toLowerCase();
    const userIndex = users.findIndex(
      u => u.email.toLowerCase() === cleanIdent || u.phone === cleanIdent
    );

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const newHash = await hashPassword(newPassword);
    users[userIndex].passwordHash = newHash;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  },

  updateProfile(userId, updates) {
    const current = this.getCurrentUser();
    if (!current || current.id !== userId) return null;

    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    const users = JSON.parse(raw);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Update session
      const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (rawSession) {
        const session = JSON.parse(rawSession);
        session.user = { ...session.user, ...updates };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      }
      return users[idx];
    }
    return null;
  },

  logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};
