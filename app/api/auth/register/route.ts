import { hash } from "bcrypt"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    const { email, password, username } = await req.json()

    // enforce rules
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{16,}$/.test(password)) {
        return NextResponse.json({ error: "Password does not meet requirements" }, { status: 400 })
    }


    try {
        const hashedPassword = await hash(password, 10)
       
        await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                username: username,
            },
        }).catch(err => {
            console.log(err)
        }
        )
        return NextResponse.json({ success: true })
    } catch (err: any) {
        if (err.code === "P2002") {
            const target = err.meta?.target
            const fields = Array.isArray(target) ? target : [target]
            return NextResponse.json(
                { error: `${fields.join(", ")} already in use` },
                { status: 400 }
            )
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
