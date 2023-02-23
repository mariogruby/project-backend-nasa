const { Schema, model } = require("mongoose");

const newSchema = new Schema(
    {
        date: {
            type: String,
            required: true
        },
        comments: [{
            type:Schema.Types.ObjectId, ref: "Comment",
        }],
        title: {
            type: String
        }
    },

    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const News = model("News", newSchema);

module.exports = News;
