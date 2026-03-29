// Orion API Client
// Vite uses import.meta.env with VITE_ prefix
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

// ─── Auth header helper ──────────────────────────────────────────
export function getAuthHeader() {
  const token = localStorage.getItem("aura_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Generic helpers ────────────────────────────────────────────────────────
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `POST ${path} failed: ${res.status}`);
  }
  return res.json();
}

// ─── Auth API helpers ───────────────────────────────────────────────────────

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Not authenticated");
  return data.user;
}

// ─── Domain helpers ──────────────────────────────────────────────────────────

/** Returns array of business objects */
export async function getBusinesses() {
  const res = await apiGet("/businesses");
  return res.data || [];
}

/** Returns a single business object by ID */
export async function getBusinessById(id) {
  if (!id) return null;
  const res = await apiGet(`/businesses/${id}`);
  return res.data || null;
}

/**
 * Returns conversations for a business.
 * @param {string} businessId
 * @param {{ status?: string }} [opts]
 */
export async function getConversations(businessId, opts = {}) {
  if (!businessId) return [];
  const params = new URLSearchParams({ business_id: businessId });
  if (opts.status) params.set("status", opts.status);
  const res = await apiGet(`/conversations?${params}`);
  return res.data || [];
}

/**
 * Returns messages in a specific conversation.
 * @param {string} conversationId
 */
export async function getConversationMessages(conversationId) {
  if (!conversationId) return [];
  const res = await apiGet(`/conversations/${conversationId}/messages`);
  return res.data || [];
}

/**
 * Returns recent messages across all conversations for a business.
 * @param {string} businessId
 */
export async function getRecentMessages(businessId) {
  if (!businessId) return [];
  const res = await apiGet(`/messages/recent?business_id=${businessId}`);
  return res.data || [];
}

/**
 * Sends a WhatsApp message.
 * @param {{ businessId: string, customerPhone: string, text: string }} params
 */
export async function sendMessage({ businessId, customerPhone, text }) {
  const res = await apiPost("/messages/send", {
    business_id: businessId,
    customer_phone: customerPhone,
    text,
  });
  return res.data;
}

// ─── Agent API helpers ──────────────────────────────────────────────────────

/**
 * Load (or auto-create) the agent config for a business.
 * Returns { ...agent, documents: [] }
 * @param {string} businessId
 */
export async function getAgent(businessId) {
  if (!businessId) return null;
  const res = await apiGet(`/agents?business_id=${businessId}`);
  return res.data || null;
}

/**
 * Create / upsert an agent config for a business.
 * @param {Object} data - { businessId, assistantName, tagline, ... }
 */
export async function createAgent(data) {
  const body = {
    business_id: data.businessId,
    assistantName: data.assistantName,
    tagline: data.tagline,
    companyName: data.companyName,
    website: data.website,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
  };
  const res = await apiPost("/agents", body);
  return res.data;
}

/**
 * Patch any fields on an agent.
 * @param {string} agentId
 * @param {Object} fields
 */
export async function updateAgent(agentId, fields) {
  const res = await fetch(`${API_BASE}/agents/${agentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `PATCH /agents/${agentId} failed: ${res.status}`);
  }
  const data = await res.json();
  return data.data;
}

/**
 * List documents for an agent (filtered by type if given).
 * @param {string} agentId
 * @param {string} [type] - 'knowledge' | 'vision' | 'links'
 */
export async function getAgentDocuments(agentId, type) {
  if (!agentId) return [];
  const params = type ? `?type=${type}` : "";
  const res = await apiGet(`/agents/${agentId}/documents${params}`);
  return res.data || [];
}

/**
 * Upload a file to an agent's knowledge base.
 * @param {string} agentId
 * @param {File} file - browser File object
 * @param {string} [type] - 'knowledge' | 'vision' | 'links'
 */
export async function uploadAgentDocument(agentId, file, type = "knowledge") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch(`${API_BASE}/agents/${agentId}/documents`, {
    method: "POST",
    headers: { ...getAuthHeader() }, // no Content-Type – let browser set multipart boundary
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Upload failed: ${res.status}`);
  }
  const data = await res.json();
  return data.data;
}

/**
 * Delete a document from an agent's knowledge base.
 * @param {string} agentId
 * @param {string} docId
 */
export async function deleteAgentDocument(agentId, docId) {
  const res = await fetch(`${API_BASE}/agents/${agentId}/documents/${docId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `DELETE failed: ${res.status}`);
  }
  return (await res.json()).data;
}

// ─── Calendly Integration ────────────────────────────────────────────────────

export async function getCalendlyOAuthUrl(businessId) {
  const res = await apiGet(`/calendly/oauth/url?business_id=${businessId}`);
  return res.url;
}

export async function getCalendlyStatus(businessId) {
  const res = await fetch(`${API_BASE}/calendly/status?business_id=${businessId}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return { connected: false };
  return res.json();
}

export async function getCalendlyEventTypes(businessId) {
  const res = await apiGet(`/calendly/event-types?business_id=${businessId}`);
  return res.data || [];
}

export async function setCalendlyEventType(businessId, eventType) {
  return apiPost('/calendly/settings', {
    business_id: businessId,
    event_type_uri: eventType.uri,
    event_type_name: eventType.name,
    scheduling_url: eventType.scheduling_url,
  });
}

export async function disconnectCalendly(businessId) {
  const res = await fetch(`${API_BASE}/calendly/disconnect?business_id=${businessId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to disconnect Calendly');
  return res.json();
}

export async function getCalendlyBookings(businessId) {
  const res = await apiGet(`/calendly/bookings?business_id=${businessId}`);
  return res.data || [];
}

// ─── Google Calendar Integration ─────────────────────────────────────────────

export async function getGCalOAuthUrl(businessId) {
  const res = await apiGet(`/gcal/oauth/url?business_id=${businessId}`);
  return res.url;
}

export async function getGCalStatus(businessId) {
  const res = await fetch(`${API_BASE}/gcal/status?business_id=${businessId}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return { connected: false };
  return res.json();
}

export async function getGCalCalendars(businessId) {
  const res = await apiGet(`/gcal/calendars?business_id=${businessId}`);
  return res.data || [];
}

export async function setGCalCalendar(businessId, calendar) {
  return apiPost('/gcal/settings', {
    business_id: businessId,
    calendar_id: calendar.id,
    calendar_name: calendar.summary,
  });
}

export async function disconnectGCal(businessId) {
  const res = await fetch(`${API_BASE}/gcal/disconnect?business_id=${businessId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to disconnect Google Calendar');
  return res.json();
}

// ─── Google Calendar Booking ─────────────────────────────────────────────────

export async function bookGCalSlot(businessId, calendarId, title, datetime) {
  return apiPost('/gcal/book-slot', {
    business_id: businessId,
    calendar_id: calendarId,
    title,
    datetime,
  });
}

export async function getAvailableGCalSlots(businessId, days = 7) {
  const res = await apiGet(`/gcal/available-slots?business_id=${businessId}&days=${days}`);
  return res.data || [];
}

export async function getGCalBookings(businessId, days = 30) {
  const res = await apiGet(`/gcal/bookings?business_id=${businessId}&days=${days}`);
  return res.data || [];
}
