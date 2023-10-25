export function makeElipsisAddress(address?: string, padding = 6): string {
  if (!address) return '';
  return `${address.substring(0, padding)}...${address.substring(
    address.length - padding
  )}`;
}

export function getTextSizeInPixels({
  text,
  fontSize,
  fontWeight,
}: {
  text: string;
  fontSize: number;
  fontWeight: number;
}) {
  // Create a temporary element to measure the text size
  const tempElement = document.createElement('span');
  tempElement.style.visibility = 'hidden';
  tempElement.style.position = 'absolute';
  tempElement.style.whiteSpace = 'nowrap';
  tempElement.style.fontSize = `${fontSize}px`;
  tempElement.style.fontWeight = `${fontWeight}`;

  // Set the text content
  tempElement.textContent = text;

  // Append the element to the document
  document.body.appendChild(tempElement);

  // Get the text size
  const textSize = tempElement.offsetWidth;

  // Remove the temporary element
  document.body.removeChild(tempElement);

  return textSize;
}
