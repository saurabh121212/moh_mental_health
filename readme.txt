To generate a 256-bit key (64 hex characters):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
