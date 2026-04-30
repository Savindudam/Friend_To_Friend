const firebaseConfig = {
  apiKey: "AIzaSyAYmkPycbk7TT853APdKzf7zrg1lcFxKUI",
  authDomain: "friend-friend-c3ec6.firebaseapp.com",
  databaseURL: "https://friend-friend-c3ec6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "friend-friend-c3ec6",
  storageBucket: "friend-friend-c3ec6.firebasestorage.app",
  messagingSenderId: "652656370321",
  appId: "1:652656370321:web:d2fc301dcd2f5e7e06d530",
  measurementId: "G-8TSMWCHCXG"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1499056978247417897/bjMuV_2kTE-zkyXjQjOALmXlWj3zG3gR4HB5txkMQtRsh0ks3Dzfg1VcjuLVJ0hvb0pj";