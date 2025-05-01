/**
 * @description Converts all images in the HTML element to base64 encoded data
 * @param element - The HTML element to convert. This is cloned and modified
 * @returns Converted HTML string.
 */
export async function convertImagesToBase64(
  element: HTMLElement
): Promise<string> {
  const clone = element.cloneNode(true) as HTMLElement;
  const images = clone.getElementsByTagName("img");

  await Promise.all(
    Array.from(images).map(async (img) => {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result as string;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error converting image:", error);
      }
    })
  );

  return clone.innerHTML;
}

const baseUrl = "";
const apiKey = "";

export const openAIRequest = async (prompt: string) => {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

export function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateRandomUsername() {
  const nouns = [
    "Panda",
    "Lion",
    "Eagle",
    "Rabbit",
    "Dolphin",
    "Monkey",
    "Penguin",
    "Kangaroo",
    "Giraffe",
    "Elephant",
  ];

  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return randomNoun + generateRandomString();
}

export function filterValEqUndefined(vals) {
  Object.entries(vals).forEach(([k, v]) => {
    if (v === undefined) delete vals[k];
  });
  return vals;
}

export const noop = <T>(_result: T) => false;
