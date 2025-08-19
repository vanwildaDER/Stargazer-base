#!/usr/bin/env node

/**
 * Stargazer Credential Encryption CLI Tool
 * 
 * Usage:
 *   node scripts/encrypt-credentials.js encrypt --key "VPB_API_KEY" --value "secret123" --password "master-pass"
 *   node scripts/encrypt-credentials.js decrypt --encrypted "{...}" --password "master-pass"
 *   node scripts/encrypt-credentials.js batch --file ".env.plain" --password "master-pass"
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Encryption configuration (matches frontend implementation)
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const ITERATIONS = 100000; // PBKDF2 iterations

class CredentialEncryption {
  /**
   * Derives encryption key from master password using PBKDF2
   */
  static deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  }

  /**
   * Encrypts a credential value using AES-256-GCM
   */
  static encrypt(value, masterPassword) {
    try {
      const salt = crypto.randomBytes(SALT_LENGTH);
      const iv = crypto.randomBytes(IV_LENGTH);
      const key = this.deriveKey(masterPassword, salt);
      
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      cipher.setAAD(Buffer.from('stargazer-credential', 'utf8'));
      
      let encrypted = cipher.update(value, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('base64'),
        salt: salt.toString('base64'),
        tag: tag.toString('base64'),
        algorithm: 'AES-GCM'
      };
    } catch (error) {
      console.error('Encryption failed:', error.message);
      throw new Error('Failed to encrypt credential');
    }
  }

  /**
   * Decrypts an encrypted credential value
   */
  static decrypt(encryptedValue, masterPassword) {
    try {
      const salt = Buffer.from(encryptedValue.salt, 'base64');
      const iv = Buffer.from(encryptedValue.iv, 'base64');
      const tag = Buffer.from(encryptedValue.tag, 'base64');
      const key = this.deriveKey(masterPassword, salt);
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAAD(Buffer.from('stargazer-credential', 'utf8'));
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encryptedValue.encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      throw new Error('Failed to decrypt credential - invalid password or corrupted data');
    }
  }

  /**
   * Validates if a string is an encrypted value
   */
  static isEncrypted(value) {
    try {
      const parsed = JSON.parse(value);
      return (
        typeof parsed === 'object' &&
        typeof parsed.encrypted === 'string' &&
        typeof parsed.iv === 'string' &&
        typeof parsed.salt === 'string' &&
        typeof parsed.algorithm === 'string'
      );
    } catch {
      return false;
    }
  }
}

/**
 * CLI Command Handlers
 */
class CredentialCLI {
  static encryptSingle(key, value, password) {
    console.log(`🔐 Encrypting credential: ${key}`);
    
    const encrypted = CredentialEncryption.encrypt(value, password);
    const encryptedString = JSON.stringify(encrypted);
    
    console.log(`\n✅ Encrypted successfully!`);
    console.log(`\nAdd this to your .env file:`);
    console.log(`VITE_${key}=${encryptedString}`);
    
    return encryptedString;
  }

  static decryptSingle(encryptedString, password) {
    console.log(`🔓 Decrypting credential...`);
    
    try {
      const encrypted = JSON.parse(encryptedString);
      const decrypted = CredentialEncryption.decrypt(encrypted, password);
      
      console.log(`\n✅ Decrypted successfully!`);
      console.log(`Value: ${decrypted}`);
      
      return decrypted;
    } catch (error) {
      console.error(`❌ Decryption failed: ${error.message}`);
      process.exit(1);
    }
  }

  static batchEncrypt(envFile, password, outputFile = null) {
    console.log(`📦 Batch encrypting credentials from: ${envFile}`);
    
    if (!fs.existsSync(envFile)) {
      console.error(`❌ File not found: ${envFile}`);
      process.exit(1);
    }

    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n');
    const encryptedLines = [];

    const credentialKeys = [
      'VITE_VPB_API_KEY',
      'VITE_VPB_API_SECRET', 
      'VITE_GAMING_API_CLIENT_ID',
      'VITE_GAMING_API_CLIENT_SECRET'
    ];

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') {
        encryptedLines.push(line);
        return;
      }

