export function makeElipsisAddress(address?: string, padding = 6): string {
  if (!address) return '';
  return `${address.substring(0, padding)}...${address.substring(
    address.length - padding
  )}`;
}
