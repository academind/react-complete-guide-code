import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    setUserIngredients(prevIngredients => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient }
    ]);
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
};

export default Ingredients;
