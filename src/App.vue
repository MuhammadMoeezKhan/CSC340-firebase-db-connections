<template>
  <div class="container">
    <h1>Add New Item</h1>
    <form @submit.prevent="addItem" class="form">
      <div class="form-group">
        <label for="item">Item:</label>
        <input type="text" id="item" v-model="item" required class="input-field">
      </div>
      <div class="form-group">
        <label for="type">Type:</label>
        <input type="text" id="type" v-model="type" required class="input-field">
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="number" id="price" v-model="price" required class="input-field">
      </div>
      <div class="form-group">
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" v-model="quantity" required class="input-field">
      </div>
      <button type="submit" class="submit-button">Add Item</button>
    </form>

    <h2>Items</h2>
    <ul class="item-list">
      <li v-for="(item, index) in items" :key="index" class="item">
        <div class="item-details">
          <div class="item-info">
            <div class="item-name">Item: {{ item.item }}</div>
            <div class="item-type">Type: {{ item.type }}</div>
            <div class="item-quantity">Quantity: {{ item.quantity }}</div>
          </div>
          <div class="item-actions">
            <button @click="deleteItem(index)" class="delete-button">Delete</button>
            <button @click="displayCategory(item.type)" class="category-button">
              {{ showCategories ? 'Hide Category' : 'Show Category' }}
            </button>
          </div>
          <div v-if="showCategories" class="category-details">
            <div class="category-info">City: {{ city }}</div>
            <div class="category-info">State: {{ state }}</div>
          </div>
        </div>
      </li>
    </ul>

    <button @click="scrollToTop" class="scroll-button">Up</button>
    <div class="total">Total: ${{ computeTotal() }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'; // Import getDocs, collection, and deleteDoc
import db from '../firebase/init.js';

export default {
  data() {
    return {
      item: '',
      type: '',
      price: 0,
      quantity: 0,
      items: [], // Initialize an empty array for storing items
      showCategories: false,
      city: '',
      state: '',
    };
  },
  methods: {
    async addItem() {
      try {
        const newItem = {
          item: this.item,
          type: this.type,
          price: this.price,
          quantity: this.quantity,
        };

        // Add the new item to Firebase collection 'items'
        const docRef = await addDoc(collection(db, 'items'), newItem);

        console.log('Item added successfully with ID: ', docRef.id);

        // Clear form fields after submission
        this.item = '';
        this.type = '';
        this.price = 0;
        this.quantity = 0;
      } catch (error) {
        console.error('Error adding item: ', error);
      }
    },

    async deleteItem(index) {
      try {
        const itemId = this.items[index].id;
        await deleteDoc(doc(collection(db, 'items'), itemId));
        this.items.splice(index, 1); // Remove the item from the local array
        this.computeTotal(); // Recalculate the total
      } catch (error) {
        console.error('Error deleting item: ', error);
      }
    },

    computeTotal() {
      let total = 0;
      for (const item of this.items) {
        total += item.price * item.quantity;
      }
      return total;
    },

    async displayCategory(category) {
      // Toggle the 'showCategories' flag
      this.showCategories = !this.showCategories;

      if (this.showCategories) {
        try {
          const querySnapshot = await getDocs(collection(db, 'storeInventory'));
          querySnapshot.forEach((doc) => {
            if (doc.id === category) {
              this.city = doc.data().city;
              this.state = doc.data().state;
            }
          });
        } catch (error) {
          console.error('Error fetching category: ', error);
        }
      }
    },
  },

  async mounted() {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      querySnapshot.forEach((doc) => {
        const item = {
          id: doc.id,
          ...doc.data(),
        };
        this.items.push(item);
      });
      this.computeTotal(); // Calculate the initial total
    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  },
};
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.form {
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
  text-align: left;
}

.form-group {
  margin: 10px 0;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.submit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.item-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.item {
  background-color: #fff;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Add new styles for the Up button */

.scroll-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  margin: 20px 0;
  transition: background-color 0.3s;
}

.scroll-button:hover {
  background-color: #0056b3;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Center content vertically */
}

.form {
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

/* Add new item form styles */

.item-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.item {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.item-info {
  flex: 1;
}

.item-actions {
  display: flex;
  align-items: center;
}

.item-name {
  font-weight: bold;
  margin-right: 10px;
  color: #007bff;
}

.item-type {
  font-weight: bold;
  color: #28a745;
}

.item-quantity {
  font-weight: bold;
  color: #6c757d;
}

/* Other styles */

.delete-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 5px;
}

.category-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 5px;
}

.category-details {
  background-color: #f8d7da;
  border: 1px solid #d73d4a;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  width: 100%;
  color: #721c24;
  font-weight: bold;
}

.total {
  font-weight: bold;
  margin-top: 10px;
  font-size: 18px;
  color: #343a40;
}
</style>