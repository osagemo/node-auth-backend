const { Model } = require("objection");
const bcrypt = require("bcrypt");

class User extends Model {
  static get tableName() {
    return "users";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],

      properties: {
        id: { type: "integer" },
        email: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 1, maxLength: 255 },
        last_login_at: { type: "string", format: "date-time" },
        last_logout_at: { type: "string", format: "date-time" },
      },
      additionalProperties: false,
    };
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

module.exports = User;

// passwordChangedAt should be created via database trigger, other timestamps by API
// Password should be encrypted before touching the db
// comparepassword could be moved out of Model I guess, helper method used in auth
