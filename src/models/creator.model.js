const mongoose = require('mongoose');

const dailyRecordSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        issues: {
            type: Number,
            required: true
        }
    }
);

const creatorSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    totalIssues: {
      type: Number,
      required: true,
    },
    dailyRecord: {
        type: dailyRecordSchema,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Token
 */
const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;