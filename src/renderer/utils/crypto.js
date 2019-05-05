import crypto from 'crypto';

// 加密
export function aesEncrypt({data, key = 'gengshaobin123' }) {
  const cipher = crypto.createCipher('aes192', key);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

// 解密
export function aesDecrypt({encrypted, key = 'gengshaobin123' }) {
  const decipher = crypto.createDecipher('aes192', key);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
