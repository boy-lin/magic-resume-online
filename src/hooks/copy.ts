import { useCallback, useState } from "react";
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

export const useCopyText = (props) => {
  const { methods = ["execCommand", "clipboard"], successHook } = props;
  const [status, setStatus] = useState<ChangeStatus>(null);
  const [err, setErr] = useState<Error | null>(null);

  const copyText = useCallback(async (target) => {
    try {
      setStatus("loading");
      setErr(null);
      const canWrite = await isSupportClipboardWrite();
      if (!canWrite || !window.ClipboardItem || !navigator.clipboard?.write) {
        throw Error("broswer not supported!");
      }
      const blob = textToBlob(target);
      const data = [new window.ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      setStatus("done");
      setErr(null);
      if (typeof successHook === "function") successHook();
      return true;
    } catch (err) {
      setStatus("error");
      setErr(err);
      return false;
    }
  }, []);

  const copyTarget = useCallback(async (target) => {
    try {
      setStatus("loading");
      setErr(null);
      const cancel = selectFakeInput(target);
      let success = document.execCommand("copy");
      if (!success) {
        throw Error("broswer not supported!");
      }
      setStatus("done");
      setErr(null);
      cancel();
      if (typeof successHook === "function") successHook();
      return true;
    } catch (err) {
      setStatus("error");
      setErr(err);
      return false;
    }
  }, []);

  const copy = useCallback(
    async (target) => {
      const methodMap = {
        clipboard: () => copyText(target),
        execCommand: () => copyTarget(target),
      };
      await interrupt<boolean>(
        methods.map((method) => methodMap[method]),
        (e) => e
      );
    },
    [copyText, copyTarget, methods.join("-")]
  );

  return { status, error: err, copy };
};
