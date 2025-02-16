const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const resolvers = {
    getUser: async ({ id }) => {
        return await User.findById(id);
    },
    
    register: async ({ username, email, password }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    },
    
    login: async ({ username, password }) => {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Incorrect password');
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    },
    
    updateUser: async ({ id, language, gradeLevels, references }) => {
        return await User.findByIdAndUpdate(id, { language, gradeLevels, references }, { new: true });
    }
};

module.exports = resolvers; 