import axios from "axios";
import useAuth from "./firebase/controllers/userController";
import { ITimeItem } from "./interfaces";

// Done! Congratulations on your new bot.You will find it at
// t.me / SOLO_nails_messege_bot.You can now add a description,
// about section and profile picture for your bot,
// see / help for a list of commands.By the way,
// when you've finished creating your cool bot,
// ping our Bot Support if you want a better username for it.
// Just make sure the bot is fully operational before you do this. 
// Use this token to access the HTTP API: 5447912408: AAHCOlfCJP2h7ODJsVqEgIuIKhgKwh_A0lk 
// Keep your token secure and store it safely,
// it can be used by anyone to control your bot.
// For a description of the Bot API, see this page: https://core.telegram.org/bots/api

// https://api.telegram.org/bot5447912408:AAHCOlfCJP2h7ODJsVqEgIuIKhgKwh_A0lk/sendMessage?chat_id=-727953549&text=Hello


export const useTelegram = () => {
  const BOT_TOKEN = '5447912408:AAHCOlfCJP2h7ODJsVqEgIuIKhgKwh_A0lk';
  const CHAT_ID = '-727953549';
  const CHAT_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}`;
  // https://api.telegram.org/bot5447912408:AAHCOlfCJP2h7ODJsVqEgIuIKhgKwh_A0lk/sendMessage?chat_id=-727953549&text=

  // <a href='https://google.com'></a>
  const { getUserInfo } = useAuth();

  const sendNotification = async (time: ITimeItem) => {

    const user = await getUserInfo(time.client.uid);

    const messege = `
    Новая запись: %0A
    Дата: %0A
      - ${time.date.formate} | ${time.time} %0A
    Клиент: %0A
      - ${user?.name} %0A
      - ${user?.instagram} %0A
      - ${user?.phone}
    `;
    const MESSAGE_URL = `${CHAT_URL}&text=${messege}`;

    await axios.post(MESSAGE_URL);
  };

  return {
    sendNotification,
  }
}


