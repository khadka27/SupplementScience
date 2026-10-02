import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, topic, subject, evidenceLink, message, isAnonymous } = body;

    // Validation
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { error: "Subject or target supplement name is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please provide a detailed inquiry or clinical summary." },
        { status: 400 }
      );
    }

    if (!isAnonymous) {
      if (!email || typeof email !== "string") {
        return NextResponse.json(
          { error: "Email address is required unless submitting anonymously." },
          { status: 400 }
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
    }

    // Generate clinical triage ticket number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const prefix = topic === "scam" ? "WHISTLEBLOWER" : "SD-TRIAGE";
    const ticketId = `${prefix}-${randomSuffix}`;

    // Log internally for auditing
    console.log(`[Contact Submission] Ticket: ${ticketId}`, {
      topic: topic || "general",
      isAnonymous: Boolean(isAnonymous),
      sender: isAnonymous ? "Anonymous Whistleblower" : `${name || "Not provided"} <${email}>`,
      subject: subject.trim(),
      evidenceLink: evidenceLink || null,
      messageLength: message.trim().length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        ticketId,
        topic: topic || "general",
        message: "Your submission has been safely logged in our editorial triage system.",
        estimatedReview: topic === "scam" ? "12–24 hours" : "24–48 hours",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
