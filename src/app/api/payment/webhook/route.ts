import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// 토스페이먼츠 웹훅 핸들러
// https://docs.tosspayments.com/reference/webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, data } = body;

    console.log("Toss webhook received:", eventType, data?.orderId);

    // 웹훅 시크릿 검증 (토스 대시보드에서 설정한 시크릿)
    const webhookSecret = process.env.TOSS_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("x-toss-signature");
      if (!signature) {
        return NextResponse.json({ error: "Signature missing" }, { status: 401 });
      }
      // TODO: HMAC-SHA256 서명 검증
    }

    if (!eventType || !data) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    // 웹훅 이벤트 처리
    switch (eventType) {
      case "PAYMENT_STATUS_CHANGED": {
        const { orderId, status, amount } = data;
        if (status === "DONE" && orderId && amount) {
          // 결제 완료 기록 확인 (중복 처리 방지)
          const existing = await kv.get(`payment:${orderId}`);
          if (!existing) {
            await kv.set(
              `webhook:${orderId}`,
              { orderId, status, amount, receivedAt: new Date().toISOString() },
              { ex: 86400 }
            );
            await sendTelegramAlert(`✅ 결제 완료 (웹훅)\n주문: ${orderId}\n금액: ₩${amount.toLocaleString()}`);
          }
        } else if (status === "CANCELED" || status === "ABORTED") {
          await sendTelegramAlert(`❌ 결제 취소\n주문: ${orderId}\n상태: ${status}`);
        }
        break;
      }
      default:
        console.log("Unhandled webhook event:", eventType);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  } catch (err) {
    console.error("Telegram alert error:", err);
  }
}
