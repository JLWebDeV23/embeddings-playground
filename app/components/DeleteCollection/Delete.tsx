import { QdrantClient } from "@qdrant/js-client-rest";
import React from "react";

type DeleteProps = {
  client: QdrantClient;
};

const Delete: React.FC<DeleteProps> = ({ client }) => {
  const getCollectionsList = async () => {
    const response = await client.getCollections();
    return response.collections;
  };

  const deleteCollection = async () => {
    // const name = prompt("Enter the name of the collection to delete");
    const name = prompt(`Enter the name of the collection to delete:
- - -
${(await getCollectionsList())
  .map((collection) => collection.name)
  .join("\n")}
- - -
`);
    const response = await client.getCollections();
    const collectionNames = response.collections.map(
      (collection) => collection.name
    );
    try {
      if (collectionNames.includes(name!)) {
        const delete_status = await client.deleteCollection(name!);
        alert(`Collection ${name} deleted successfully!`);
        location.reload();
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <button
      className="delete-btn mt-5 border p-2 rounded text-white bg-red-500 hover:bg-red-600"
      onClick={deleteCollection}
    >
      Delete
    </button>
  );
};

export default Delete;
