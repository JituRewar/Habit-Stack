import React from 'react'
import styles from './Habit.module.css';

function HabitItem({habit, onToggle, onDelete}) {
    if (!habit) return null;

    return (
        <div className={`${styles.item} ${habit.completed ? styles.done : ''}`}>
           <div className={styles.left} onClick={() => onToggle(habit.id)}>
                <div className={styles.checkbox}>
                    {habit.completed && "✓"}
                </div>

                <div className={styles.textGroup}>
                    <span className={styles.habitText}>{habit.text}</span>
                    <span className={styles.categoryBadge}>
                        {habit.category || 'Personal'}
                    </span>
                </div>
           </div>

           <button className={styles.deleteBtn} onClick={() => onDelete(habit.id)}>
               ×
           </button>
        </div>
    );
}

export default HabitItem;