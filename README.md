# So what is this friend to friend message system?

 So the project developed by me is having main idea of creating a great web based massaging app , So as a first move for that I made this simple project to get an idea for making that project.

 so when it comes to this project what you will be able to do:
   1. you will be able to encrypt a message with or without a password.
   2. you will be able to decrypt a message with a ID you have got + password (if it one was used for encryption)
   3. you are able to keep the message or delete it after it being decrypted if you want.
   4. Report me bugs and errors in this site.

---

## Encryption 

 This might not be as same as the real encryption in the irl.But this is how my small system work.
   1. get the message from the user.
   2. use base 64 level encryption.
   3. send it to database with a specific ID for that encrypted massage.
   4. Store the ID + msg in sideby side.

---

## Decryption
 So as same as encryption this is just a small system made by me. This is how it work.
   1. When the  user provide only ID or the ID + password Authorize with database check for that ID.
   2. Check if the password used was correct.
   3. Return it to the user with the possibility of deleting the message or keepig it in the database.

---

## Info about upcoming updates for this

 With this kind of database encryption method I will make a full working messaging app in the next update.