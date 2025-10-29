import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

// 微信公众号配置
const WECHAT_CONFIG = {
  token: process.env.WECHAT_TOKEN || "weixintest",
  appId: process.env.WECHAT_APPID || "wx692a429db241b7f6",
};

// ?signature=6217c4c4f55e0d6e7eec7434873e5ccc469c4c2d&echostr=5173405263959424747&timestamp=1751344875&nonce=1312476277

/**
 * 验证微信服务器签名
 */
function verifySignature(query: URLSearchParams) {
  const signature = query.get("signature");
  const timestamp = query.get("timestamp");
  const nonce = query.get("nonce");
  const { token } = WECHAT_CONFIG;
  console.log("verifySignature", signature, timestamp, nonce, token);
  if (!signature || !timestamp || !nonce) {
    return false;
  }

  // 将token、timestamp、nonce三个参数进行字典序排序
  const sorted = [token, timestamp, nonce].sort();
  // 将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1 = createHash("sha1");
  sha1.update(sorted.join(""));
  const hash = sha1.digest("hex");

  // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  return hash === signature;
}

/**
 * 解析微信XML消息
 */
function parseXml(xmlData: string) {
  // 这里应该使用XML解析库，如xml2js
  // 简化处理，实际项目中建议使用专业库
  const regex = /<(\w+)><!\[CDATA\[([\s\S]*?)\]\]><\/\1>/g;
  const result: Record<string, string> = {};
  let match;

  while ((match = regex.exec(xmlData)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
}

/**
 * 生成回复XML
 */
function generateReply(toUser: string, fromUser: string, content: string) {
  return `
    <xml>
      <ToUserName><![CDATA[${toUser}]]></ToUserName>
      <FromUserName><![CDATA[${fromUser}]]></FromUserName>
      <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>
  `;
}

/**
 * 处理 GET 请求 - 微信服务器验证
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const echostr = searchParams.get("echostr");

    if (verifySignature(searchParams)) {
      return new NextResponse(echostr, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  } catch (error) {
    console.error("处理微信验证请求出错:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * 处理 POST 请求 - 微信事件推送
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 验证签名
    if (!verifySignature(searchParams)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 获取请求体
    const body = await request.text();

    try {
      // 解析XML消息
      const message = parseXml(body);
      const { MsgType, Event, FromUserName, ToUserName } = message;

      // 处理事件消息
      if (MsgType === "event") {
        // 关注事件
        if (Event === "subscribe") {
          // TODO: 处理用户关注逻辑，如记录用户信息
          console.log(`用户 ${FromUserName} 关注了公众号`);

          // 回复欢迎消息
          const reply = generateReply(
            FromUserName,
            ToUserName,
            "感谢您的关注！这是自动回复消息。"
          );

          return new NextResponse(reply, {
            status: 200,
            headers: {
              "Content-Type": "application/xml",
            },
          });
        }

        // 取消关注事件
        if (Event === "unsubscribe") {
          // TODO: 处理用户取消关注逻辑，如标记用户状态
          console.log(`用户 ${FromUserName} 取消了关注`);
          return new NextResponse("", { status: 200 });
        }
      }

      // 其他类型消息
      return new NextResponse("", { status: 200 });
    } catch (error) {
      console.error("处理微信消息出错:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("处理微信请求出错:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
