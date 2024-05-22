import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editItem, setEditItem] = useState(null);

  // Fetch items
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://crud-git-deploy-backend.vercel.app/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Create item
  const createItem = async () => {
    try {
      const response = await axios.post('https://crud-git-deploy-backend.vercel.app/items', {
        name,
        description,
      });
      setItems([...items, response.data]);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  // Update item
  const updateItem = async (id) => {
    try {
      const response = await axios.put(`https://crud-git-deploy-backend.vercel.app/items/${id}`, {
        name,
        description,
      });
      setItems(items.map((item) => (item._id === id ? response.data : item)));
      setEditItem(null);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://crud-git-deploy-backend.vercel.app/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      updateItem(editItem._id);
    } else {
      createItem();
    }
  };

  return (
    <div className="App">
      <h1>CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">{editItem ? 'Update' : 'Create'}</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => {
              setEditItem(item);
              setName(item.name);
              setDescription(item.description);
            }}>Edit</button>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
