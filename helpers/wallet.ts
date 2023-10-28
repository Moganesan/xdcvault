import { useEffect } from "react";
import crypto from "crypto";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.apothem.network"
);

const createNewWallet = () => {
  const wallet = ethers.Wallet.createRandom({ provider });

  return { address: wallet.address, privateKey: wallet.privateKey };
};

const setWalletPassword = (password: string) => {
  encryptAndStorePassword(password);
  const { address, privateKey } = createNewWallet();
  const { encryptedPrivateKey, iv, salt, tag } = encryptPrivateKey(
    password,
    privateKey
  );

  localStorage.setItem(
    "wallet_" + countWallets() + 1,
    JSON.stringify({
      name: "wallet " + countWallets() + 1,
      address: address.replace("0x", "xdc"),
      privateKey: encryptedPrivateKey,
      iv,
      salt,
      tag,
    })
  );
};

// Function to encrypt and store the user's password
async function encryptAndStorePassword(userPassword: string) {
  try {
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Convert the user's password to an ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(userPassword);

    // Generate an encryption key from the user's password
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    const encryptionKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("salt-value"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // Encrypt the password
    const encryptedPassword = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      encryptionKey,
      passwordBuffer
    );

    // Convert the encrypted password and IV to base64 for storage
    const encryptedPasswordBase64 = btoa(
      String.fromCharCode.apply(
        null,
        Array.from(new Uint8Array(encryptedPassword))
      )
    );
    const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));

    // Store the encrypted password and IV in localStorage
    localStorage.setItem("encryptedPassword", encryptedPasswordBase64);
    localStorage.setItem("iv", ivBase64);

    console.log("Password encrypted and stored.");
  } catch (error) {
    console.error("Encryption error:", error);
  }
}

// Function to decrypt and return the user's password
async function decryptPassword(userEnteredPassword: string) {
  try {
    // Retrieve the stored IV and encrypted password from localStorage
    const ivBase64 = localStorage.getItem("iv");
    const encryptedPasswordBase64 = localStorage.getItem("encryptedPassword");

    if (!ivBase64 || !encryptedPasswordBase64) {
      console.log("No stored password found.");
      return;
    }

    // Convert the IV and encrypted password from base64
    const iv = new Uint8Array(
      Array.from(atob(ivBase64), (c) => c.charCodeAt(0))
    );
    const encryptedPassword = new Uint8Array(
      Array.from(atob(encryptedPasswordBase64), (c) => c.charCodeAt(0))
    );

    // Derive the encryption key from the user-entered password
    const userEnteredPasswordBuffer = new TextEncoder().encode(
      userEnteredPassword
    );
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      userEnteredPasswordBuffer,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    const encryptionKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("salt-value"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // Decrypt the password
    const decryptedPasswordBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      encryptionKey,
      encryptedPassword
    );

    // Convert the decrypted password to a string
    const decoder = new TextDecoder();
    const decryptedPassword = decoder.decode(decryptedPasswordBuffer);

    console.log("Decrypted password:", decryptedPassword);
    return decryptedPassword;
  } catch (error) {
    console.error("Decryption error:", error);
  }
}

// Function to encrypt a private key and return the encrypted private key and salt
function encryptPrivateKey(password: any, privateKey: any) {
  // Generate a random salt
  const salt = crypto.randomBytes(16);

  // Derive an encryption key from the user's password and the salt
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512");

  // Create an initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create a cipher using AES-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // Encrypt the private key
  let encryptedPrivateKey = cipher.update(privateKey, "utf8", "hex");
  encryptedPrivateKey += cipher.final("hex");
  const tag = cipher.getAuthTag();

  // Return the encrypted private key, salt, IV, and authentication tag
  return {
    encryptedPrivateKey,
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

// Function to decrypt a private key using a password and the stored salt, IV, and tag
function decryptPrivateKey(
  password: any,
  encryptedPrivateKey: any,
  storedSalt: any,
  storedIV: any,
  storedTag: any
) {
  // Derive the encryption key from the user's password and the stored salt
  const key = crypto.pbkdf2Sync(
    password,
    Buffer.from(storedSalt, "hex"),
    100000,
    32,
    "sha512"
  );

  // Create a decipher using AES-GCM
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(storedIV, "hex")
  );

  // Set the authentication tag
  decipher.setAuthTag(Buffer.from(storedTag, "hex"));

  // Decrypt the stored encrypted private key
  let decryptedPrivateKey = decipher.update(encryptedPrivateKey, "hex", "utf8");
  decryptedPrivateKey += decipher.final("utf8");

  return decryptedPrivateKey;
}

const getWallets = () => {
  const wallets = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("wallet_")) {
      const item = localStorage.getItem(key);
      if (item) {
        // parse item as json
        const walletData = JSON.parse(item);
        wallets.push(walletData);
      }
    }
  }
  return wallets;
};

// Function to count the number of wallets
function countWallets() {
  let walletCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("wallet_")) {
      walletCount++;
    }
  }
  return walletCount;
}

export { createNewWallet, getWallets, setWalletPassword };
