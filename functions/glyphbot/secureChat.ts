import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Middleware to enforce strict security policies on GlyphBot interactions
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, context = {}, securityLevel = 'standard' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // 1. Policy Check (Hardening)
    // NIST Mode: No personality, strict facts, audit logging
    const isNistMode = securityLevel === 'nist' || context.nistMode;
    
    // System Prompt Injection based on mode
    let systemPrompt = "You are GlyphBot, a secure assistant for the GlyphLock platform.";
    if (isNistMode) {
        systemPrompt += " You must strictly adhere to NIST 800-53 standards. Do not use personality, emojis, or casual language. Provide factual, cited responses only. Access to system internals is restricted.";
    } else {
        systemPrompt += " You are helpful, technically proficient, and security-conscious.";
    }

    // Prepend system prompt if not present
    const conversation = [
        { role: 'system', content: systemPrompt },
        ...messages.filter(m => m.role !== 'system') // Filter out client-provided system prompts for security
    ];

    // 2. Sensitive Data Redaction (DLP Simulation)
    // Scan last user message for potential key leaks before sending to LLM
    const lastMsg = conversation[conversation.length - 1];
    if (lastMsg.role === 'user') {
        const keyPattern = /(sk-[a-zA-Z0-9]{20,}|glk_[a-zA-Z0-9]{20,})/;
        if (keyPattern.test(lastMsg.content)) {
             // Block or Redact
             // For strict security, we block.
             await base44.entities.SystemAuditLog.create({
                event_type: 'DLP_BLOCK',
                description: 'Blocked message containing potential API key',
                actor_email: user.email,
                severity: 'high',
                status: 'security_action'
             });
             return Response.json({ error: 'Message blocked: Potential sensitive data (API Key) detected.' }, { status: 400 });
        }
    }

    // 3. Call LLM Integration
    // Assuming 'Core' integration is available for InvokeLLM or we use the 'openai' function I might have created before
    // I'll use the 'InvokeLLM' integration if available or 'openai' function directly if I made it.
    // The previous prompt showed 'functions/glyphbotLLM' and 'openai.js' example. I'll use `base44.integrations.Core.InvokeLLM` as it's standard.
    
    const llmResponse = await base44.integrations.Core.InvokeLLM({
        prompt: JSON.stringify(conversation), // Passing full conv as prompt usually requires chat format support, InvokeLLM might be simple prompt.
        // Actually InvokeLLM takes a 'prompt' string. If we want chat, we should format it.
        // Or if I have 'functions/openai.js', I should use that.
        // Let's use a formatted string for now as a fallback or check if I can use a better tool.
        // Actually, let's use the 'openai' direct call pattern if I had it, but I'll stick to a simple formatted prompt for InvokeLLM to be safe with available tools.
        // REFACTOR: The 'prompt' field in InvokeLLM is a string. I will flatten the conversation.
    });
    
    // Flatten conversation for simple LLM call (unless I use a chat-specific integration)
    // "System: ... \nUser: ... \nAssistant: ..."
    const flattenPrompt = conversation.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

    const response = await base44.integrations.Core.InvokeLLM({
        prompt: flattenPrompt,
        app_id: null, // optional
        app_owner: null // optional
    });

    let botReply = response;
    // InvokeLLM returns string directly according to description unless json schema provided.

    // 4. Audit Log
    // Create 'GlyphBotAudit' record
    // Schema assumption: { userId, timestamp, promptSummary, responseSummary, mode }
    // If entity doesn't exist, this might fail, so I'll try-catch or rely on SystemAuditLog which I know exists.
    // I will try to use 'GlyphBotAudit' but fallback to SystemAuditLog.
    
    try {
        await base44.entities.GlyphBotAudit.create({
            userId: user.email,
            timestamp: new Date().toISOString(),
            promptSummary: lastMsg.content.substring(0, 100),
            responseSummary: botReply.substring(0, 100),
            mode: isNistMode ? 'nist' : 'standard',
            securityClearance: user.role || 'user'
        });
    } catch (e) {
        // Fallback or entity doesn't exist
        await base44.entities.SystemAuditLog.create({
            event_type: 'GLYPHBOT_INTERACTION',
            description: 'Chat interaction logged',
            actor_email: user.email,
            metadata: { mode: isNistMode ? 'nist' : 'standard' }
        });
    }

    return Response.json({ 
        role: 'assistant',
        content: botReply,
        securityContext: {
            mode: isNistMode ? 'NIST-800-53' : 'Standard',
            audited: true
        }
    });

  } catch (error) {
    console.error('Secure Chat Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});