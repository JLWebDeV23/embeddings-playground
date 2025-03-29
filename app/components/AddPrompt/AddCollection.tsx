'use client';
import React, { cloneElement, useState } from 'react';
import TextBox from '../TextBox/TextBox';
import {
  createCollection,
  getCollectionsList,
  upsertPoints,
  collectionExists,
} from '../../utils/collection';

type AddCollectionProps = {};

const AddCollection: React.FC<AddCollectionProps> = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let collectionName = prompt(`Enter a collection name:
- - -
${(await getCollectionsList()).map((collection) => collection.name).join('\n')}
- - -
    `);
    const collection = await collectionExists(collectionName!);
    if (collectionName === null) {
      return;
      // check if the collection exists,
      // if exist, add points to the existing collection
    } else if (collection) {
      if (
        confirm(
          `"${collectionName}" already exists! Do you want to add more points existing "${collectionName}"?`
        )
      ) {
        // create points and add to the existing collection
        upsertPoints(collectionName!, inputValue);
        alert(`Points added to the ${collectionName}`);
      } else {
        // create a new collection and add points
        collectionName = prompt("Enter a 'new' collection name:");
        createCollection(collectionName!);
        upsertPoints(collectionName!, inputValue);
        alert(`Points added to the new collection: ${collectionName}`);
      }
    } else {
      createCollection(collectionName!);
      upsertPoints(collectionName!, inputValue);
      alert(`Points added to the collection: ${collectionName}`);
    }
    setInputValue('');
  };

  return (
    <section className="w-full">
      <TextBox
        placeholder="Prompt to store to collsection"
        nameBtn="Add"
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
    </section>
  );
};

export default AddCollection;
