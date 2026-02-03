import { useState, useEffect } from "react";
import HabitItem from "./component/HabitItem";
import styles from "./component/Habit.module.css";
import confetti from "canvas-confetti";

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits-v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [category, setCategory] = useState("Personal");

  const completedCount = habits.filter((h) => h.completed).length;
  const progress =
    habits.length === 0
      ? 0
      : Math.round((completedCount / habits.length) * 100);

  useEffect(() => {
    if (habits.length > 0 && progress === 100) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [progress, habits.length]);

  useEffect(() => {
    localStorage.setItem("habits-v1", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newHabit = {
      id: Date.now(),
      text,
      completed: false,
      category: category,
    };
    setHabits([...habits, newHabit]);
    setText("");
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const resetHabits = () => {
    if (window.confirm("Start a fresh day? All progress will be reset.")) {
      setHabits(habits.map((habit) => ({ ...habit, completed: false })));
    }
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to delete all habits?")) {
      setHabits([]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header>
          <h1>Habit Stack</h1>
          <div className={styles.progressInfo}>
            <span>Day Progress</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.fill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        <form onSubmit={addHabit} className={styles.inputArea}>
          <input
            type="text"
            placeholder="Add habits..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              background: "#020617",
              color: "white",
              borderRadius: "10px",
              padding: "0 5px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Health">Health</option>
          </select>
          <button type="submit">Add</button>
        </form>

        <div className={styles.list}>
          {habits.map((h) => (
            <HabitItem
              key={h.id}
              habit={h}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          ))}
        </div>

        {habits.length > 0 && (
          <div className={styles.btndiv}>
            <button onClick={resetHabits}>Reset Day</button>
            <button onClick={clearAll}>Clear All</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
