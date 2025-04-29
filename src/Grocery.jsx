import React, { useState, useEffect } from "react";
import "./Grocery.css";

const Grocery = () => {
  const [inputValue, setInputValue] = useState("");
  const [groceryItems, setGroceryItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem("grocery_data");
    if (savedItems) {
      try {
        setGroceryItems(JSON.parse(savedItems));
      } catch (err) {
        console.error("Failed to parse stored list:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("grocery_data", JSON.stringify(groceryItems));
  }, [groceryItems]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      triggerNotification("Please enter an item name", false);
      return;
    }
    const entry = {
      id: new Date().getTime(),
      name: inputValue.trim(),
      isDone: false,
    };
    setGroceryItems((prev) => [...prev, entry]);
    setInputValue("");
    triggerNotification("Item successfully added", true);
  };

  const markComplete = (itemId) => {
    setGroceryItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, isDone: !item.isDone } : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setGroceryItems((items) => items.filter((item) => item.id !== itemId));
    triggerNotification("Item removed from list", true);
  };

  const triggerNotification = (text, success) => {
    const notifId = Date.now();
    const newNotification = {
      id: notifId,
      message: text,
      success,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((note) => note.id !== notifId));
    }, 5000);
  };

  return (
    <section className="section-center">
      {/* Notification Popups */}
      <div className="toast-container">
        {notifications.map(({ id, message, success }) => (
          <div key={id} className="toast">
            <button
              className="close-btn"
              onClick={() =>
                setNotifications((prev) => prev.filter((note) => note.id !== id))
              }
            >
              ×
            </button>
            <p>{message}</p>
            <div
              className="timer"
              style={{ backgroundColor: success ? "#00b300" : "#cc0000" }}
            ></div>
          </div>
        ))}
      </div>

      <form className="grocery-form" onSubmit={handleFormSubmit}>
        <h3 className="grocery-title">Grocery Tracker</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. bread"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            Add
          </button>
        </div>
      </form>

      {groceryItems.length > 0 && (
        <div className="grocery-container">
          <ul className="grocery-list">
            {groceryItems.map((item) => (
              <li key={item.id} className="grocery-item">
                <div className="item-content">
                  <input
                    type="checkbox"
                    checked={item.isDone}
                    onChange={() => markComplete(item.id)}
                  />
                  <span className={item.isDone ? "completed" : ""}>
                    {item.name}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Grocery;
