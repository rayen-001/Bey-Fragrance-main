export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends UserCredentials {
  name: string;
  phone?: string;
}

const USERS_KEY = 'hama_fragrance_users';
const CURRENT_USER_KEY = 'hama_fragrance_current_user';

// Get all users from localStorage
export const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error loading current user:', error);
    return null;
  }
};

// Save current user
const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

// Sign up new user
export const signUp = (data: SignUpData): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: data.email,
    name: data.name,
    phone: data.phone,
    createdAt: new Date().toISOString(),
    addresses: [],
    wishlist: [],
  };

  // Save password separately (in real app, this would be hashed on backend)
  const passwords = getPasswords();
  passwords[newUser.id] = data.password;
  savePasswords(passwords);

  // Save user
  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);

  return { success: true, user: newUser };
};

// Login user
export const login = (credentials: UserCredentials): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  const passwords = getPasswords();

  const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
  
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  if (passwords[user.id] !== credentials.password) {
    return { success: false, error: 'Invalid email or password' };
  }

  saveCurrentUser(user);
  return { success: true, user };
};

// Logout user
export const logout = (): void => {
  saveCurrentUser(null);
};

// Update user profile
export const updateUserProfile = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);
  
  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    saveCurrentUser(users[userIndex]);
  }

  return users[userIndex];
};

// Add address
export const addAddress = (userId: string, address: Omit<Address, 'id'>): User | null => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return null;

  const newAddress: Address = {
    ...address,
    id: Date.now().toString(),
  };

  // If this is the first address or marked as default, make it default
  if (user.addresses.length === 0 || newAddress.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
    newAddress.isDefault = true;
  }

  user.addresses.push(newAddress);
  return updateUserProfile(userId, { addresses: user.addresses });
};

// Update address
export const updateAddress = (userId: string, addressId: string, updates: Partial<Address>): User | null => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return null;

  const addressIndex = user.addresses.findIndex(a => a.id === addressId);
  if (addressIndex === -1) return null;

  // If setting as default, unset other defaults
  if (updates.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...updates };
  return updateUserProfile(userId, { addresses: user.addresses });
};

// Delete address
export const deleteAddress = (userId: string, addressId: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return null;

  user.addresses = user.addresses.filter(a => a.id !== addressId);
  
  // If we deleted the default address and there are others, make the first one default
  if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  return updateUserProfile(userId, { addresses: user.addresses });
};

// Wishlist functions
export const toggleWishlist = (userId: string, productId: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return null;

  const wishlistIndex = user.wishlist.indexOf(productId);
  
  if (wishlistIndex > -1) {
    // Remove from wishlist
    user.wishlist.splice(wishlistIndex, 1);
  } else {
    // Add to wishlist
    user.wishlist.push(productId);
  }

  return updateUserProfile(userId, { wishlist: user.wishlist });
};

// Password management (simplified - in real app this would be on backend with hashing)
const PASSWORDS_KEY = 'hama_fragrance_passwords';

const getPasswords = (): Record<string, string> => {
  try {
    const passwords = localStorage.getItem(PASSWORDS_KEY);
    return passwords ? JSON.parse(passwords) : {};
  } catch (error) {
    console.error('Error loading passwords:', error);
    return {};
  }
};

const savePasswords = (passwords: Record<string, string>): void => {
  try {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  } catch (error) {
    console.error('Error saving passwords:', error);
  }
};
