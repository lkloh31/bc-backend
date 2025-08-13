import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  createJournalEntry,
  getJournalEntriesByUserId,
  updateJournalEntry,
  deleteJournalEntry,
} from "../db/queries/journal.js";

const journalRouter = express.Router();

// GET /api/journal - Get all entries for the logged-in user
journalRouter.get("/", requireUser, async (req, res) => {
  const entries = await getJournalEntriesByUserId(req.user.id);
  res.json(entries);
});

// POST /api/journal - Create a new journal entry
journalRouter.post("/", requireUser, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newEntry = await createJournalEntry({
    userId: req.user.id,
    title,
    content,
    tags,
  });

  res.status(201).json(newEntry);
});

// PUT /api/journal/:id - Update a journal entry
journalRouter.put("/:id", requireUser, async (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    const updatedEntry = await updateJournalEntry(id, req.user.id, { title, content, tags });

    if (!updatedEntry) {
        return res.status(404).json({ error: "Entry not found or you do not have permission to edit it." });
    }

    res.json(updatedEntry);
});


// DELETE /api/journal/:id - Delete a journal entry
journalRouter.delete("/:id", requireUser, async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteJournalEntry(id, req.user.id);

  if (!deleted) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.json({ message: "Entry deleted successfully" });
});

export default journalRouter;