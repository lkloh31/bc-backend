import { verifyToken } from "#utils/jwt";
import { getUserById } from "#db/queries/users";

export default async function getUserFromToken(req, res, next) {
  try {
    const auth = req.get("Authorization") || "";
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (!m) { req.user = null; return next(); }

    const payload = await verifyToken(m[1]);
    if (!payload?.id) { req.user = null; return next(); }

    const user = await getUserById(payload.id);
    if (!user) { req.user = null; return next(); }

    req.user = { id: user.id, email: user.email, name: user.name };
    return next();
  } catch (e) {
    // swallow token errors; do NOT send a response here
    req.user = null;
    return next();
  }
}
