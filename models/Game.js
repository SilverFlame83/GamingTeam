const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  price: {
    type: Number,
    minLenght: 1,
    required: [true, "Price must be positive number and no more than 100!"],
  },
  description: {
    type: String,
    minLenght: 10,
    required: [true, "Description must be at least 10 characters long!"],
  },
  genre: {
    type: String,
    minLenght: 10,
    required: [true, "Genre must be at least 2 characters long!"],
  },
  platform: {
    type: String,
    enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
    required: [
      true,
      'Platform must include one of the following: "PC", "Nintendo", "PS4", "PS5", "XBOX"!',
    ],
  },
  boughtBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Game", schema);
