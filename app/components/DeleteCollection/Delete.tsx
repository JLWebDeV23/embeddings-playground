import { getCollectionsList, deleteCollection } from "@/app/utils/collection";
import { QdrantClient } from "@qdrant/js-client-rest";
import React from "react";

type DeleteProps = {};

const Delete: React.FC<DeleteProps> = () => {
  const handleDelete = async () => {
    // const name = prompt("Enter the name of the collection to delete");
    const name = prompt(`Enter the name of the collection to delete:
- - -
${(await getCollectionsList()).map((collection) => collection.name).join("\n")}
- - -
`);
    const response = await getCollectionsList();
    const collectionNames = response.map((collection) => collection.name);
    try {
      if (collectionNames.includes(name!)) {
        const delete_status = await deleteCollection(name!);
        if (delete_status) {
          alert(`Collection ${name} deleted successfully!`);
        }
        location.reload();
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <button
      className="delete-btn mt-5 border p-2 rounded text-white bg-red-500 hover:bg-red-600"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
};

export default Delete;
