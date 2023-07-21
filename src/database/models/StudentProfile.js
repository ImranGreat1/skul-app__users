const { model, Schema } = require("mongoose");
const { schemaOptions } = require("../../utils");


const studentProfileSchema = new Schema
(
    {
        school: {
            type: String,
            required: true
        },
        faculty: String,
        department: String,
        level: String,
        studentId: String,
        program: String,
        roles: [String],
        posts: [String],
        subscriptions: [String],
        userSubscriptions: [String]
    }, 
    schemaOptions
); 

const StudentProfile = model("StudentProfile", studentProfileSchema)

module.exports = StudentProfile;