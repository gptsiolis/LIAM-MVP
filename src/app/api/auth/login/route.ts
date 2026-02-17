import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
