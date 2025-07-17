import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, subject, body, from, name } = await req.json();
  const apiFunctionKey = process.env.AZURE_SEND_SECURE_EMAIL_API_FUNCTION_KEY;
  const apiKey = process.env.AZURE_SEND_SECURE_EMAIL_API_KEY;
  const azureFunctionUrl = process.env.AZURE_SEND_SECURE_EMAIL_URL;

  if (!apiKey || !azureFunctionUrl) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const payload = {
    to,
    subject,
    body: `From: ${name} <${from}>\n\n${body}`,
    from,
    apiKey,
  };

  const res = await fetch(azureFunctionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-functions-key': apiFunctionKey },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ error: `Failed to send email` }, { status: 500 });
  }
}
