const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        contenido: {
            type: String,
            limit: 200
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId, ref: "User",
        },
        news: {
            type: Schema.Types.ObjectId, ref: "News",
        }
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;



