import express from 'express';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    return res.json({ message: 'Bienvenido a la API de la plataforma de eventos' });
});

app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
})