      // Parse key=value pairs
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');

      if (credentialKeys.includes(key) && value && value !== 'your_api_key_here') {
        console.log(`  🔐 Encrypting: ${key}`);
        
        try {
          const encrypted = CredentialEncryption.encrypt(value, password);
          const encryptedString = JSON.stringify(encrypted);
          encryptedLines.push(`${key}=${encryptedString}`);
        } catch (error) {
          console.error(`    ❌ Failed to encrypt ${key}: ${error.message}`);
          encryptedLines.push(line); // Keep original on error
        }
      } else {
        encryptedLines.push(line);
      }
    });

    const outputPath = outputFile || envFile.replace('.env', '.env.encrypted');
    fs.writeFileSync(outputPath, encryptedLines.join('\n'));
    
    console.log(`\n✅ Batch encryption complete!`);
    console.log(`📄 Output written to: ${outputPath}`);
  }

  static generateMasterPassword() {
    const password = crypto.randomBytes(32).toString('base64');
    console.log(`🔑 Generated master password:`);
    console.log(password);
    console.log(`\n💡 Add this to your .env:`);
    console.log(`VITE_CREDENTIAL_MASTER_PASSWORD=${password}`);
    return password;
  }

  static showHelp() {
    console.log(`
🌟 Stargazer Credential Encryption CLI

USAGE:
  node scripts/encrypt-credentials.js <command> [options]

COMMANDS:
  encrypt     Encrypt a single credential
    --key       Credential key name (e.g., VPB_API_KEY)
    --value     Credential value to encrypt
    --password  Master password for encryption

  decrypt     Decrypt a single credential
    --encrypted Encrypted JSON string
    --password  Master password for decryption

  batch       Encrypt multiple credentials from .env file
    --file      Input .env file path
    --password  Master password for encryption
    --output    Output file path (optional)

  generate    Generate a secure master password

  help        Show this help message

EXAMPLES:
  # Encrypt a single API key
  node scripts/encrypt-credentials.js encrypt \\
    --key "VPB_API_KEY" \\
    --value "secret123" \\
    --password "my-master-pass"

  # Batch encrypt from .env file  
  node scripts/encrypt-credentials.js batch \\
    --file ".env.plain" \\
    --password "my-master-pass"

  # Generate master password
  node scripts/encrypt-credentials.js generate

SECURITY NOTES:
  - Master passwords should be stored securely (environment variables, secrets manager)
  - Never commit master passwords to version control
  - Use different master passwords for different environments
  - Regularly rotate both API keys and master passwords
`);
  }
}

/**
 * Main CLI entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    CredentialCLI.showHelp();
    return;
  }

  const command = args[0];
  const options = {};
  
  // Parse command line arguments
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      options[key] = value;
    }
  }

  try {
    switch (command) {
      case 'encrypt':
        if (!options.key || !options.value || !options.password) {
          console.error('❌ Missing required options: --key, --value, --password');
          process.exit(1);
        }
        CredentialCLI.encryptSingle(options.key, options.value, options.password);
        break;

      case 'decrypt':
        if (!options.encrypted || !options.password) {
          console.error('❌ Missing required options: --encrypted, --password');
          process.exit(1);
        }
        CredentialCLI.decryptSingle(options.encrypted, options.password);
        break;

      case 'batch':
        if (!options.file || !options.password) {
          console.error('❌ Missing required options: --file, --password');
          process.exit(1);
        }
        CredentialCLI.batchEncrypt(options.file, options.password, options.output);
        break;

      case 'generate':
        CredentialCLI.generateMasterPassword();
        break;

      case 'help':
        CredentialCLI.showHelp();
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        CredentialCLI.showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI
main();