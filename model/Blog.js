import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const blogSchema = new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
    },
    content: String,
    createdAt: Date,
    updatedAt: Date,
  });


const Blog = model('Blog', blogSchema)
export default Blog