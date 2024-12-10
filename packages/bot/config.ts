import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export default {
    BOT_TOKEN: process.env.BOT_TOKEN,
    WEBAPP_URL: process.env.WEBAPP_URL
};
