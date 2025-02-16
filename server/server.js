require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const authMiddleware = require('./middleware/auth');
const fileRoutes = require('./routes/fileRoutes');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware للمصادقة
app.use(authMiddleware);

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// إعداد GraphQL API مع المصادقة
app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: { user: req.user, userRole: req.userRole },
})));

// تكامل نظام إدارة الملفات
app.use('/files', fileRoutes);

// تحسين التعامل مع الأخطاء
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
}); 