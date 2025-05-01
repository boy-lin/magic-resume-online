import { noop } from "@/utils";

export type ChangeStatus = "loading" | "done" | "error" | null;

export async function isSupportClipboardWrite() {
  try {
    const permission = await navigator.permissions?.query?.({
      //@ts-ignore
      name: "clipboard-write",
      allowWithoutGesture: false,
    });
    return permission?.state === "granted";
  } catch (error) {
    return false;
  }
}

export function textToBlob(target: string = "") {
  return new Blob([target], { type: "text/plain" });
}

export function selectFakeInput(text: string) {
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNode(input);
  selection!.removeAllRanges();
  selection!.addRange(range);
  return () => {
    selection!.removeAllRanges();
    document.body.removeChild(input);
  };
}

export async function interrupt<T>(
  promises: (() => Promise<T>)[],
  checking: (result: T) => boolean = noop
) {
  for (let promise of promises) {
    let result = await promise();
    let isEnd = checking(result);
    if (isEnd) {
      return;
    }
  }
}
