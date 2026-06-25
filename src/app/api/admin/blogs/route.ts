import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const JSON_PATH = path.join(process.cwd(), "src/lib", "blog-posts.json")

// Secret passcode for basic admin action validation
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "concoadmin123"

async function readBlogs() {
  try {
    const data = await fs.readFile(JSON_PATH, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeBlogs(blogs: any[]) {
  await fs.writeFile(JSON_PATH, JSON.stringify(blogs, null, 2), "utf-8")
}

export async function GET(request: Request) {
  const blogs = await readBlogs()
  return NextResponse.json({ success: true, blogs })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { passcode, blogs } = body

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid passcode" }, { status: 401 })
    }

    // If blogs is not provided, it's just a passcode verification check
    if (blogs === undefined) {
      return NextResponse.json({ success: true, message: "Passcode verified" })
    }

    if (!Array.isArray(blogs)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 })
    }

    await writeBlogs(blogs)
    return NextResponse.json({ success: true, message: "Blogs updated successfully" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to save blogs" }, { status: 500 })
  }
}
