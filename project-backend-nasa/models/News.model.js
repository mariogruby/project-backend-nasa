const { Schema, model } = require("mongoose");

const newSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        explanation: {
            type: String,
            required: true
        },
        imageURL: {
            type: String
        },
        comments: {
            type: [Schema.Types.ObjectId], ref: "Comment",
        }
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const New = model("New", newSchema);

module.exports = New;
