document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 1000, once: true });

  const deviceId = localStorage.getItem("deviceId") || crypto.randomUUID();
  localStorage.setItem("deviceId", deviceId);

  fetchVotes();

  const voteButton = document.getElementById("voteButton");
  if (voteButton) voteButton.addEventListener("click", voteForSrikar);

  const suggestionButton = document.getElementById("suggestionSubmit");
  if (suggestionButton) suggestionButton.addEventListener("click", sendSuggestion);

  async function voteForSrikar(event) {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Vote successful!");
        document.getElementById("vote-count").innerText = data.totalVotes;
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      console.error("Voting failed:", error);
      alert("⚠️ Voting failed. Please try again.");
    }
  }

  async function fetchVotes() {
    try {
      const res = await fetch('http://localhost:3000/votes');
      const { totalVotes } = await res.json();
      document.getElementById("vote-count").innerText = totalVotes;
    } catch (error) {
      console.error("Fetching votes failed:", error);
    }
  }

  async function sendSuggestion(event) {
    event.preventDefault();
    const suggestionInput = document.getElementById('suggestionText');
    if (!suggestionInput) return;

    const suggestion = suggestionInput.value.trim();
    if (!suggestion) {
      alert("Please write something before submitting.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/submit-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion })
      });

      if (res.ok) {
        alert("✅ Suggestion sent! Thank you!");
        suggestionInput.value = "";
      } else {
        alert("❌ Failed to send suggestion.");
      }
    } catch (error) {
      console.error("Sending suggestion failed:", error);
      alert("⚠️ An error occurred.");
    }
  }
});
