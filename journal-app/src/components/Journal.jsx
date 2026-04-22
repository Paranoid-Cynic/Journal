import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '❤️', label: 'Love' },
];

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ title: '', text: '', mood: MOODS[0] });
  const [editingId, setEditingId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'entries'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setEntries(data);
    });
    return unsubscribe;
  }, [user]);

  const openModal = (entry = null) => {
    if (entry) {
      setCurrentEntry(entry);
      setEditingId(entry.id);
    } else {
      setCurrentEntry({ title: '', text: '', mood: MOODS[0] });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const saveEntry = async (e) => {
    e.preventDefault();
    if (!user) return;

    const entryData = {
      ...currentEntry,
      userId: user.uid,
      date: editingId ? currentEntry.date : Date.now(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'entries', editingId), entryData);
      } else {
        await addDoc(collection(db, 'entries'), entryData);
      }
      closeModal();
    } catch (error) {
      alert('Error saving entry: ' + error.message);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, 'entries', id));
    } catch (error) {
      alert('Error deleting entry: ' + error.message);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="journal">
      <header className="app-header">
        <h1>📖 My Journal</h1>
        <p>{entries.length} entries</p>
      </header>
      <main className="entries-list">
        {entries.length === 0 ? (
          <div className="empty-state">
            <p>No entries. + to add!</p>
          </div>
        ) : (
          entries.sort((a, b) => b.date - a.date).map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <span className="entry-mood">{entry.mood.emoji}</span>
                <div className="entry-actions">
                  <button className="edit-btn" onClick={() => openModal(entry)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>Delete</button>
                </div>
              </div>
              <h3 className="entry-title">{entry.title || 'Untitled'}</h3>
              <p className="entry-date">{formatDate(entry.date)}</p>
              <p className="entry-preview">{entry.text.substring(0, 100)}...</p>
            </div>
          ))
        )}
      </main>
      <button className="fab" onClick={() => openModal()}>+</button>
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit' : 'New Entry'}</h2>
            <form onSubmit={saveEntry}>
              <input
                placeholder="Title"
                value={currentEntry.title}
                onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              />
              <div className="mood-selector">
                {MOODS.map((mood) => (
                  <button
                    type="button"
                    key={mood.label}
                    className={`mood-btn ${currentEntry.mood.label === mood.label ? 'active' : ''}`}
                    onClick={() => setCurrentEntry({ ...currentEntry, mood })}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Your thoughts..."
                value={currentEntry.text}
                onChange={(e) => setCurrentEntry({ ...currentEntry, text: e.target.value })}
                rows="6"
              />
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;

