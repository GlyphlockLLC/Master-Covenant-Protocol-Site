import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Rate limiter store (in-memory, resets on function restart)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute per IP

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Rate limiting check
    const now = Date.now();
    const userRequests = rateLimitStore.get(clientIP) || [];
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS) {
      return Response.json(
        { error: 'Rate limit exceeded. Please wait before submitting again.' },
        { status: 429 }
      );
    }
    
    // Update rate limit store
    recentRequests.push(now);
    rateLimitStore.set(clientIP, recentRequests);
    
    // Clean up old entries (every 100 requests)
    if (rateLimitStore.size > 100) {
      for (const [ip, times] of rateLimitStore.entries()) {
        if (times.every(t => now - t > RATE_LIMIT_WINDOW)) {
          rateLimitStore.delete(ip);
        }
      }
    }
    
    const { name, email, subject, message } = await req.json();
    
    // Validation
    if (!name || name.length < 2) {
      return Response.json({ error: 'Name is required (minimum 2 characters)' }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }
    
    if (!subject || subject.length < 3) {
      return Response.json({ error: 'Subject is required (minimum 3 characters)' }, { status: 400 });
    }
    
    if (!message || message.length < 10) {
      return Response.json({ error: 'Message is required (minimum 10 characters)' }, { status: 400 });
    }
    
    // Sanitize inputs
    const sanitize = (str) => str.replace(/[<>]/g, '').trim();
    
    return Response.json({
      success: true,
      sanitized: {
        name: sanitize(name),
        email: sanitize(email),
        subject: sanitize(subject),
        message: sanitize(message)
      }
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});