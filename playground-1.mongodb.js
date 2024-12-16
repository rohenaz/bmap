/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("bmap");

// Search for documents in the current collection.
db.getCollection("post")
  .find(
    {
      /*
       * Filter
       * fieldA: value or expression
       */
      _id: "266c2a52d7d1f30709c847424d8195eeef8a0172f190be6244e5c8a1c2e44d94",
    },
    {
      /*
       * Projection
       * _id: 0, // exclude _id
       * fieldA: 1 // include field
       */
    }
  )
  .sort({
    /*
     * fieldA: 1 // ascending
     * fieldB: -1 // descending
     */
  });
