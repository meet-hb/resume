const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String }, // URL or class name
    level: { type: Number, default: 0 }, // 0 to 100
    category: { type: String, enum: ['Frontend', 'Backend', 'Tools', 'Other'], default: 'Frontend' }
});

module.exports = mongoose.model('Skill', SkillSchema);
