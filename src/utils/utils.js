export default function addressShortener(address) {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
}

export function isValidEmail(email){
  return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
}