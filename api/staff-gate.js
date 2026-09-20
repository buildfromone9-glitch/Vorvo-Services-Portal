/**
 * API: Staff Gate Check
 *
 * Verifies the staff password for the surplus/wholesale marketing pages
 * server-side, so the real password is never shipped to the browser or
 * committed to source control. Set STAFF_GATE_PASSWORD in the Vercel
 * project's environment variables.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const expected = process.env.STAFF_GATE_PASSWORD;
  if (!expected) {
    console.error('[STAFF-GATE] STAFF_GATE_PASSWORD is not configured in the environment');
    return res.status(500).json({ ok: false, error: 'Staff gate is not configured' });
  }

  const { password } = req.body || {};

  if (typeof password === 'string' && password === expected) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
